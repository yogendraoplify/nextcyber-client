import { useEffect, useState } from "react";
import axios from "axios";
import { onSocketReady, offSocketReady } from "@/utils/socket";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "@/store/slices/appSettingsSlice";

export function useNotifications() {
  // const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   axios
  //     .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications`, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setNotifications(res.data.items || []);
  //       setUnread(res.data.unreadCount || 0);
  //     });
  // }, []);

  useEffect(() => {
    let cleanupSocketListeners;

    const handleSocketReady = (socket) => {
      const onNotification = (data) => {
        console.log("🔔 New notification:", data);
        toast.success(data.message || "You have a new notification");
        data && dispatch(setNotifications(data));
        data && setUnread((c) => c + 1);
      };

      const onConnected = (data) => {
        console.log("✅", data.message);
        toast.success(data.message);
      };

      socket.on("notification", onNotification);
      socket.on("connected", onConnected);

      // 🔥 store cleanup
      cleanupSocketListeners = () => {
        socket.off("notification", onNotification);
        socket.off("connected", onConnected);
      };

      return () => {
        socket.off("notification", onNotification);
        socket.off("connected", onConnected);
      };
    };

    onSocketReady(handleSocketReady);

    return () => {
      if (cleanupSocketListeners) cleanupSocketListeners();
      offSocketReady(handleSocketReady);
    };
  }, []);

  return { unread };
}
