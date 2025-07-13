import ScrollableFeed from "react-scrollable-feed";
import { isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwn = m.sender._id === user._id;

          return (
            <div
              key={m._id}
              className={`mb-2 flex items-end ${
                isOwn ? "justify-end" : "justify-start"
              }`}
              style={{
                marginTop: isSameUser(messages, m, i) ? 4 : 12,
              }}
            >
              {/* Message + Timestamp Wrapper */}
              <div
                className={`relative group flex items-end gap-2 ${
                  isOwn ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Message bubble */}
                <div
                  className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow-md ${
                    isOwn
                      ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>

                {/* Timestamp styled badge */}
                <div className="text-[10px] text-gray-400 bg-white/70 px-2 py-[2px] rounded-full shadow-sm backdrop-blur-sm border border-gray-200">
                  {formatTime(m.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
