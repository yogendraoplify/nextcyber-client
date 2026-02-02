// "use client";
// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "@/utils/axios";
// import {
//   socket,
//   subscribeToOnlineUsers,
//   getOnlineUsersCache,
// } from "@/utils/socket";
// import { ArrowLeft, Search, X } from "lucide-react";
// import Image from "next/image";

// export default function ChatPage() {
//   const { user: loggedInUser } = useSelector((s) => s.auth);

//   const [cursor, setCursor] = useState(null);
//   const [hasMore, setHasMore] = useState(true);
//   const isFetchingRef = useRef(false);
//   const [convoSearch, setConvoSearch] = useState("");

//   const [conversations, setConversations] = useState([]);
//   const [allConversations, setAllConversations] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const [conversationId, setConversationId] = useState(null);
//   const conversationIdRef = useRef(null);
//   const conversationsRef = useRef([]);

//   useEffect(() => {
//     conversationsRef.current = conversations;
//   }, [conversations]);

//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   const [typingUser, setTypingUser] = useState(null);
//   const typingTimeoutRef = useRef(null);

//   const messagesEndRef = useRef(null);

//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const scrollContainerRef = useRef(null);

//   const isAtBottomRef = useRef(true);
//   const observerRef = useRef(null);
//   const emittedUnreadRef = useRef(new Set());
//   const debounceRef = useRef(null);

//   const buffer = new Set();

//   const emitUnreadDebounced = (ids) => {
//     ids.forEach((id) => buffer.add(id));

//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     debounceRef.current = setTimeout(() => {
//       if (buffer.size > 0) {
//         socket.emit("messages_visible", {
//           conversationId: conversationIdRef.current,
//           messageIds: Array.from(buffer),
//         });
//         buffer.clear();
//       }
//     }, 150);
//   };

//   const setUrlConversation = (cid) => {
//     const url = cid ? `/messages?cid=${cid}` : `/messages`;
//     window.history.replaceState({}, "", url);
//   };

//   useEffect(() => {
//     if (!loggedInUser) return;

//     if (!socket.connected) {
//       socket.connect();
//     }

//     return () => {
//       socket.disconnect();
//     };
//   }, [loggedInUser]);

//   useEffect(() => {
//     if (!loggedInUser) return;

//     const cached = getOnlineUsersCache();
//     if (cached.length > 0) {
//       setOnlineUsers(cached);
//     }

//     const unsubscribe = subscribeToOnlineUsers((userIds) => {
//       setOnlineUsers(userIds);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [loggedInUser]);

//   useEffect(() => {
//     if (!loggedInUser) return;

//     const onReceive = async (msg) => {
//       const isActive = msg.conversationId === conversationIdRef.current;
//       const isMine = msg.senderId === loggedInUser.id;

//       const existingConvo = conversationsRef.current.find(
//         (c) => c.id === msg.conversationId
//       );

//       if (existingConvo) {
//         setConversations((prev) => {
//           const updated = prev.map((c) =>
//             c.id === msg.conversationId
//               ? {
//                   ...c,
//                   lastMessage: msg.text,
//                   lastMessageAt: msg.createdAt,
//                   senderId: msg.senderId,
//                 }
//               : c
//           );

//           return updated.sort((a, b) => {
//             const aTime = a.lastMessageAt
//               ? new Date(a.lastMessageAt).getTime()
//               : 0;
//             const bTime = b.lastMessageAt
//               ? new Date(b.lastMessageAt).getTime()
//               : 0;
//             return bTime - aTime;
//           });
//         });

//         setAllConversations((prev) => {
//           const updated = prev.map((c) =>
//             c.id === msg.conversationId
//               ? {
//                   ...c,
//                   lastMessage: msg.text,
//                   lastMessageAt: msg.createdAt,
//                   senderId: msg.senderId,
//                 }
//               : c
//           );

//           return updated.sort((a, b) => {
//             const aTime = a.lastMessageAt
//               ? new Date(a.lastMessageAt).getTime()
//               : 0;
//             const bTime = b.lastMessageAt
//               ? new Date(b.lastMessageAt).getTime()
//               : 0;
//             return bTime - aTime;
//           });
//         });
//       } else {
//         try {
//           const { data } = await axios.get(
//             `/conversation/${msg.conversationId}`
//           );
//           const convo = data.conversation;

//           if (convo) {
//             setConversations((prev) => {
//               if (prev.some((c) => c.id === convo.id)) {
//                 const updated = prev.map((c) =>
//                   c.id === msg.conversationId
//                     ? {
//                         ...c,
//                         lastMessage: msg.text,
//                         lastMessageAt: msg.createdAt,
//                         unreadCount: isActive || isMine ? 0 : 1,
//                       }
//                     : c
//                 );

//                 return updated.sort((a, b) => {
//                   const aTime = a.lastMessageAt
//                     ? new Date(a.lastMessageAt).getTime()
//                     : 0;
//                   const bTime = b.lastMessageAt
//                     ? new Date(b.lastMessageAt).getTime()
//                     : 0;
//                   return bTime - aTime;
//                 });
//               }

//               const newConvo = {
//                 id: convo.id,
//                 user: convo.user,
//                 lastMessage: msg.text,
//                 lastMessageAt: msg.createdAt,
//                 unreadCount: isActive || isMine ? 0 : 1,
//               };

//               const updated = [newConvo, ...prev];

//               return updated.sort((a, b) => {
//                 const aTime = a.lastMessageAt
//                   ? new Date(a.lastMessageAt).getTime()
//                   : 0;
//                 const bTime = b.lastMessageAt
//                   ? new Date(b.lastMessageAt).getTime()
//                   : 0;
//                 return bTime - aTime;
//               });
//             });

//             setAllConversations((prev) => {
//               if (prev.some((c) => c.id === convo.id)) {
//                 return prev;
//               }

//               const newConvo = {
//                 id: convo.id,
//                 user: convo.user,
//                 lastMessage: msg.text,
//                 lastMessageAt: msg.createdAt,
//                 unreadCount: isActive || isMine ? 0 : 1,
//               };

//               const updated = [newConvo, ...prev];

//               return updated.sort((a, b) => {
//                 const aTime = a.lastMessageAt
//                   ? new Date(a.lastMessageAt).getTime()
//                   : 0;
//                 const bTime = b.lastMessageAt
//                   ? new Date(b.lastMessageAt).getTime()
//                   : 0;
//                 return bTime - aTime;
//               });
//             });
//           }
//         } catch (e) {
//           console.error("Failed loading conversation:", e);
//           return;
//         }
//       }

//       if (isActive) {
//         setMessages((prev) => {
//           if (prev.some((m) => m.messageId === msg.messageId)) return prev;
//           return [...prev, msg];
//         });

//         if (isAtBottomRef.current) {
//           setTimeout(
//             () =>
//               messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
//             50
//           );
//         }
//       }
//     };

//     const onTyping = ({ conversationId, userId }) => {
//       if (
//         conversationId === conversationIdRef.current &&
//         userId !== loggedInUser.id
//       ) {
//         setTypingUser(userId);
//         clearTimeout(typingTimeoutRef.current);
//         typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 1500);
//       }
//     };

//     const onStopTyping = ({ conversationId, userId }) => {
//       if (
//         conversationId === conversationIdRef.current &&
//         userId !== loggedInUser.id
//       ) {
//         setTypingUser(null);
//       }
//     };

//     const onLastSeen = ({ userId, lastSeen }) => {
//       setOnlineUsers((prev) => prev.filter((id) => id !== userId));

//       setSelectedUser((prev) =>
//         prev && prev.id === userId ? { ...prev, lastSeen } : prev
//       );

//       setConversations((prev) =>
//         prev.map((c) =>
//           c.user?.id === userId ? { ...c, user: { ...c.user, lastSeen } } : c
//         )
//       );

//       setAllConversations((prev) =>
//         prev.map((c) =>
//           c.user?.id === userId ? { ...c, user: { ...c.user, lastSeen } } : c
//         )
//       );
//     };

//     const onOnline = (id) => {
//       setOnlineUsers((prev) => {
//         if (prev.includes(id)) return prev;
//         return [...prev, id];
//       });
//     };

//     const onOffline = (id) => {
//       setOnlineUsers((prev) => prev.filter((x) => x !== id));
//     };

//     const onRead = ({ conversationId: cid, readAt, messages }) => {
//       if (cid !== conversationIdRef.current) return;

//       setMessages((prev) =>
//         prev.map((m) =>
//           messages.includes(m.messageId) ? { ...m, status: "READ", readAt } : m
//         )
//       );
//     };

//     socket.on("messages_read", onRead);
//     socket.on("user_online", onOnline);
//     socket.on("user_offline", onOffline);
//     socket.on("receive_message", onReceive);
//     socket.on("user_typing", onTyping);
//     socket.on("user_stop_typing", onStopTyping);
//     socket.on("user_last_seen_updated", onLastSeen);

//     return () => {
//       socket.off("messages_read", onRead);
//       socket.off("receive_message", onReceive);
//       socket.off("user_online", onOnline);
//       socket.off("user_offline", onOffline);
//       socket.off("user_typing", onTyping);
//       socket.off("user_stop_typing", onStopTyping);
//       socket.off("user_last_seen_updated", onLastSeen);
//     };
//   }, [loggedInUser]);

//   useEffect(() => {
//     if (!loggedInUser) return;

//     const run = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const cid = params.get("cid");
//       const uid = params.get("user");

//       const loadByCID = async (cid) => {
//         try {
//           const { data } = await axios.get(`/conversation/${cid}`);
//           const convo = data.conversation;
//           if (!convo) return;
//           setSelectedUser(convo.user);
//           setConversations((prev) => {
//             if (prev.some((c) => c.id === convo.id)) return prev;
//             return [
//               ...prev,
//               {
//                 id: convo.id,
//                 user: convo.user,
//                 lastMessage: convo.messages?.[0]?.text ?? "",
//                 lastMessageAt: convo.messages?.[0]?.createdAt ?? null,
//                 unreadCount: 0,
//               },
//             ];
//           });

//           setAllConversations((prev) => {
//             if (prev.some((c) => c.id === convo.id)) return prev;
//             return [
//               ...prev,
//               {
//                 id: convo.id,
//                 user: convo.user,
//                 lastMessage: convo.messages?.[0]?.text ?? "",
//                 lastMessageAt: convo.messages?.[0]?.createdAt ?? null,
//                 unreadCount: 0,
//               },
//             ];
//           });

//           setConversationId(cid);
//           conversationIdRef.current = cid;
//           socket.emit("join_conversation", { conversationId: cid });
//           loadMessages(cid);
//         } catch (err) {
//           console.error("Invalid CID clearing", err);
//           window.history.replaceState({}, "", `/messages`);
//         }
//       };

//       const loadByUID = async (uid) => {
//         const { data } = await axios.get(
//           `/conversation/bootstrap?userId=${uid}`
//         );
//         const { user, conversation, exists } = data;
//         setSelectedUser(user);

//         if (exists) {
//           const convoId = conversation.id;
//           setConversationId(convoId);
//           conversationIdRef.current = convoId;
//           setUrlConversation(convoId);
//           socket.emit("join_conversation", { conversationId: convoId });
//           loadMessages(convoId);

//           setConversations((prev) => {
//             if (prev.some((c) => c.id === convoId)) return prev;
//             return [
//               ...prev,
//               {
//                 id: convoId,
//                 user,
//                 lastMessage: conversation.messages?.[0]?.text ?? "",
//                 lastMessageAt: conversation.messages?.[0]?.createdAt ?? null,
//                 unreadCount: 0,
//               },
//             ];
//           });

//           setAllConversations((prev) => {
//             if (prev.some((c) => c.id === convoId)) return prev;
//             return [
//               ...prev,
//               {
//                 id: convoId,
//                 user,
//                 lastMessage: conversation.messages?.[0]?.text ?? "",
//                 lastMessageAt: conversation.messages?.[0]?.createdAt ?? null,
//                 unreadCount: 0,
//               },
//             ];
//           });
//         } else {
//           setConversationId(null);
//           conversationIdRef.current = null;
//           setMessages([]);
//         }
//       };

//       if (cid) {
//         await loadByCID(cid);
//         return;
//       }

//       if (uid) {
//         await loadByUID(uid);
//         return;
//       }
//     };

//     run();
//   }, [loggedInUser]);

//   useEffect(() => {
//     if (!loggedInUser) return;

//     loadConversations();
//   }, [loggedInUser]);

//   useEffect(() => {
//     if (convoSearch.trim()) {
//       const filtered = allConversations.filter((c) => {
//         const userName = c.user?.firstName?.toLowerCase() || "";
//         const searchTerm = convoSearch.toLowerCase();
//         return userName.includes(searchTerm);
//       });
//       setConversations(filtered);
//     } else {
//       setConversations(allConversations);
//     }
//   }, [convoSearch, allConversations]);

//   const loadConversations = async () => {
//     if (isFetchingRef.current) return;
//     isFetchingRef.current = true;

//     const { data } = await axios.get("/conversation/list");

//     const { conversations: convos } = data;

//     setConversations(convos);
//     setAllConversations(convos);

//     isFetchingRef.current = false;
//   };

//   const loadMessages = async (cid, loadMore = false) => {
//     if (isFetchingRef.current) return;
//     isFetchingRef.current = true;

//     const container = scrollContainerRef.current;
//     const oldScrollHeight = container?.scrollHeight || 0;
//     const oldScrollTop = container?.scrollTop || 0;

//     const res = await axios.get(`/conversation/${cid}/messages`, {
//       params: loadMore && cursor ? { cursor } : {},
//     });

//     const { messages: newMessages, nextCursor, hasMore: more } = res.data;

//     setHasMore(more);
//     setCursor(nextCursor);

//     setMessages((prev) => (loadMore ? [...newMessages, ...prev] : newMessages));

//     isFetchingRef.current = false;

//     if (loadMore && container) {
//       setTimeout(() => {
//         const newScrollHeight = container.scrollHeight;
//         container.scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop;
//       }, 50);
//     } else {
//       setTimeout(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//       }, 50);
//     }
//   };

//   const createObserver = () => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     if (observerRef.current) {
//       observerRef.current.disconnect();
//     }

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const newlyVisible = [];

//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const id = entry.target.dataset.id;
//             const msg = messages.find((m) => m.messageId === id);
//             if (
//               msg &&
//               msg.senderId !== loggedInUser?.id &&
//               msg.status !== "READ" &&
//               !emittedUnreadRef.current.has(id)
//             ) {
//               emittedUnreadRef.current.add(id);
//               newlyVisible.push(id);
//             }
//           }
//         });

//         if (newlyVisible.length > 0) {
//           emitUnreadDebounced(newlyVisible);
//         }
//       },
//       {
//         root: container,
//         threshold: 0.01,
//       }
//     );

//     observerRef.current = observer;
//   };

//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     createObserver();

//     messages.forEach((m) => {
//       const el = document.getElementById(`msg-${m.messageId}`);
//       if (el) observerRef.current.observe(el);
//     });
//   }, [messages]);

//   const handleSelectConversation = (c) => {
//     if (conversationIdRef.current) {
//       socket.emit("leave_conversation", {
//         conversationId: conversationIdRef.current,
//       });
//     }
//     setUrlConversation(c.id);

//     setConversations((prev) =>
//       prev.map((x) => (x.id === c.id ? { ...x, unreadCount: 0 } : x))
//     );

//     setAllConversations((prev) =>
//       prev.map((x) => (x.id === c.id ? { ...x, unreadCount: 0 } : x))
//     );

//     setSelectedUser(c.user);
//     setConversationId(c.id);
//     conversationIdRef.current = c.id;

//     socket.emit("join_conversation", { conversationId: c.id });

//     setCursor(null);
//     setHasMore(true);
//     emittedUnreadRef.current.clear();
//     loadMessages(c.id);
//   };

//   const creatingRef = useRef(false);

//   const sendMessage = async () => {
//     if (!text.trim()) return;

//     const messageId = crypto.randomUUID();
//     let convoId = conversationIdRef.current;

//     if (!convoId) {
//       if (creatingRef.current) return;
//       creatingRef.current = true;

//       const { data } = await axios.post("/conversation/start", {
//         targetUserId: selectedUser.id,
//       });

//       creatingRef.current = false;

//       convoId = data.conversation.id;
//       conversationIdRef.current = convoId;
//       setConversationId(convoId);
//       setUrlConversation(convoId);

//       socket.emit("check_online", { userId: selectedUser.id });

//       setConversations((prev) => {
//         if (prev.some((c) => c.id === convoId)) return prev;
//         return [...prev, { id: convoId, user: selectedUser, unreadCount: 0 }];
//       });

//       setAllConversations((prev) => {
//         if (prev.some((c) => c.id === convoId)) return prev;
//         return [...prev, { id: convoId, user: selectedUser, unreadCount: 0 }];
//       });

//       socket.emit("join_conversation", { conversationId: convoId });
//     }

//     setMessages((prev) => [
//       ...prev,
//       {
//         messageId,
//         conversationId: convoId,
//         senderId: loggedInUser.id,
//         text,
//         status: "SENT",
//         createdAt: Date.now(),
//       },
//     ]);

//     socket.emit("send_message", {
//       messageId,
//       conversationId: convoId,
//       receiverId: selectedUser.id,
//       text,
//     });

//     socket.emit("typing_stop", { conversationId: convoId });

//     setText("");
//   };

//   const handleTyping = (e) => {
//     setText(e.target.value);

//     if (!conversationIdRef.current) return;

//     socket.emit("typing_start", {
//       conversationId: conversationIdRef.current,
//     });

//     clearTimeout(typingTimeoutRef.current);
//     typingTimeoutRef.current = setTimeout(() => {
//       socket.emit("typing_stop", {
//         conversationId: conversationIdRef.current,
//       });
//     }, 800);
//   };

//   function formatLastSeen(date) {
//     if (!date) return "Offline";
//     const diff = Math.floor((Date.now() - new Date(date)) / 1000);
//     if (diff < 60) return "just now";
//     if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//     if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
//     return new Date(date).toLocaleString();
//   }

//   const getProfileUrl = (user) => {
//     if (user.role === "COMPANY")
//       return user.companyProfile?.profilePicture?.url;
//     if (user.role === "STUDENT")
//       return user.studentProfile?.profilePicture?.url;
//     return null;
//   };

//   return (
//     <div className="flex h-[calc(100vh-100.67px)] gap-5">
//       <div className="w-[288px] bg-g-700 border border-g-600 rounded-lg flex flex-col">
//         <div className="px-5 pt-5 text-[#9C9C9D] text-base font-semibold">
//           Chats
//         </div>
//         <div className="px-4 py-4">
//           <div className="flex items-center gap-2 px-5 py-4 bg-[#111214] border border-[#2F3031] rounded-lg">
//             <Search className=" text-g-200" size={20} />

//             <input
//               placeholder="Search users..."
//               value={convoSearch}
//               onChange={(e) => setConvoSearch(e.target.value)}
//               className="bg-transparent outline-none text-sm text-[#CDCECE] placeholder-[#6A6B6C] w-full"
//             />

//             {convoSearch && (
//               <button onClick={() => setConvoSearch("")}>
//                 <X
//                   size={20}
//                   className=" text-g-200 cursor-pointer hover:text-g-100 shrink-0"
//                 />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="border-t border-[#1B1C1E] overflow-y-auto">
//           {conversations.length == 0 ? (
//             <div className="py-2 text-center text-g-200 border-b border-g-600">
//               No conversations found.
//             </div>
//           ) : (
//             conversations.map((c) => {
//               const user = c.user;
//               const userId = user.id;
//               const isOnline = onlineUsers.includes(userId);

//               return (
//                 <div
//                   key={user.id}
//                   className={`flex items-center gap-3 px-3 py-3 border-b border-[#1B1C1E] cursor-pointer hover:bg-[#1B1C1E]
//                 ${selectedUser?.id === userId ? "bg-[#1B1C1E]" : ""}`}
//                   onClick={() => handleSelectConversation(c)}
//                 >
//                   <div className="relative">
//                     {getProfileUrl(user) ? (
//                       <Image
//                         src={getProfileUrl(user)}
//                         height={48}
//                         width={48}
//                         alt={`user-${user.firstName}-profile`}
//                         className=" h-12 w-12 rounded-full"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-[#CDCECE]">
//                         {user.firstName?.charAt(0).toUpperCase()}
//                       </div>
//                     )}

//                     <span
//                       className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#111214]
//                     ${isOnline ? "bg-[#16A600]" : "bg-[#DB0000]"}`}
//                     />
//                   </div>

//                   <div className="flex-1 overflow-hidden">
//                     <p className="text-sm font-medium text-[#CDCECE] truncate">
//                       {user.firstName}
//                     </p>

//                     <p className="text-xs text-[#9C9C9D] truncate">
//                       {c.senderId == loggedInUser.id && "You: "}
//                       {c.lastMessage}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col bg-g-800 border border-[#1B1C1E] rounded-lg">
//         {!selectedUser ? (
//           <div className="flex items-center justify-center flex-1">
//             <Image
//               src="/select-conversation.png"
//               height={350}
//               width={350}
//               alt="select"
//               loading="eager"
//             />
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center gap-3 p-5 border-b bg-g-700 border-[#1B1C1E]">
//               <ArrowLeft
//                 size={25}
//                 className="cursor-pointer"
//                 onClick={() => {
//                   if (conversationIdRef.current) {
//                     socket.emit("leave_conversation", {
//                       conversationId: conversationIdRef.current,
//                     });
//                   }
//                   setSelectedUser(null);
//                   setUrlConversation(null);
//                 }}
//               />

//               {getProfileUrl(selectedUser) ? (
//                 <Image
//                   src={getProfileUrl(selectedUser)}
//                   height={48}
//                   width={48}
//                   alt={`user-${selectedUser.firstName}-profile`}
//                   className=" h-12 w-12 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-[#CDCECE]">
//                   {selectedUser.firstName?.charAt(0).toUpperCase()}
//                 </div>
//               )}

//               <div className="flex flex-col">
//                 <p className="text-sm font-medium text-[#CDCECE]">
//                   {selectedUser.firstName}
//                 </p>

//                 {!typingUser && (
//                   <p className="text-xs text-[#9C9C9D]">
//                     {onlineUsers.includes(selectedUser.id)
//                       ? "Online"
//                       : selectedUser.lastSeen
//                       ? `Last seen ${formatLastSeen(selectedUser.lastSeen)}`
//                       : "Offline"}
//                   </p>
//                 )}

//                 {typingUser && (
//                   <p className="text-xs text-[#9C9C9D] italic">typing...</p>
//                 )}
//               </div>
//             </div>

//             <div
//               className="flex-1 p-6 space-y-6 overflow-y-auto"
//               ref={scrollContainerRef}
//               onScroll={(e) => {
//                 const el = e.currentTarget;
//                 const atBottom =
//                   el.scrollHeight - el.scrollTop - el.clientHeight < 50;
//                 isAtBottomRef.current = atBottom;

//                 if (
//                   el.scrollTop === 0 &&
//                   hasMore &&
//                   conversationIdRef.current
//                 ) {
//                   loadMessages(conversationIdRef.current, true);
//                 }
//               }}
//             >
//               {messages.map((m) => {
//                 const isSelf = m.senderId === loggedInUser.id;

//                 return (
//                   <div
//                     key={m.messageId}
//                     id={`msg-${m.messageId}`}
//                     data-id={m.messageId}
//                     className={`flex gap-3 ${
//                       isSelf ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     {!isSelf &&
//                       (getProfileUrl(selectedUser) ? (
//                         <Image
//                           src={getProfileUrl(selectedUser)}
//                           height={48}
//                           width={48}
//                           alt={`user-${selectedUser.firstName}-profile`}
//                           className="w-8 h-8 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-[#CDCECE]">
//                           {selectedUser.firstName?.charAt(0).toUpperCase()}
//                         </div>
//                       ))}
//                     <div>
//                       <div
//                         className={`px-3 py-2 rounded-lg max-w-[450px] text-sm ${
//                           isSelf
//                             ? "bg-primary text-[#CDCECE]"
//                             : "bg-g-700 text-[#9C9C9D]"
//                         }`}
//                       >
//                         {m.text}

//                         {isSelf && (
//                           <span
//                             className={`ml-2 text-[10px] ${
//                               m.status === "READ" && "text-dark-green"
//                             }`}
//                           >
//                             {m.status === "SENT" && "✓"}
//                             {m.status === "READ" && "✓✓"}
//                           </span>
//                         )}
//                       </div>

//                       <p
//                         className={`text-xs text-[#6A6B6C] mt-1 ${
//                           isSelf ? "text-right" : ""
//                         }`}
//                       >
//                         {m.time ? m.time : ""}
//                       </p>
//                     </div>
//                     {isSelf &&
//                       (getProfileUrl(loggedInUser) ? (
//                         <Image
//                           src={getProfileUrl(loggedInUser)}
//                           height={48}
//                           width={48}
//                           alt={`user-${loggedInUser.firstName}-profile`}
//                           className="w-8 h-8 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-[#CDCECE]">
//                           {loggedInUser.firstName?.charAt(0).toUpperCase()}
//                         </div>
//                       ))}
//                   </div>
//                 );
//               })}

//               <div ref={messagesEndRef} />
//             </div>

//             <div className="p-4 border-t border-[#1B1C1E]">
//               <div className="flex items-center gap-3 px-5 py-3 bg-[#1B1C1E] rounded-lg">
//                 <input
//                   value={text}
//                   onChange={handleTyping}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   placeholder="Type your message"
//                   className="bg-transparent outline-none text-sm text-[#CDCECE] placeholder-[#6A6B6C] flex-1"
//                 />
//                 <button onClick={sendMessage} className="cursor-pointer">
//                   <SendIcon />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// const SendIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <path
//       d="M12.5705 0.0724892C13.4197 -0.254121 14.2541 0.580255 13.9275 1.42945L9.35155 13.3269C8.98573 14.2781 7.61546 14.2028 7.35611 13.2171L6.06459 8.30949C6.01643 8.1265 5.87356 7.98356 5.69051 7.9354L0.782861 6.64388C-0.202793 6.38453 -0.278128 5.01429 0.673149 4.64842L12.5705 0.0724892ZM12.9475 1.05252L1.05008 5.62845L5.95777 6.91997C6.50679 7.06445 6.93561 7.4932 7.08009 8.04229L8.37154 12.9499L12.9475 1.05252Z"
//       fill="#9C9C9D"
//     />
//   </svg>
// );

import InDev from "@/components/InDev";

const ChatPage = () => {
  return <InDev />;
};

export default ChatPage;
