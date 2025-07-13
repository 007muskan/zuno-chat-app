import React from "react";

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-transparent flex items-center justify-center px-4">
      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-fast">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
        >
          &times;
        </button>

        {/* Profile Info */}
        <div className="flex flex-col items-center text-center p-8">
          <div className="relative">
            <img
              src={user?.pic || "https://i.pravatar.cc/150"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
            />
            <div className="absolute bottom-0 right-0 bg-purple-600 w-5 h-5 rounded-full border-2 border-white"></div>
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {user?.name}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>

          <div className="mt-6 w-full border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400">Chat Companion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
