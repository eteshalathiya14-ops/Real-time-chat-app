import React, { useRef, useState, useEffect } from 'react';

const ChatInput = ({ newMessage, onMessageChange, onSendMessage, disabled, sendingMessage }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && !disabled && !sendingMessage) {
      onSendMessage(newMessage);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !sendingMessage) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [newMessage]);

  const buttonContent = sendingMessage ? (
    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <svg className="w-5 h-5 md:w-6 md:h-6 rotate-45" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-2 md:p-3 bg-white/95 backdrop-blur-xl border-t border-white/50 shadow-2xl">
      <div className={`flex-1 relative rounded-2xl shadow-lg border transition-all duration-300 overflow-hidden min-h-[40px] md:min-h-[44px] max-h-[100px] group ${isFocused ? 'border-blue-400 bg-white/80 shadow-xl ring-2 ring-blue-200/50' : 'border-gray-200/50 hover:border-gray-300/50 bg-white/70 hover:shadow-lg'}`}>
        <textarea
          ref={textareaRef}
          className="w-full p-3 md:p-4 resize-none outline-none bg-transparent text-gray-900 placeholder-gray-500 font-medium text-sm md:text-base leading-relaxed max-h-[80px] pr-10"
          placeholder="Type a message..."
          value={newMessage}
          onChange={onMessageChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          disabled={disabled || sendingMessage}
          rows={1}
          autoComplete="off"
        />
      </div>
      <button 
        type="submit"
        disabled={!newMessage.trim() || disabled || sendingMessage}
        className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-400 hover:via-teal-400 hover:to-blue-400 active:scale-[0.97] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
        aria-label="Send message"
      >
        {buttonContent}
        <div className="absolute inset-0 bg-white/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </form>
  );
};

export default ChatInput;

