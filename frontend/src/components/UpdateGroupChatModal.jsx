import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "sonner";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { EyeIcon } from "@heroicons/react/24/solid"; // Tailwind-compatible icon

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("Group name updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error renaming chat");
    } finally {
      setRenameLoading(false);
      setGroupChatName("");
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast.success("User added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      toast.success("User removed!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:bg-gray-200 rounded-full"
      >
        <EyeIcon className="h-5 w-5" />
      </button>

      <Transition show={isOpen} as={React.Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
              <Dialog.Title className="text-xl font-bold text-center mb-4">
                {selectedChat.chatName}
              </Dialog.Title>

              <div className="flex flex-wrap gap-2 mb-3">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <input
                  className="flex-1 border border-gray-300 p-2 rounded"
                  placeholder="Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <button
                  className="bg-teal-500 text-white px-4 py-2 rounded"
                  onClick={handleRename}
                  disabled={renameloading}
                >
                  {renameloading ? "Updating..." : "Update"}
                </button>
              </div>

              <input
                className="w-full border border-gray-300 p-2 rounded mb-2"
                placeholder="Add user to group"
                onChange={(e) => handleSearch(e.target.value)}
              />

              {loading ? (
                <div className="text-center text-sm">Loading...</div>
              ) : (
                searchResult?.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
              )}

              <div className="mt-4 flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleRemove(user)}
                >
                  Leave Group
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UpdateGroupChatModal;
