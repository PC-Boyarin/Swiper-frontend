//@ts-nocheck
import { Hash, Bell, Pin, Users, Search, Inbox, HelpCircle, Smile, Gift, Sticker, Plus } from 'lucide-react';
import {useEffect, useState} from 'react';
import {getAllMessages} from "../api/messages.ts";
import useCheckAuth from "../hooks/useCheckAuth";
import {useSocketEvent} from "../hooks/useSocketEvents";
import {useSocket} from "../context";
import {useSocketEmit} from "../hooks/useSocketEmit";
import {useCurrentChannel} from "../api/channels.ts";

interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
  user_id: string | number;
  content: string;
}

interface ChatAreaProps {
  channelId: number | null
}

export function ChatArea({ channelId }: ChatAreaProps) {
  const [message, setMessage] = useState('');
//@ts-ignore
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);

  async function getAllMessagesHandler() {
    try {
      const response = await getAllMessages(String(channelId))
      setMessages(response?.data);
    } catch (err) {
      console.log(err);
    }
  }

  const {data: currentChannel, isLoading} = useCurrentChannel(channelId)

  const { userId } = useCheckAuth()
  const { isConnected } = useSocket();
  const { emit } = useSocketEmit();

  useEffect(() => {

    if( channelId ) {
      // setMessages([])
      getAllMessagesHandler()
    }
  }, [ channelId ]);

// Подписка на новые сообщения
  useSocketEvent('message:new', (message) => {
    console.log('messageNEW', message, channelId);

    if (Number(message.channel_id) === channelId) {
      // @ts-ignore
      setMessages((prev) => [...prev, message]);
    }
  });

  useSocketEvent('typing:start', (userId) => {
    setTypingUsers((prev) => new Set(prev).add(userId));
  });

  useSocketEvent('typing:stop', (userId) => {
    setTypingUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  });

  useEffect(() => {
    if (isConnected && channelId) {
      emit('room:join', String(channelId));

      return () => {
        emit('room:leave', String(channelId));
      };
    }
  }, [isConnected, channelId, emit]);

  const sendMessage = () => {
    if (!message.trim() || !isConnected) return;
    emit('message:send', {
      content: message,
      user_id: userId,
      channel_id: channelId,
    });
    setMessage('');
  };
//@ts-ignore
  const handleTyping = () => {
    if (!isConnected) return;
    emit('typing:start', String(channelId));

    // Автоматически останавливаем через 3 секунды
    setTimeout(() => {
      emit('typing:stop', String(channelId));
    }, 3000);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {

    if(event.key === 'Enter') {
      sendMessage()
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] shadow-sm">
        <div className="flex items-center gap-2">
          <Hash className="w-6 h-6 text-[#96989d]" />
          <span className="text-white">общий</span>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
          <Pin className="w-5 h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
          <Users className="w-5 h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск"
              className="w-36 px-2 py-1 bg-[#202225] rounded text-sm text-white placeholder-[#72767d] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#72767d] absolute right-2 top-1.5" />
          </div>
          <Inbox className="w-5 h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
          <HelpCircle className="w-5 h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Welcome Message */}
        <div className="mb-4">
          <div className="w-16 h-16 rounded-full bg-[#5865f2] flex items-center justify-center mb-2">
            <Hash className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white mb-2">{`Добро пожаловать в #${isLoading? '' : currentChannel?.name}!`}</h2>
          <p className="text-[#96989d] text-sm">{`Это начало канала #${isLoading? '' : currentChannel?.name}`}</p>
        </div>

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={
            userId === msg.user_id ? `flex flex-row-reverse items-center gap-4 px-4 py-2 hover:bg-[#32353b] group relative` :
                `flex gap-4 px-4 py-2 hover:bg-[#32353b] group`}>
            {/*<div className="absolute top-2/6">*/}
            {/*  <span>{msg.username}</span>*/}
            {/*</div>*/}
            <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center flex-shrink-0">
              <span>{msg.id}</span>
            </div>
            <div className={userId === msg.user_id ? `flex items-center justify-end flex-1` : `flex-1`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-white hover:underline cursor-pointer">{msg.userId}</span>
                <span className="text-xs text-[#96989d]">{msg.timestamp}</span>
              </div>
                <p className="text-[#dcddde]">{msg?.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-4 pb-6">
        <div className="bg-[#40444b] rounded-lg px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="hover:opacity-80">
              <Plus className="w-6 h-6 text-[#b9bbbe]" />
            </button>
            <input
              type="text"
              placeholder="Написать в #общий"
              value={message}
              onKeyPress={handleKeyPress}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-[#72767d] focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button className="hover:opacity-80">
                <Gift className="w-6 h-6 text-[#b9bbbe]" />
              </button>
              <button className="hover:opacity-80">
                <Sticker className="w-6 h-6 text-[#b9bbbe]" />
              </button>
              <button className="hover:opacity-80">
                <Smile className="w-6 h-6 text-[#b9bbbe]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}