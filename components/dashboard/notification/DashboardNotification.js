"use client";
import {
  asyncGetCompanyNotifications,
  asyncGetStudentNotifications,
} from "@/store/actions/notificationActions";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck } from "lucide-react";
import React, { useEffect } from "react";

const DashboardNotification = () => {
  const { notifications, isLoading, totalPages } = useSelector(
    (state) => state.notification,
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchNotifications = () => {
    if (user?.role === "STUDENT") {
      if (notifications.length === 0)
        dispatch(asyncGetStudentNotifications({ limit: 4, page: 1 }));
    }

    if (user?.role === "COMPANY") {
      if (notifications.length === 0)
        dispatch(asyncGetCompanyNotifications({ limit: 4, page: 1 }));
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (isLoading) {
    return (
      <div className="p-2.5 pb-4 bg-g-600 mt-3.5 rounded-lg border border-g-500">
        <h4 className="text-g-100 font-semibold leading-6 text-base">
          Notifications
        </h4>
        <div className="mt-2.5 gap-2.5 flex flex-col">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex gap-2 items-start max-w-3/4 animate-pulse"
            >
              <div className="w-4 h-4 bg-g-200 rounded-full" />
              <div className="flex flex-col gap-1 w-full">
                <div className="w-full h-3 bg-g-200 rounded" />
                <div className="w-1/2 h-2 bg-g-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-2.5 pb-4 bg-g-600 mt-3.5 rounded-lg border border-g-500">
        <h4 className="text-g-100 font-semibold leading-6 text-base">
          Notifications
        </h4>
        <div className="mt-2.5 gap-2.5 flex flex-col">
          {notifications.length === 0 ? (
            <p className="text-g-200 text-xs leading-4">
              No notifications found.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex gap-2 items-start max-w-3/4"
              >
                <BadgeCheck size={18} className="text-accent-color-1" />
                <div className="text-g-100 leading-[150%] text-xs space-y-1">
                  <p>{notification.message}</p>
                  <span className="text-g-200 text-xs leading-4">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardNotification;
