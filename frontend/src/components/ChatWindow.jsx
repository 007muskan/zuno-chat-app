import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatWindow = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className="
      flex flex-col items-start 
      p-3 bg-white w-[1120px] 
      rounded-lg border border-gray-200 mt-3 ml-5
    "
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatWindow;
