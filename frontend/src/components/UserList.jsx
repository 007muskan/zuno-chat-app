import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { toast } from "sonner";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
import { FaPlus } from "react-icons/fa";
import CreateGroupModal from "./CreateGroupModal";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const UserList = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchChats = async () => {
    if (!user || !user.token) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${BASE_URL}/api/user/login`,
        { email, password },
        config
      );
      setChats(data);
    } catch (error) {
      toast.error("Failed to fetch chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    if (user) fetchChats();
  }, [fetchAgain, user]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    if (window.location.pathname !== "/chats") {
      navigate("/chats");
    }
  };

  return (
    <div className="w-[360px] bg-white/70 backdrop-blur-md p-6 border-r border-gray-200 h-screen shadow-xl rounded-r-2xl overflow-hidden">
      {/* Title + Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Chats</h2>
        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="flex items-center gap-2 bg-white bg-opacity-30 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-purple-700 border border-purple-300 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-purple-100"
        >
          <FaPlus className="text-xs text-purple-700" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-4 py-2 mb-6 rounded-full border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition duration-200 shadow-sm"
      />

      <div className="space-y-3 overflow-y-auto max-h-[78vh] pr-1 custom-scrollbar">
        {chats?.map((chat) => {
          const isSelected = selectedChat?._id === chat._id;
          const displayName = chat.isGroupChat
            ? chat.chatName
            : getSender(loggedUser, chat.users);
          const profilePic = chat.isGroupChat
            ? `https://api.dicebear.com/6.x/bottts/svg?seed=${displayName}`
            : chat.users.find((u) => u._id !== loggedUser._id)?.pic;

          return (
            <div
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group shadow-sm ${
                isSelected
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white scale-[1.01]"
                  : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 text-gray-800"
              }`}
            >
              <div className="relative">
                <img
                  src={profilePic}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg group-hover:ring-2 group-hover:ring-purple-400 transition"
                />
              </div>
              <div className="min-w-0">
                <p
                  className={`font-semibold truncate text-sm ${
                    isSelected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {displayName}
                </p>
                <p
                  className={`text-xs truncate ${
                    isSelected ? "text-purple-100" : "text-gray-500"
                  }`}
                >
                  {chat.latestMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </div>
  );
};

export default UserList;
