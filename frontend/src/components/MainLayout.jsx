import React, { useState } from "react";
import Sidebar from "./Sidebar";
import UserList from "./UserList";

const MainLayout = () => {
  const [active, setActive] = useState(0); // 0: single chats, 1: group chats

  return (
    <div className="flex h-screen">
      <Sidebar active={active} setActive={setActive} />
      <UserList view={active} />
    </div>
  );
};

export default MainLayout;
