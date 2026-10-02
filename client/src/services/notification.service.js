
import axiosInstance from "../api/axios";

const BASE_URL = "/notifications";

export const getNotifications = async (params = {}) => {
  const response = await axiosInstance.get(BASE_URL, {
    params,
  });

  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get(
    `${BASE_URL}/unread-count`
  );

  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axiosInstance.patch(
    `${BASE_URL}/${id}/read`
  );

  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch(
    `${BASE_URL}/read-all`
  );

  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(
    `${BASE_URL}/${id}`
  );

  return response.data;
};