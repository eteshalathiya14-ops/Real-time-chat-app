import React from "react";

const Message = ({ message, user, selectedUser }) => {

  const senderId =
    message?.senderId?._id ||
    message?.senderId?.id ||
    message?.senderId;

  const currentUserId =
    user?._id ||
    user?.id;

  const isMe = String(senderId) === String(currentUserId);

  const avatarSrc = isMe
    ? user?.profile_picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.fullname || user?.username
      )}`
    : selectedUser?.profile_picture ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        selectedUser?.fullname || selectedUser?.username
      )}`;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex w-full py-2 px-2 ${isMe ? "justify-end" : "justify-start"} gap-2`}>

      {!isMe && (
        <img
          src={avatarSrc}
          alt=""
          className="w-8 h-8 rounded-full"
        />
      )}

      <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>

        <div className="relative inline-block min-w-[60px] px-3 py-2 rounded-2xl text-gray-900 bg-white shadow">

          <p className="pr-12">{message.message}</p>

          <span className="absolute bottom-1 right-2 text-xs">
            {time}
          </span>

        </div>

      </div>

      {isMe && (
        <img
          src={avatarSrc}
          alt=""
          className="w-8 h-8 rounded-full"
        />
      )}

    </div>
  );
};

export default Message;