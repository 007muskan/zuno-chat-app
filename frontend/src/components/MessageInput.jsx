import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { BsPaperclip, BsMic, BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="relative">
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} height={350} width={300} />
        </div>
      )}

      <div className="flex items-center px-4 py-2 bg-transparent">
        {/* Input field wrapper */}
        <div className="flex items-center w-full bg-[#e6e6e6] px-3 py-2 rounded-md shadow-sm">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <BsEmojiSmile className="text-gray-500 mr-2" size={18} />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message here.."
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-500 text-black"
          />

          <BsPaperclip
            className="text-gray-500 mx-2 cursor-pointer"
            size={16}
          />
          <BsMic className="text-gray-500 cursor-pointer" size={16} />
        </div>

        {/* Send button */}
        <button className="ml-2 p-3 rounded-full bg-gradient-to-br from-[#6a3f91] to-[#a14caa] shadow-md hover:opacity-90 transition">
          <IoIosSend size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
