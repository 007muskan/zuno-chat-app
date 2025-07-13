// components/CreateGroupModal.jsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { toast } from "sonner";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return setSearchResult([]);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5001/api/user?search=${query}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to search users");
      setLoading(false);
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) return;
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

  const handleSubmit = async () => {
    if (!groupName || selectedUsers.length < 2) {
      return toast.error("Group name & at least 2 users required");
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5001/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      toast.success("Group created successfully!");
      onClose();
      setGroupName("");
      setSelectedUsers([]);
      setSearch("");
      setSearchResult([]);
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Create Group Chat
            </Dialog.Title>
            <button onClick={onClose}>
              <IoMdClose className="text-xl" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="text"
            placeholder="Add users..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="flex flex-wrap gap-2 mb-2">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                className="bg-purple-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2"
              >
                {u.name}
                <button onClick={() => handleRemoveUser(u)}>✕</button>
              </span>
            ))}
          </div>

          <div className="overflow-y-auto max-h-40 mb-4 space-y-2">
            {loading ? (
              <p className="text-sm text-gray-400">Searching...</p>
            ) : (
              searchResult.map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleAddUser(u)}
                  className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer text-sm"
                >
                  {u.name}{" "}
                  <span className="text-xs text-gray-400">({u.email})</span>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 transition-all"
          >
            Create Group
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateGroupModal;
