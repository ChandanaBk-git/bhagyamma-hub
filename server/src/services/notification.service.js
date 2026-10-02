
import Notification from "../models/Notification.js";

export const createNotification = async ({
  recipientId,
  recipientRole,
  title,
  message,
  type,
  priority = "NORMAL",
  referenceId = null,
  referenceType = null,
  metadata = {},
  eventId = null,
  branchId = null,
}) => {
  if (!recipientId) {
    throw new Error("Notification recipient is required");
  }

  if (!title || !message || !type) {
    throw new Error("Title, message and type are required");
  }

  const validRoles = [
    "ADMIN",
    "MANAGER",
    "MEMBER",
    "PACKAGING",
  ];

  if (!validRoles.includes(recipientRole)) {
    throw new Error("Invalid notification recipient role");
  }

  try {
    const notification = await Notification.create({
      recipientId,
      recipientRole,
      title,
      message,
      type,
      priority,
      referenceId,
      referenceType,
      metadata,
      eventId,
      branchId,
    });

    return notification;
  } catch (error) {
    // Duplicate event: return existing notification
    if (error.code === 11000 && eventId) {
      return Notification.findOne({
        recipientId,
        eventId,
      });
    }

    throw error;
  }
};

// Create notifications for multiple recipients
export const createBulkNotifications = async (
  recipients,
  notificationData
) => {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return [];
  }

  const documents = recipients.map((recipient) => ({
    ...notificationData,
    recipientId: recipient._id,
    recipientRole: recipient.role,
  }));

  return Notification.insertMany(documents, {
    ordered: false,
  });
};