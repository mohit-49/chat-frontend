"use client";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState, useRef, useMemo } from "react";
import api from "@/lib/api";
import { FiSend } from "react-icons/fi";
import { connectSocket, getSocket } from "@/lib/socket";
import { getToken } from "@/lib/auth";
import "./ChatWindow.css";
import Sidebar from "../Sidebar/Sidebar"
import toast, { Toaster } from 'react-hot-toast';


type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  about: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  avatarUrl?: string;
  roomId?: string;
  avatar: string;
  deletedContacts?: string[];
  isDeleted?: boolean;
};

type Room = {
  _id: string;
  members: User[];
  type: string;
  name?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
};

type Message = {
  _id: string;
  content: string;
  sender_id: User | string;
  room_id: string;
  createdAt: string;
  media?: any[];
  readBy?: string[];
};

const ChatWindow = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const token = getToken();
  const currentUser: User = JSON.parse(localStorage.getItem("user") || "{}");
  const chatRef = useRef<HTMLDivElement>(null);

  const otherUser = selectedRoom?.members.find((m) => m._id !== currentUser._id) || null;
  // console.log("otherUser", otherUser)


  //  Chat-header menu part ... view contact
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    }

    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreMenu]);

  // --- Emoji picker ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  // --- Typing ---
  const handleTyping = () => {
    if (selectedRoom?._id) {
      getSocket()?.emit("typing", { room_id: selectedRoom._id });
    }
  };

  // pin part ∏
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const attachmentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        attachmentRef.current &&
        !attachmentRef.current.contains(event.target as Node)
      ) {
        setShowAttachmentMenu(false);
      }
    }
    if (showAttachmentMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAttachmentMenu]);

  // --- Add new state (Documents = images + video) ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedRoom?._id) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const uploaded = res.data;
      // send via socket
      const tempId = Date.now().toString();
      const tempMessage: Message & { media?: any[] } = {
        _id: tempId,
        content: "",
        sender_id: currentUser,
        room_id: selectedRoom._id,
        createdAt: new Date().toISOString(),
        media: uploaded,
      };
      setMessages((prev) => [...prev, tempMessage]);
      getSocket()?.emit("create", {
        room_id: selectedRoom._id,
        tempId,
        media: uploaded,
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- Add new state (documents) ---
  const fileInputDocsRef = useRef<HTMLInputElement>(null);
  function formatFileSize(bytes?: number) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  const handleDocumentSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedRoom?._id) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const res = await api.post("/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const uploaded = res.data;
      const tempId = Date.now().toString();
      const tempMessage: Message & { media?: any[] } = {
        _id: tempId,
        content: "",
        sender_id: currentUser,
        room_id: selectedRoom._id,
        createdAt: new Date().toISOString(),
        media: uploaded,
      };
      setMessages((prev) => [...prev, tempMessage]);
      getSocket()?.emit("create", {
        room_id: selectedRoom._id,
        tempId,
        media: uploaded,
      });
    } catch (err) {
      console.error("Document upload failed:", err);
    } finally {
      if (fileInputDocsRef.current) fileInputDocsRef.current.value = "";
    }
  };

  // Documents downloads functions
  function getStoredFilenameFromUrl(url: string) {
    return url.split('/').pop() || '';
  }
  function getDownloadHref(m: any) {
    const stored = getStoredFilenameFromUrl(m.url);
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/download/${stored}?name=${encodeURIComponent(m.filename || '')}`;
  }
  async function downloadFile(url: string, filename: string) {
    const token = localStorage.getItem('token'); // JWT

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      // console.log(await res.text());
      alert('Failed to download file: ' + res.statusText);
      return;
    }
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // audio calling concept
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'incoming' | 'in-call'>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [incomingOffer, setIncomingOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState("00:00");
  // Update duration timer
  useEffect(() => {
    let timer: number; // <-- use number instead of NodeJS.Timer
    if (callStatus === "in-call" && callStartTime) {
      timer = window.setInterval(() => {
        const diff = Math.floor((Date.now() - callStartTime.getTime()) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, "0");
        const seconds = (diff % 60).toString().padStart(2, "0");
        setDuration(`${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus, callStartTime]);
  // Start timer when call goes live
  useEffect(() => {
    if (callStatus === "in-call") setCallStartTime(new Date());
    else {
      setCallStartTime(null);
      setDuration("00:00");
    }
  }, [callStatus]);
  useEffect(() => {
    if (remoteStream && audioRef.current) {
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  const handleAudioCallClick = async () => {
    if (!otherUser) return;

    setCallStatus('calling');
    const stream = await startLocalStream(); // get the microphone stream
    if (!stream) return;

    // Pass the stream directly
    const pc = createPeerConnection(stream, otherUser._id);
    if (!pc) return setCallStatus('idle');

    setPeerConnection(pc);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    getSocket()?.emit('call:offer', { toUserId: otherUser._id, offer });
  };
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      toast.success("Please allow microphone access!");
      console.error("Failed to get microphone:", err);
      return null;
    }
  };
  const createPeerConnection = (stream: MediaStream, remoteUserId: string) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    pc.ontrack = (event) => setRemoteStream(event.streams[0]);
    pc.onicecandidate = (event) => {
      if (event.candidate && otherUser) {
        getSocket()?.emit("call:ice", { toUserId: otherUser._id, candidate: event.candidate });
      }
    };
    setLocalStream(stream);
    return pc;
  };
  const acceptCall = async () => {
    if (!incomingOffer || !otherUser) return;

    const stream = await startLocalStream();
    if (!stream) return;

    const pc = createPeerConnection(stream, otherUser._id);
    if (!pc) return;

    setPeerConnection(pc);

    await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    getSocket()?.emit('call:answer', {
      toUserId: otherUser._id,
      answer,
    });

    setCallStatus('in-call');
  };
  const rejectCall = () => {
    if (!otherUser) {
      console.warn("No other user to hang up");
      cleanupCall();
      return;
    }
    getSocket()?.emit('call:hangup', { toUserId: otherUser._id });
    cleanupCall();
  };
  const endCall = () => {
    if (!otherUser) {
      console.warn("No other user to hang up");
      cleanupCall();
      return;
    }
    getSocket()?.emit('call:hangup', { toUserId: otherUser._id });
    cleanupCall();
  };
  const cleanupCall = () => {
    setCallStatus('idle');
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setPeerConnection(null);
  };
  // --- Socket setup ---
  const [roomMessages, setRoomMessages] = useState<Record<string, Message[]>>({});
  useEffect(() => {
    if (!token) return;
    const socket = connectSocket();

    socket.on("new-chat", (chat: Message & { tempId?: string }) => {
      const roomId = chat.room_id;
      if (chat.sender_id === currentUser._id) return; // ignore own messages

      setRoomMessages(prev => {
        const prevMsgs = prev[roomId] || [];
        const exists = prevMsgs.some(m => m._id === chat._id || (chat.tempId && m._id === chat.tempId));
        if (exists) return prev;

        const newMsgs = [...prevMsgs, chat];

        // If room is open, mark as read instantly
        if (selectedRoom?._id === roomId) {
          setMessages(newMsgs);
          setUsers(prev =>
            prev.map(u =>
              u.roomId === roomId ? { ...u, unreadCount: 0, lastMessage: chat.content, lastMessageTime: chat.createdAt } : u
            )
          );
          getSocket()?.emit("read_messages", roomId); // notify backend
        } else {
          // Increment unread badge
          setUsers(prev =>
            prev.map(u =>
              u.roomId === roomId
                ? { ...u, unreadCount: (u.unreadCount || 0) + 1, lastMessage: chat.content, lastMessageTime: chat.createdAt }
                : u
            )
          );
        }

        return { ...prev, [roomId]: newMsgs };
      });
    });

    socket.on("update-unread", (counts: { _id: string; count: number }[]) => {
      setUsers(prev =>
        prev.map(u => {
          const c = counts.find(x => x._id === u.roomId);
          return c ? { ...u, unreadCount: c.count } : u;
        })
      );
    });

    socket.on("typing", ({ room_id, user }) => {
      if (room_id === selectedRoom?._id && user._id !== currentUser._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    // --- Call events ---
    socket.on("call:incoming", ({ fromUser }) => {
      setCallStatus("incoming"); // show modal
      setIncomingOffer(null);     // reset previous offer
    });
    socket.on("call:offer", ({ fromUser, offer }) => {
      setIncomingOffer(offer);   // store offer
      setCallStatus("incoming"); // show modal
    });
    socket.on("call:answer", async ({ answer }) => {
      if (!peerConnection) return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      setCallStatus("in-call");
    });
    socket.on("call:ice", async ({ candidate }) => {
      if (!peerConnection) return;
      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (err) {
        console.error("Failed to add ICE candidate:", err);
      }
    });
    socket.on("call:hangup", () => {
      cleanupCall();
    });;

    return () => {
      socket.off("new-chat");
      socket.off("update-unread");
      socket.off("typing");
      socket.off("call:incoming");
      socket.off("call:offer");
      socket.off("call:answer");
      socket.off("call:ice");
      socket.off("call:hangup");
    };
  }, [token, selectedRoom?._id, peerConnection, localStream]);

  // --- Fetch users & rooms with badges ---
  useEffect(() => {
    const fetchUsersAndRooms = async () => {
      try {
        const usersRes = await api.get("/users");
        const allUsers: User[] = Array.isArray(usersRes.data) ? usersRes.data : [];

        const roomsRes = await api.get("/rooms");
        const fetchedRooms: Room[] = Array.isArray(roomsRes.data) ? roomsRes.data : [];

        // Fetch messages for each room to compute unread counts
        const roomMessagesMap: { [roomId: string]: Message[] } = {};
        for (const room of fetchedRooms) {
          const chatRes = await api.get(`/rooms/${room._id}/chats`);
          roomMessagesMap[room._id] = chatRes.data.map((m: Message) => ({
            ...m,
            createdAt: new Date(m.createdAt).toISOString(),
          }));
        }
        setRoomMessages(roomMessagesMap);

        // Helper
        const normalizeMemberIds = (r: Room) =>
          (r.members || []).map((m: any) => (typeof m === "string" ? m : m._id));

        // Build personal rooms map
        const roomByOtherId = new Map<string, any>();
        for (const room of fetchedRooms) {
          if (room.type === "PERSONAL") {
            const memberIds = normalizeMemberIds(room);
            const otherId = memberIds.find(id => id !== currentUser._id);
            if (!otherId) continue;

            const msgs = roomMessagesMap[room._id] || [];
            const unreadCount = msgs.filter(m => !m.readBy?.includes(currentUser._id)).length;

            roomByOtherId.set(otherId, {
              roomId: room._id,
              lastMessage: msgs[msgs.length - 1]?.content || "",
              lastMessageTime: msgs[msgs.length - 1]?.createdAt || "",
              unreadCount,
            });
          }
        }

        // Merge users with room info
        const mergedUsers = allUsers
          .filter(u => u._id !== currentUser._id)
          .map(u => {
            const roomInfo = roomByOtherId.get(u._id);
            return {
              ...u,
              roomId: roomInfo?.roomId,
              lastMessage: roomInfo?.lastMessage || "",
              lastMessageTime: roomInfo?.lastMessageTime || "",
              unreadCount: roomInfo?.unreadCount ?? 0,
            } as User;
          });

        setUsers(mergedUsers);
        setRooms(fetchedRooms);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load users");
        setUsers([]);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) fetchUsersAndRooms();
  }, [currentUser?._id]);
  useEffect(() => {
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (!u.roomId) return u;
        const msgs = roomMessages[u.roomId] || [];
        const unread = msgs.filter(m => !m.readBy?.includes(currentUser._id)).length;
        return { ...u, unreadCount: unread };
      })
    );
  }, [roomMessages, currentUser._id]);

  // --- Select user / join room ---
  const handleSelectUser = async (user: User) => {
    try {
      const res = await api.post("/rooms", { members: [currentUser._id, user._id], type: "PERSONAL" });
      const room: Room = res.data;

      // add room to rooms state (if not already)
      setRooms(prev => (prev.some(r => r._id === room._id) ? prev : [...prev, room]));

      await handleOpenRoom(room);

      // Clear unread badge and set roomId on corresponding user
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, unreadCount: 0, roomId: room._id } : u
        )
      );
      setShowUsersDropdown(false);
      setSearchTerm("");
    } catch (err: any) {
      console.error(err);
    }
  };
  const handleOpenRoom = async (room: Room) => {
    setSelectedRoom(room);
    getSocket()?.emit("join_room", room._id);
    getSocket()?.emit("read_messages", room._id); // backend updates readBy

    setUsers(prev =>
      prev.map(u => (u.roomId === room._id ? { ...u, unreadCount: 0 } : u))
    );

    // Load messages
    const cached = roomMessages[room._id] || [];
    if (cached.length > 0) {
      setMessages(cached);
    } else {
      const chatRes = await api.get(`/rooms/${room._id}/chats`);
      const msgs = chatRes.data.map((m: Message) => ({ ...m, createdAt: new Date(m.createdAt).toISOString() }));
      setMessages(msgs);
      setRoomMessages(prev => ({ ...prev, [room._id]: msgs }));
    }
  };

  const handleSend = () => {
    stopRecordingIfActive();
    if (!newMessage.trim() || !selectedRoom?._id) return;

    const tempId = Date.now().toString();
    const msg: Message = {
      _id: tempId,
      content: newMessage,
      sender_id: currentUser._id,
      room_id: selectedRoom._id,
      createdAt: new Date().toISOString(),
    };

    // Add to roomMessages & messages
    setRoomMessages(prev => {
      const prevMsgs = prev[selectedRoom._id] || [];
      return { ...prev, [selectedRoom._id]: [...prevMsgs, msg] };
    });
    setMessages(prev => [...prev, msg]);

    // Emit to backend
    getSocket()?.emit("create", {
      room_id: selectedRoom._id,
      content: newMessage,
      tempId,
    });

    setNewMessage("");
    committedTextRef.current = "";
  };

  // --- Auto-scroll ---
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Time helpers ---
  const TZ = "Asia/Kolkata";
  function getYMD(date: Date, TZ: string = "UTC") {
    const parts = new Intl.DateTimeFormat("en-IN", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const y = parts.find((p) => p.type === "year")!.value;
    const m = parts.find((p) => p.type === "month")!.value;
    const d = parts.find((p) => p.type === "day")!.value;

    return `${y}-${m}-${d}`;
  }
  function formatSidebarTime(iso?: string) {
    if (!iso) return "";
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "";

    // Always use TZ here
    const todayYMD = getYMD(new Date(), TZ);
    const yesterdayYMD = getYMD(new Date(Date.now() - 24 * 60 * 60 * 1000), TZ);
    const msgYMD = getYMD(date, TZ);

    if (msgYMD === todayYMD) {
      return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: TZ,
      }).format(date);
    }

    if (msgYMD === yesterdayYMD) return "Yesterday";

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      timeZone: TZ,
    }).format(date);
  }

  // Sidebar-filter for search contact...
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(u =>
      (u.name || "").toLowerCase().includes(lower) // adjust here if your name field is different
    );
  }, [users, searchTerm]);

  // Auto-open dropdown while typing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!showUsersDropdown) setShowUsersDropdown(true);
  };

  // Chat-messages filter for chat message serach 
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  function highlightText(text: string, query: string) {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  }

  // Close dropdown when clicking outside (chat header user view)
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUsersDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [showUserOptions, setShowUserOptions] = useState(false);
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // -------------------input mic when user type text with mic ----------------------------
  const recognitionRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const committedTextRef = useRef<string>("");
  const sessionFinalRef = useRef<string>("");
  // --- Start Recording ---
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    sessionFinalRef.current = "";

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsRecording(true);

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed") alert("Microphone permission denied.");
      setIsRecording(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          sessionFinalRef.current += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update input: committed + session + interim
      setNewMessage(committedTextRef.current + sessionFinalRef.current + interimTranscript);
    };

    recognition.onend = () => {
      // Commit the session final to committed text
      committedTextRef.current += sessionFinalRef.current;
      sessionFinalRef.current = "";
      setIsRecording(false);
      recognitionRef.current = null;

      // Ensure input shows committed text
      setNewMessage(committedTextRef.current);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("SpeechRecognition start error:", err);
    }
  };
  // --- Stop Recording ---
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };
  // --- Toggle Mic ---
  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };
  // --- Stop if active ---
  const stopRecordingIfActive = () => {
    if (isRecording) stopRecording();
  };
  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { }
        recognitionRef.current = null;
      }
    };
  }, []);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // store selected user IDs

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  type ChatItem = {
    _id: string; // For groups, this is the room id; for users without room, a temp id
    roomId: string | null; // null for personal users without room yet
    isGroup: boolean;
    otherUser?: User | null;
    name?: string; // for group name
    members?: string[]; // room members
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
  };

  // console.log("check users", users)
  // helper to normalize member ids
  const normalizeMemberIds = (r: any) =>
    (r.members || []).map((m: any) => (typeof m === "string" ? m : m._id));

  const mergedChats: ChatItem[] = [
    // rooms first (group + personal)
    ...rooms.map(room => {
      const memberIds = normalizeMemberIds(room);
      // const otherId = memberIds.find(id => id !== currentUser._id);
      const otherId: string | undefined = memberIds.find((id: string) => id !== currentUser._id);

      const otherUser = otherId ? users.find(u => u._id === otherId) : null;
      return {
        _id: room._id,
        roomId: room._id,
        isGroup: room.type === "GROUP",
        otherUser: room.type !== "GROUP" ? otherUser : null,
        name: room.name,
        members: memberIds,
        lastMessage: room.lastMessage,
        lastMessageTime: room.lastMessageTime,
        unreadCount: room.unreadCount || 0,
      } as ChatItem;
    }),

    // users without any room yet
    ...users
      .filter(u => !rooms.some(r => normalizeMemberIds(r).includes(u._id)))
      .map(u => ({
        _id: u._id,
        roomId: null,
        isGroup: false,
        otherUser: u,
        members: [u._id],
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: u.unreadCount || 0,
      }))
  ];

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="user-menu-wrapper" ref={menuRef}>
            <Sidebar
              currentUser={currentUser}
              onCreateGroup={() => setShowNewGroupModal(true)}
            />
          </div>

          <div className="sidebar-search-container" ref={dropdownRef}>
            <div className="sidebar-search">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search Contacts..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <i
                className={showUsersDropdown ? "ri-arrow-down-s-line" : "ri-arrow-up-s-line"}
                onClick={() => setShowUsersDropdown(!showUsersDropdown)}
                style={{ cursor: "pointer" }}
              ></i>
            </div>

            {showUsersDropdown && (
              <div className="users-dropdown">
                {filteredUsers.filter(user => !user.isDeleted).length > 0 ? (
                  filteredUsers
                    .filter(user => !user.isDeleted)
                    .map((user) => (
                      <div
                        key={user._id}
                        className="dropdown-user-item"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="avatar">
                          {user.avatar ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`}
                              alt={user.name}
                            />
                          ) : (
                            <span>{user.name?.charAt(0) || "?"}</span>
                          )}
                        </div>
                        <p className="username">{user.name}</p>
                      </div>
                    ))
                ) : (
                  <p className="no-users">No users found</p>
                )}
              </div>
            )}


            {/* show new groups modal new group */}
            {showNewGroupModal && (
              <div className="new-group-modal-backdrop">
                <div className="new-group-modal">
                  {/* Header */}
                  <div className="new-group-modal-header">
                    {/* <button onClick={() => setShowNewGroupModal(false)}>⬅</button> */}
                    <button
                      onClick={() => setShowNewGroupModal(false)}
                      className="back-btnn"
                      title="Back"
                    >
                      <i className="ri-arrow-left-line"></i>
                    </button>
                    <h3 className="addGroup">Add Group Members</h3>
                    <p>{selectedGroupUsers.length} Selected</p>
                  </div>

                  {/* Search */}
                  <div className="new-group-search">
                    <i className="ri-search-line"></i>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={groupSearchTerm}
                      onChange={(e) => setGroupSearchTerm(e.target.value)}
                    />
                  </div>


                  {/* Users List */}
                  <div className="new-group-users-list">
                    {users
                      .filter(u => u._id !== currentUser._id && u.name.toLowerCase().includes(groupSearchTerm.toLowerCase()))
                      .map(user => (

                        <label key={user._id} className="user-checkbox-item">
                          <div className="avatar">
                            {user.avatar ? <img src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`} alt={user.name} /> : <span>{user.name[0]}</span>}
                          </div>
                          <p className="">{user.name}</p>
                          <input
                            type="checkbox"
                            checked={selectedGroupUsers.includes(user._id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedGroupUsers(prev => [...prev, user._id]);
                              else setSelectedGroupUsers(prev => prev.filter(id => id !== user._id));
                            }}
                          />

                        </label>
                      ))}
                  </div>

                  {/* Create Group Button */}
                  <div className="new-group-modal-actions">
                    <button
                      className="group-cancel"
                      onClick={() => {
                        setSelectedGroupUsers([]); // reset all selected users
                        setShowNewGroupModal(false); // close modal
                        setGroupSearchTerm(""); // reset search
                        toast.success("Group creation cancelled");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={async () => {
                        if (selectedGroupUsers.length === 0) return toast.error("Select at least 1 user");

                        // Ask group name via toast input
                        const groupName = await new Promise<string | null>((resolve) => {
                          const ToastInput = () => {
                            const [name, setName] = useState("");

                            return (
                              <div className="group-name-box">
                                <p className="group-name-title">Enter group name:</p>
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Group name"
                                  className="group-name-input"
                                />
                                <div className="group-name-actions">
                                  <button
                                    className="group-ok"
                                    onClick={() => {
                                      toast.dismiss();
                                      resolve(name.trim() || null);
                                    }}
                                  >
                                    OK
                                  </button>
                                  <button
                                    className="group-cancel"
                                    onClick={() => {
                                      toast.dismiss();
                                      resolve(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>


                            );
                          };

                          toast.custom((t) => <ToastInput />, { duration: Infinity });
                        });

                        if (!groupName) {
                          setSelectedGroupUsers([]); // reset selections if cancelled
                          return toast.error("Group creation cancelled");
                        }

                        try {
                          const membersToSend = [currentUser._id, ...selectedGroupUsers];

                          const res = await api.post("/rooms", {
                            members: membersToSend,
                            type: "GROUP",
                            name: groupName,
                          });

                          setRooms((prev) => [...prev, res.data]);
                          setShowNewGroupModal(false);
                          setSelectedGroupUsers([]);
                          setGroupSearchTerm("");

                          await handleOpenRoom(res.data);
                          toast.success(`Group "${groupName}" created successfully!`);
                        } catch (err) {
                          console.error(err);
                          toast.error("Failed to create group");
                        }
                      }}
                    >
                      Create Group
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-users">
          {loading && <p>Loading users...</p>}
          {error && <p>{error}</p>}
          <ul>
            {mergedChats.length > 0 ? (
              mergedChats.map(chat => (
                <li
                  key={chat._id}
                  onClick={() => {
                    if (chat.isGroup) {
                      const roomObj = rooms.find(r => r._id === chat.roomId);
                      if (roomObj) handleOpenRoom(roomObj);
                    } else {
                      handleSelectUser(chat.otherUser!);
                    }
                  }}
                >
                  <div className="avatar">
                    {chat.isGroup ? (
                      <span>👨‍👨‍👧‍👦</span>
                    ) : chat.otherUser?.avatar ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}${chat.otherUser.avatar}`} alt={chat.otherUser.name} />
                    ) : (
                      <span>{chat.otherUser?.name?.charAt(0)}</span>
                    )}
                  </div>

                  <div className="user-details">
                    <p className="username">
                      {chat.isGroup ? chat.name : chat.otherUser?.name}
                    </p>
                    {chat.lastMessage && (
                      <p className="last-message">
                        <span className="last-message-text">
                          {chat.lastMessage.length > 30 ? chat.lastMessage.slice(0, 30) + "…" : chat.lastMessage}
                        </span>
                        <span className="last-message-time">
                          {formatSidebarTime(chat.lastMessageTime)}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    {chat.unreadCount ? <span className="badge">{chat.unreadCount}</span> : null}
                  </div>
                </li>
              ))
            ) : (
              <p className="para">No chats found!</p>
            )}
          </ul>
        </div>
      </div>

      {/* Chat panel */}
      <div className="chat-panel">
        {selectedRoom && otherUser ? (
          <>
            <div className="chat-header">
              <div className="avatar">
                {selectedRoom.type === "GROUP" ? (
                  // Group avatar: can be first member or a default group icon
                  selectedRoom.members && selectedRoom.members.length > 0 ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${selectedRoom.members[0].avatar}`}
                      alt={selectedRoom.name || "Group"}
                    />
                  ) : (
                    <span>G</span> // fallback group icon
                  )
                ) : otherUser?.avatar ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${otherUser.avatar}`} alt={otherUser.name} />
                ) : (
                  <span>{otherUser?.name?.charAt(0)}</span>
                )}
              </div>
              <div className="chat-header-info">
                <p
                  className="chat-header-name"
                  onClick={() => setShowUserOptions((prev) => !prev)}
                  style={{ cursor: "pointer" }} // optional: show pointer on hover
                >
                  {selectedRoom.type === "GROUP"
                    ? selectedRoom.name || "Unnamed Group"
                    : otherUser?.name}
                </p>
                <p>
                  {selectedRoom.type === "GROUP"
                    ? `${selectedRoom.members?.length || 0} members`
                    : otherUser?.about}
                </p>
              </div>

              {showUserOptions && selectedRoom && (
                <div className="user-options-dropdown" ref={dropdownRef}>
                  {/* User / Group Info */}
                  {selectedRoom.type === "GROUP" ? (
                    <div className="group-info">
                      <p className="group-name">{selectedRoom.name || "Unnamed Group"}</p>
                      <ul className="group-members-list">
                        {selectedRoom.members?.map((member) => (
                          <li key={member._id} className="user-info">
                            <div className="avatar">
                              {member.avatar ? (
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${member.avatar}`}
                                  alt={member.name}
                                />
                              ) : (
                                <span>{member.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="user-text">
                              <p className="username">{member.username}</p>
                              <p className="email">{member.email}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : otherUser ? (
                    <div className="user-info">
                      <div className="avatar">
                        {otherUser.avatar ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${otherUser.avatar}`}
                            alt={otherUser.name}
                          />
                        ) : (
                          <span>{otherUser.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="user-text">
                        <p className="username">{otherUser.username}</p>
                        <p className="email">{otherUser.email}</p>
                      </div>
                    </div>
                  ) : null}

                  <hr />

                  {/* Action Buttons */}
                  <div className="user-actions">
                    <button className="action-btn" onClick={handleAudioCallClick}>
                      <i className="ri-phone-line text-textSecondary" />
                      <span>Audio</span>
                    </button>
                    <button className="action-btn">
                      <i className="ri-video-line"></i>
                      <span>Video</span>
                    </button>
                    <button className="action-btn">
                      <i className="ri-money-dollar-circle-line"></i>
                      <span>Pay</span>
                    </button>
                    <button className="action-btn">
                      <i className="ri-search-line"></i>
                      <span>Search</span>
                    </button>
                  </div>

                  <hr />

                  {/* Settings */}
                  <div className="user-settings">
                    <div className="setting-item">
                      <i className="ri-notification-line"></i>
                      <span>Notification</span>
                    </div>
                    <div className="setting-item">
                      <i className="ri-image-line"></i>
                      <span>Media visibility</span>
                    </div>
                    <div className="setting-item">
                      <i className="ri-shield-line"></i>
                      <span>Encryption</span>
                      <p className="subtext">
                        Messages & calls are end-to-end encrypted. Tap to verify.
                      </p>
                    </div>
                    <div className="setting-item">
                      <i className="ri-timer-line"></i>
                      <span>Disappearing messages</span>
                    </div>
                    <div className="setting-item">
                      <i className="ri-lock-line"></i>
                      <span>Chat lock</span>
                    </div>
                    <div className="setting-item">
                      <i className="ri-shield-check-line"></i>
                      <span>Advanced chat privacy</span>
                    </div>
                    <div className="setting-item">
                      <i className="ri-star-line"></i>
                      <span>Add to favorites</span>
                    </div>
                  </div>

                  <hr />

                  {/* Block / Report */}
                  {selectedRoom.type === "GROUP" ? null : otherUser ? (
                    <div className="user-block-report">
                      <div className="block-item">
                        <i className="ri-user-unfollow-line"></i>
                        <span>Block {otherUser.name}</span>
                      </div>
                      <div className="report-item">
                        <i className="ri-error-warning-line"></i>
                        <span>Report {otherUser.name}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}


              {/* right side chat header icons (video,call,search,view) */}
              <div className="chat-header-icons">
                <i
                  className="ri-phone-line text-textSecondary"
                  onClick={() => {
                    if (!otherUser) {
                      console.warn("No other user in this room to call");
                      return;
                    }
                    handleAudioCallClick();
                  }}
                />
                {remoteStream && <audio ref={audioRef} autoPlay playsInline />}

                {/* --- CALL WINDOW --- */}
                {callStatus !== "idle" && otherUser && (
                  <div className="call-overlay">
                    <div className="call-box">
                      {/* Avatar */}
                      <div className="call-avatar">
                        {otherUser.avatar ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${otherUser.avatar}`}
                            alt={otherUser.name}
                          />
                        ) : (
                          <span>{otherUser.name.charAt(0)}</span>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="call-info">
                        <h3>{otherUser.name}</h3>
                        <p>{otherUser.email}</p>
                        {callStatus === "in-call" && <p className="call-duration">{duration}</p>}
                        {callStatus === "incoming" && <p className="call-status-text">Incoming Call...</p>}
                        {callStatus === "calling" && <p className="call-status-text">Calling...</p>}
                      </div>

                      {/* Remote Audio */}
                      <audio ref={audioRef} autoPlay playsInline />

                      {/* Controls */}
                      <div className="call-controls">
                        {callStatus === "incoming" ? (
                          <>
                            <button onClick={acceptCall} className="btn-accept" title="Accept Call">
                              <i className="ri-phone-line"></i>
                            </button>
                            <button onClick={rejectCall} className="btn-reject" title="Reject Call">
                              <i className="ri-close-line"></i>
                            </button>
                          </>
                        ) : callStatus === "calling" ? (
                          <button onClick={endCall} className="btn-reject" title="Cancel Call">
                            <i className="ri-close-line"></i>
                          </button>
                        ) : callStatus === "in-call" ? (
                          <>
                            <button onClick={() => setIsMuted(!isMuted)} className={`btn-mute ${isMuted ? "active" : ""}`} title={isMuted ? "Unmute Mic" : "Mute Mic"}>
                              <i className={isMuted ? "ri-mic-off-line" : "ri-mic-line"}></i>
                            </button>
                            <button onClick={() => setIsSpeakerOn(!isSpeakerOn)} className={`btn-speaker ${!isSpeakerOn ? "muted" : ""}`} title={isSpeakerOn ? "Turn Off Speaker" : "Turn On Speaker"}>
                              <i className={isSpeakerOn ? "ri-volume-up-line" : "ri-volume-mute-line"}></i>
                            </button>
                            <button onClick={endCall} className="btn-reject" title="End Call">
                              <i className="ri-phone-line"></i>
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                <i className="ri-video-add-line text-textSecondary"></i>


                <i className="ri-more-2-line text-textSecondary" onClick={() => setShowMoreMenu((prev) => !prev)} ></i>
                {showMoreMenu && (
                  <div className="more-menu" ref={menuRef}>
                    <ul>
                      <li onClick={() => { setShowContactModal(true); setShowMoreMenu(false); }}>View Contact</li>
                      <li>Mute Notifications</li>
                      <li>Block Contact</li>
                      <li
                        onClick={() => {
                          if (!selectedRoom?._id) return;

                          toast((t) => (
                            <div className="my-toast">
                              <p>Are you sure you want to clear this chat?</p>
                              <div className="toast-buttons">
                                <button
                                  className="btn-clear"
                                  onClick={async () => {
                                    try {
                                      setRoomMessages((prev) => ({
                                        ...prev,
                                        [selectedRoom._id]: [],
                                      }));

                                      setMessages((prev) =>
                                        prev.filter((msg) => msg.room_id !== selectedRoom._id)
                                      );

                                      toast.success("Chat cleared from your window");
                                    } catch (err) {
                                      console.error(err);
                                      toast.error("Failed to clear chat");
                                    }

                                    toast.dismiss(t.id);
                                  }}
                                >
                                  Clear
                                </button>

                                <button
                                  className="btn-cancel"
                                  onClick={() => toast.dismiss(t.id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ), { duration: Infinity });
                        }}
                      >
                        Clear Chat
                      </li>


                    </ul>
                  </div>
                )}
                <i
                  className="ri-search-line text-textSecondary cursor-pointer"
                  onClick={() => setShowMessageSearch((prev) => !prev)}
                ></i>
                {showMessageSearch && (
                  <input
                    type="text"
                    className="chat-search-input"
                    placeholder="Search messages..."
                    value={messageSearchTerm}
                    onChange={(e) => setMessageSearchTerm(e.target.value)}
                  />
                )}

                {showContactModal && otherUser && (
                  <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <h3>Contact Details</h3>
                        <button onClick={() => setShowContactModal(false)}>X</button>
                      </div>
                      <div className="modal-body">
                        <div className="avatar-large">
                          {otherUser.avatar ? (
                            <img src={`${process.env.NEXT_PUBLIC_API_URL}${otherUser.avatar}`} alt={otherUser.name} />
                          ) : (
                            <span>{otherUser.name.charAt(0)}</span>
                          )}</div>
                        <p><strong>{otherUser.name}</strong></p>
                        <p>{otherUser.email}</p>

                        <hr />

                        <div>
                          <p>Add Tag:</p>
                          <input type="text" placeholder="Enter tag" />
                        </div>

                        <div>
                          <p>Important Contact: <input type="checkbox" /></p>
                        </div>

                        <div>
                          <p>Shared Images:</p>
                          <div className="shared-images">
                            {/* map shared images from your chat messages if needed */}
                          </div>
                        </div>
                        <div>
                          <button
                            className="delete-btn"
                            onClick={async () => {
                              if (!otherUser?._id) return;

                              try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${otherUser._id}/delete-from-my-contacts`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                  }
                                });

                                const data = await res.json();
                                if (res.ok) {
                                  toast.success('Contact deleted from your chats');
                                  setUsers(prev => prev.filter(u => u._id !== otherUser._id));
                                  setShowContactModal(false);
                                } else {
                                  toast.error(data.message || 'Failed to delete contact');
                                }
                              } catch (err) {
                                console.error(err);
                                toast.error('Something went wrong');
                              }
                            }}
                          >
                            Delete Contact
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="chat-messages" ref={chatRef}>
              {messages
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                )
                .filter((msg) =>
                  !messageSearchTerm.trim()
                    ? true
                    : msg.content.toLowerCase().includes(messageSearchTerm.toLowerCase())
                )
                .map((msg) => {
                  const senderId =
                    msg?.sender_id && typeof msg.sender_id === "object"
                      ? msg.sender_id._id
                      : msg?.sender_id || null;

                  const createdAt =
                    typeof msg.createdAt === "string"
                      ? msg.createdAt
                      : new Date(msg.createdAt).toISOString();

                  return (
                    <div
                      key={msg._id}
                      className={`message-row ${senderId === currentUser._id ? "me" : "other"
                        }`}
                    >
                      <div className="message-bubble">

                        {msg.content && (
                          <p>{highlightText(msg.content, messageSearchTerm)}</p>
                        )}

                        {msg.media && msg.media.length > 0 && (
                          <div className="media-gallery">
                            {msg.media.map((m: any, idx: number) => {
                              if (m.type === "image")
                                return (
                                  <img
                                    key={idx}
                                    src={m.url}
                                    alt={m.filename || "image"}
                                    className="chat-media-img"
                                  />
                                );

                              if (m.type === "video")
                                return (
                                  <video
                                    key={idx}
                                    src={m.url}
                                    controls
                                    className="chat-media-video"
                                  />
                                );

                              return (
                                <div className="doc-item" key={idx}>
                                  <i className="ri-file-2-line doc-icon"></i>
                                  <div>
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        downloadFile(
                                          getDownloadHref(m),
                                          m.filename || "Document"
                                        );
                                      }}
                                    >
                                      {m.filename || "Document"}
                                    </a>
                                    <div className="doc-meta">
                                      <small>
                                        {formatFileSize(m.size)} •{" "}
                                        {formatSidebarTime(createdAt)}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <span>
                          {new Date(createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}

              {isTyping && <em>{otherUser.name} is typing...</em>}
            </div>



            {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            <div className="chat-input">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                style={{
                  resize: "none",
                  overflow: "hidden",
                }}
              />

              <div className="chat-input-container">


                <i
                  className="ri-emotion-happy-line"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                ></i>

                {/* Emoji Picker Box */}
                {showEmojiPicker && (
                  <div className="emoji-picker-wrapper" ref={emojiRef}>
                    {/* Close Button */}
                    <button
                      className="emoji-close-btn"
                      onClick={() => setShowEmojiPicker(false)}
                    >
                      ×
                    </button>

                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      lazyLoadEmojis
                      searchDisabled={false}
                      skinTonesDisabled={false}
                    />
                  </div>
                )}
              </div>

              <i
                className={`ri-mic-line text-textPrimary ${isRecording ? "mic-recording" : ""}`}
                onClick={toggleRecording}
                aria-pressed={isRecording}
                title={isRecording ? "Stop voice input" : "Start voice input"}
                style={{ cursor: "pointer", position: "relative" }}
              ></i>

              <i className="ri-attachment-2 text-textPrimary" onClick={() => setShowAttachmentMenu((prev) => !prev)}></i>
              {showAttachmentMenu && (
                <div className="attachment-menu" ref={attachmentRef}>
                  <ul>
                    <li
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowAttachmentMenu(false);
                      }}
                    >
                      <i className="ri-image-line"></i> Gallery
                    </li>
                    <li
                      onClick={() => {
                        fileInputDocsRef.current?.click();
                        setShowAttachmentMenu(false);
                      }}
                    >
                      <i className="ri-file-2-line"></i> Documents
                    </li>
                    <li><i className="ri-camera-line"></i> Camera</li>
                    <li onClick={() => setShowContactsModal(true)}>
                      <i className="ri-contacts-line"></i> Contact
                    </li>
                  </ul>
                </div>
              )}

              {showContactsModal && (
                <div className="contacts-modal-backdrop">
                  <div className="contacts-modal">
                    {/* Header with title and buttons */}
                    <div className="contacts-modal-header">
                      <h3>Select User With Continue Chat</h3>
                      <div className="contacts-modal-actions">
                        <button onClick={() => setShowContactsModal(false)}>Cancel</button>
                        <button
                          onClick={() => {
                            if (selectedUsers.length === 0)
                              return alert("Select a user first!");
                            const selectedUser = users.find(
                              (u) => u._id === selectedUsers[0]
                            );
                            if (!selectedUser) return;
                            handleSelectUser(selectedUser);
                            setShowContactsModal(false);
                            setSelectedUsers([]);
                          }}
                        >
                          Start Chat
                        </button>
                      </div>
                    </div>

                    {/* Scrollable contacts list */}
                    <div className="contacts-list">
                      {users.map((user) => (
                        <label key={user._id} className="contact-item">
                          <div className="avatar">
                            {user.avatar ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`}
                                alt={user.name}
                              />
                            ) : (
                              <span>{user.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="contact-name">{user.name}</span>
                          <input
                            type="radio"
                            name="selectedUser"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => setSelectedUsers([user._id])}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*,video/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleMediaSelect}
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                multiple
                ref={fileInputDocsRef}
                style={{ display: "none" }}
                onChange={handleDocumentSelect}
              />

              <button onClick={handleSend}>
                Send<FiSend />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="no-user-select">
              <i className="ri-wechat-line"></i>
              <p className="no-user-select-text">Select a user to start chatting</p>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
