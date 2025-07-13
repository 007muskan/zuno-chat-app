// components/Sidebar.jsx
import React, { useState } from "react";
import { FaUserFriends, FaVideo, FaCog, FaSignOutAlt } from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";

const icons = [
  { id: 0, icon: <BsChatDotsFill />, label: "Chat" },
  { id: 1, icon: <FaUserFriends />, label: "Friends" },
  { id: 2, icon: <FaVideo />, label: "Video" },
  { id: 3, icon: <FaCog />, label: "Settings" },
];

const Sidebar = () => {
  const [active, setActive] = useState(0);

  return (
    <aside className="w-20 py-8 flex flex-col justify-between items-center bg-gradient-to-b from-[#3C205D] to-[#892685]">
      {/* Icon List */}
      <div className="flex flex-col items-center space-y-5">
        {icons.map(({ id, icon }) => (
          <div
            key={id}
            onClick={() => setActive(id)}
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
          >
            {/* Highlighted Background */}
            {active === id && (
              <div className="absolute w-20 h-9 bg-white rounded-r-full left-0 transition-all duration-300 z-0 rotate-180" />
            )}

            {/* Icon (in front) */}
            <div
              className={`z-10 text-xl ${
                active === id ? "text-purple-800" : "text-white"
              }`}
            >
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Icon */}
      <div className="pb-2 text-white cursor-pointer">
        <FaSignOutAlt size={20} />
      </div>
    </aside>
  );
};

export default Sidebar;
