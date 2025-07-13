// components/MyProfileModal.jsx
import React, { useEffect } from "react";

const MyProfileModal = ({ isOpen, onClose, user, onLogout }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-96 p-6 rounded-2xl shadow-lg animate-fade-slide-in"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.pic || "https://i.pravatar.cc/100"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-purple-400"
          />
          <div>
            <h3 className="text-lg font-medium">{user?.name || "Guest"}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button className="w-full py-2 rounded-md bg-purple-100 text-purple-800 font-medium hover:bg-purple-200">
            Edit Profile
          </button>
          <button className="w-full py-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200">
            Change Password
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 rounded-md bg-red-100 text-red-600 font-medium hover:bg-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfileModal;
