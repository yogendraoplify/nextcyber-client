"use client";
import { timeFormatter } from "@/helper";
import useDidChange from "@/hooks/useDidChange";
import {
  asyncGetCompanyNotifications,
  asyncGetStudentNotifications,
  asyncMarkCompanyNotificationAsRead,
  asyncMarkStudentNotificationAsRead,
} from "@/store/actions/notificationActions";
import { Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationsPanel() {
  const { user } = useSelector((state) => state.auth);
  const { notifications, isLoading } = useSelector(
    (state) => state.notification,
  );
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("ALL");

  const handleMarkAllAsRead = () => {
    if (user?.role === "STUDENT") {
      dispatch(asyncMarkStudentNotificationAsRead());
    }

    // Add logic for COMPANY role if needed
    if (user?.role === "COMPANY") {
      dispatch(asyncMarkCompanyNotificationAsRead());
    }
  };

  const fetchNotifications = () => {
    if (user?.role === "STUDENT") {
     if (notifications.length === 0) dispatch(asyncGetStudentNotifications({ limit: 10 }));
    }

    if (user?.role === "COMPANY") {
     if (notifications.length === 0) dispatch(asyncGetCompanyNotifications({ limit: 10 }));
    }
  };

  useEffect(() => {
    console.log("Fetching notifications...", notifications);
    fetchNotifications();
  }, []);

  useDidChange(selectedTab, () => {
    const query = {
      limit: 10,
      type: selectedTab === "ALL" ? undefined : selectedTab,
    };
    if (user?.role === "STUDENT") {
      dispatch(asyncGetStudentNotifications(query));
    }

    if (user?.role === "COMPANY") {
      dispatch(asyncGetCompanyNotifications(query));
    }
  });

  return (
    <div className="w-[748px] rounded-xl bg-g-600 mx-auto">
      <div className="p-5 border-b border-g-700 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-g-100 text-xl font-medium">Your Notifications</h2>
          <button onClick={handleMarkAllAsRead} className="text-sm font-medium text-dark-green underline cursor-pointer">
            Mark all as read
          </button>
        </div>

        <div className="flex items-center gap-1 p-2 rounded-full bg-g-700 border border-g-500">
          <button
            onClick={() => setSelectedTab("ALL")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-full ${selectedTab === "ALL" ? "bg-g-500" : ""}`}
          >
            <span className="text-sm font-medium text-g-50">All</span>
            {/* <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-g-400 text-g-100">
              4
            </span> */}
          </button>

          <button
            onClick={() => setSelectedTab("JOBS")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-full ${selectedTab === "JOBS" ? "bg-g-500" : ""}`}
          >
            <span className="text-sm font-medium text-g-200">Jobs</span>
            {/* <span className="px-1.5 py-0.5 text-xs rounded bg-g-500 text-g-200">
              6
            </span> */}
          </button>
          {user?.role === "STUDENT" && (
            <button
              onClick={() => setSelectedTab("JOB_APPLICATION")}
              className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-full ${selectedTab === "JOB_APPLICATION" ? "bg-g-500" : ""}`}
            >
              <span className="text-sm font-medium text-g-200">
                Applications
              </span>
              {/* <span className="px-1.5 py-0.5 text-xs rounded bg-g-500 text-g-200">
                  3
                </span> */}
            </button>
          )}
          <button
            onClick={() => setSelectedTab("PAYMENTS")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-full ${selectedTab === "PAYMENTS" ? "bg-g-500" : ""}`}
          >
            <span className="text-sm font-medium text-g-200">Payments</span>
            {/* <span className="px-1.5 py-0.5 text-xs rounded bg-g-500 text-g-200">
              2
            </span> */}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {isLoading ? (
          <span className="text-center text-g-200">
            <Loader2 className="animate-spin mx-auto" />
          </span>
        ) : notifications.length > 0 ? (
          notifications?.map((notification) => (
            <div
              key={notification.id}
              className="flex gap-5 p-5 bg-g-700 rounded-lg shadow-[0_0_4px_#2F3031]"
            >
              <div className="w-12 h-12 rounded bg-primary flex items-center justify-center text-basewhite font-bold shrink-0">
                {notification.title.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-g-100">
                  {notification.title}
                </p>
                <p className="text-sm text-g-200">{notification.message}</p>
                <p className="text-xs text-g-300">
                  {timeFormatter(notification.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-g-200">No notifications found.</p>
        )}
        {/* <div className="flex gap-5 p-5 bg-g-700 rounded-lg shadow-[0_0_4px_#2F3031]">
          <div className="w-12 h-12 rounded bg-primary flex items-center justify-center text-basewhite font-bold shrink-0">
            M
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-g-100">
              Job Posted Successfully
            </p>
            <p className="text-sm text-g-200">
              Your job listing is live and visible to job seekers.{" "}
              <span className=" text-primary-2 underline cursor-pointer">
                JOB-ID
              </span>
            </p>
            <p className="text-xs text-g-300">July 16, 2024 | 09:23 PM</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
