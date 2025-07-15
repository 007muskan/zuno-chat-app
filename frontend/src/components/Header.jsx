import React, { useState, useEffect, useRef } from "react";
import { MdNotifications } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { ChatState } from "../Context/ChatProvider";
import { toast } from "sonner";
import axios from "axios";
import UserListItem from "./UserListItem";
import MyProfileModal from "./MyProfileModal";
import { getSender } from "../config/ChatLogics";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
console.log("BASE_URL in Header.jsx:", BASE_URL);

const Header = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  const handleSearch = async () => {
    if (!search) return toast.error("Please enter a search query");
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `${BASE_URL}/api/user?search=${search}`,
        config
      );

      if (Array.isArray(data)) {
        setSearchResult(data);
      } else if (
        data &&
        typeof data === "object" &&
        Array.isArray(data.users)
      ) {
        setSearchResult(data.users);
      } else {
        setSearchResult([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch users");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setShowSearchModal(false);
      setLoadingChat(false);
    } catch (error) {
      toast.error("Failed to access chat");
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowNotificationsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="relative flex justify-between items-center px-6 py-2 bg-[#3C205D] text-white h-16 shadow-md z-10">
        <div className="h-36 flex items-center font-bold tracking-wider ml-[-18px]">
          <img
            src="/zuno-logo.png"
            alt="ZUNO"
            className="h-full max-h-full w-32 object-contain"
          />
        </div>

        <div className="flex-1 px-10">
          <div
            onClick={() => setShowSearchModal(true)}
            className="flex items-center bg-white text-black rounded-full px-4 py-1 max-w-sm mx-auto w-full shadow-sm cursor-pointer"
          >
            <IoMdSearch className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-sm text-gray-500">Search User...</span>
          </div>
        </div>

        <div
          ref={dropdownRef}
          className="flex items-center gap-4 bg-[#f3f3f3] px-4 py-1 rounded-full text-black relative"
        >
          <div className="relative">
            <div
              className="relative p-2 bg-[#d6cce7] rounded-full cursor-pointer"
              onClick={() => setShowNotificationsDropdown((prev) => !prev)}
            >
              <MdNotifications size={18} className="text-black" />
              {notification.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {notification.length}
                </span>
              )}
            </div>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md z-50 overflow-hidden">
                <div className="p-2 text-sm text-gray-700 font-medium border-b">
                  Notifications
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {!notification.length && (
                    <p className="text-center text-sm text-gray-400 py-4">
                      No New Messages
                    </p>
                  )}
                  {notification.map((notif) => (
                    <button
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notif)
                        );
                        setShowNotificationsDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            notif.chat.users
                          )}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            onClick={toggleDropdown}
            className={`p-2 bg-[#d6cce7] rounded-full cursor-pointer transition-transform duration-300 ${
              isRotating ? "rotate-180" : ""
            }`}
          >
            <FaCog className="text-black" size={18} />
          </div>

          <div className="flex items-center gap-2">
            <img
              src={user?.pic || "https://i.pravatar.cc/30"}
              alt="profile"
              className="rounded-full w-8 h-8 object-cover border-2 border-white shadow-sm"
            />
            <span className="text-sm font-medium">{user?.name || "Guest"}</span>
          </div>

          {showDropdown && (
            <div className="absolute top-14 right-0 bg-white text-black shadow-lg rounded-md w-44 z-50 overflow-hidden animate-fade-in">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowProfileModal(true);
                }}
                className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 🔍 Search Modal */}
      {showSearchModal && (
        <div
          onClick={() => setShowSearchModal(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[95%] sm:w-[28rem] p-6 rounded-xl shadow-lg animate-fade-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">🔍 Search Users</h2>
              <button
                className="text-gray-500 hover:text-gray-800 text-lg"
                onClick={() => setShowSearchModal(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center gap-2 mb-4"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Enter name or email..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Search
              </button>
            </form>

            {loading ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Loading...
              </p>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && (
              <p className="text-center text-sm text-purple-600 font-medium">
                Opening chat...
              </p>
            )}
          </div>
        </div>
      )}

      {/* ✅ Profile Modal */}
      {showProfileModal && (
        <MyProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
        />
      )}
    </>
  );
};

export default Header;
