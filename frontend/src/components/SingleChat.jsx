import { useEffect, useState, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import axios from "axios";
import ProfileModal from "./ProfileModal";

// const ENDPOINT = "http://localhost:5001";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const messagesEndRef = useRef(null);
  const menuRef = useRef();

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  useEffect(() => {
    socket = io(BASE_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification, "------------");
  useEffect(() => {
    const messageListener = (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
        setFetchAgain((prev) => !prev);
      }
    };

    socket.on("message received", messageListener);

    return () => {
      socket.off("message received", messageListener);
    };
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${BASE_URL}/api/message`,
          { content: newMessage, chatId: selectedChat },
          config
        );
        setNewMessage("");
        setMessages([...messages, data]);
        setFetchAgain((prev) => !prev);
        socket.emit("new message", data);
      } catch (error) {
        console.error("Message send error", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const clearChat = async () => {
    if (!selectedChat) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to clear this chat?"
    );
    if (!confirmDelete) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(
        `${BASE_URL}/api/message/clear/${selectedChat._id}`,
        config
      );
      setMessages([]); // Clear messages from UI
      setMenuOpen(false); // Close the dropdown
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  return selectedChat ? (
    <div className="flex flex-col h-screen w-full bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 flex justify-between items-center p-1 relative">
        <div className="flex gap-2 items-center">
          <img
            src={
              getSenderFull(user, selectedChat.users)?.pic ||
              "https://i.pravatar.cc/40"
            }
            className="w-10 h-10 rounded-full"
            alt="avatar"
          />
          <h2 className="font-semibold text-lg">
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : getSender(user, selectedChat.users)}
          </h2>
        </div>

        {/* Icons + Dropdown */}
        <div
          className="flex gap-4 text-gray-500 text-xl relative"
          ref={menuRef}
        >
          <i className="fas fa-video cursor-pointer"></i>
          <i
            className="fas fa-ellipsis-v cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          ></i>
          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 top-10 z-50 w-44 bg-white border border-gray-200 shadow-lg rounded-xl py-2 animate-fade-in">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowProfileModal(true);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <i className="fas fa-user-circle text-gray-500"></i>
                <span>View Profile</span>
              </button>
              <button
                onClick={clearChat}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <i className="fas fa-trash-alt"></i>
                <span>Clear Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          <ScrollableChat messages={messages} />
        )}
        {istyping && (
          <p className="text-xs italic text-gray-500 mt-1">typing...</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Bar */}
      <div className="p-2 mb-[100px]">
        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
          <i className="far fa-smile text-gray-400 text-xl mr-3"></i>
          <input
            type="text"
            placeholder="Type a message here.."
            className="flex-1 outline-none text-sm text-gray-700"
            value={newMessage}
            onChange={typingHandler}
            onKeyDown={sendMessage}
          />
          <i className="fas fa-paperclip text-gray-400 text-lg mx-3 cursor-pointer"></i>
          <i className="fas fa-microphone text-gray-400 text-lg mr-3 cursor-pointer"></i>
          <button
            onClick={sendMessage}
            className="bg-purple-600 w-10 h-10 flex items-center justify-center rounded-full text-white text-lg"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={getSenderFull(user, selectedChat.users)}
      />
      ;
    </div>
  ) : (
    <div className="h-full w-full flex items-center justify-center text-gray-500 bg-white">
      <p className="text-xl font-medium italic">
        Click on a user to start chatting
      </p>
    </div>
  );
};

export default SingleChat;
