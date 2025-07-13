import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center px-4 py-3 mb-2 w-full bg-[#E8E8E8] rounded-lg cursor-pointer hover:bg-[#38B2AC] hover:text-white transition-colors duration-200"
    >
      <img
        src={user.pic}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover mr-3"
      />
      <div>
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs">
          <b>Email: </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
