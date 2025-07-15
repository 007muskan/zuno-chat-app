import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1">
        {/* <Sidebar /> */}
        <UserList fetchAgain={fetchAgain} />
        <div className="flex flex-col flex-1">
          <ChatWindow fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          {/* <MessageInput /> */}
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
