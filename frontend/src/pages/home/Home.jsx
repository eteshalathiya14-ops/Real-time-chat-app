import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Chat from '../../components/chat/Chat'

function Home() {
  const { user, logout } = useAuth()

  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const optimisticIdsRef = useRef(new Set())

  // FETCH USERS
  const fetchUsers = async (searchTerm = '') => {
    try {
      const url = searchTerm 
        ? `http://localhost:3000/api/users?search=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:3000/api/users';
      const res = await fetch(url, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
        setFilteredUsers(data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // FETCH MESSAGES (skip if optimistic send in progress)
  const fetchMessages = async (userId) => {
    if (sendingMessage) return;
    
    try {
      const res = await fetch(
        `http://localhost:3000/api/messages/getmessage/${userId}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (data.success) {
        // Remove optimistic messages
        const realMessages = data.data.filter(msg => !optimisticIdsRef.current.has(msg._id));
        setMessages(realMessages);
        optimisticIdsRef.current.clear();
      }
    } catch (err) {
      console.log(err);
    }
  }

  // SEND MESSAGE
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || !selectedUser || sendingMessage) return;

    const optimisticId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    optimisticIdsRef.current.add(optimisticId);

    const optimisticMessage = {
      _id: optimisticId,
      senderId: user._id,
      receiverId: selectedUser._id,
      message: messageText.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/send/${selectedUser._id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageText.trim() }),
        }
      );

      if (response.ok) {
        // Fetch will replace with real messages
        setTimeout(() => fetchMessages(selectedUser._id), 100);
      } else {
        throw new Error('Send failed');
      }
    } catch (err) {
      console.error('Send message error:', err);
      // Remove optimistic
      setMessages(prev => prev.filter(m => m._id !== optimisticId));
      optimisticIdsRef.current.delete(optimisticId);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser._id);

    const interval = setInterval(() => {
      fetchMessages(selectedUser._id);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(searchTerm)
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm])

  const handleSelectUser = (u) => {
    setSelectedUser(u)
    setMessages([])
    fetchMessages(u._id)
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Compact floating circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl animate-float" style={{zIndex:0}}></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/50 rounded-full blur-3xl animate-float2" style={{zIndex:0}}></div>
      
      <div className="relative z-10 w-full h-screen flex overflow-hidden">
        {/* Compact Sidebar */}
        <div className="w-[300px] min-h-screen bg-white/80 backdrop-blur-md p-4 border-r border-gray-200/50 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center gap-2 py-2 px-1">
            <img src={user.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent((user.fullname || user.username).replace(/\\s+/g, '+'))}`} alt={user.username} className="w-8 h-8 rounded-full border-2 border-gray-100 shadow-sm" />
            <span className="font-semibold text-gray-800 text-sm">{user.username}</span>
            <button 
              onClick={logout}
              className="ml-auto px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-all shadow-sm"
            >
              Logout
            </button>
          </div>
          <div className="py-1">
            <input 
              className="w-full px-3 py-2 rounded-xl bg-white/70 border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-200/50 transition-all text-sm text-gray-950 shadow-sm placeholder-gray-400" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {filteredUsers.map((u) => (
              <div 
                key={u._id}
                onClick={() => handleSelectUser(u)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-blue-50/70 hover:shadow-md hover:scale-[1.02] ${selectedUser?._id === u._id ? 'bg-gradient-to-r from-blue-100/80 to-purple-100/80 ring-1 ring-blue-200/50 shadow-md' : 'bg-white/60 hover:bg-blue-50/50'}`}
              >
                <img src={u.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullname.replace(/\\s+/g, '+'))}`} alt={u.fullname} className="w-9 h-9 rounded-full border border-white/50 shadow-sm" />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-gray-900 text-sm block truncate">{u.fullname}</span>
                  <span className="text-xs text-gray-500">@ {u.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Chat 
            messages={messages}
            selectedUser={selectedUser}
            user={user}
            newMessage={newMessage}
            onMessageChange={(e) => setNewMessage(e.target.value)}
            onSendMessage={sendMessage}
            sendingMessage={sendingMessage}
          />
        </div>
      </div>
      
      <style>{`
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float2 { animation: float2 7s ease-in-out infinite reverse; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(20px); } }
      `}</style>
    </div>
  )
}

export default Home

