
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Pagination,
  Tooltip,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  ArrowBack,
  NotificationsActive,
  NotificationsNone,
  DoneAll,
  DeleteOutline,
  MarkEmailRead,
  Refresh,
  InboxOutlined,
} from "@mui/icons-material";

import axiosInstance from "../api/axios";

const Notifications = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionId, setActionId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const limit = 10;

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        `/notifications?page=${page}&limit=${limit}`
      );

      const body = response.data;

      const list =
        body.notifications ||
        (Array.isArray(body.data)
          ? body.data
          : body.data?.notifications || body.data?.items || []);

      setNotifications(Array.isArray(list) ? list : []);

      const count =
        body.unreadCount ??
        body.data?.unreadCount ??
        0;

      setUnreadCount(Number(count) || 0);

      const pages =
        body.totalPages ??
        body.pagination?.totalPages ??
        body.data?.totalPages ??
        1;

      setTotalPages(Math.max(1, Number(pages) || 1));
    } catch (err) {
      console.error("Notification fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (notificationId) => {
    try {
      setActionId(notificationId);

      await axiosInstance.patch(
        `/notifications/${notificationId}/read`
      );

      await fetchNotifications();
    } catch (err) {
      console.error("Mark read error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to mark notification as read."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);

      await axiosInstance.patch("/notifications/read-all");

      await fetchNotifications();
    } catch (err) {
      console.error("Mark all read error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (notificationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    try {
      setActionId(notificationId);

      await axiosInstance.delete(
        `/notifications/${notificationId}`
      );

      await fetchNotifications();
    } catch (err) {
      console.error("Delete notification error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete notification."
      );
    } finally {
      setActionId(null);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (filter === "UNREAD") {
      return notifications.filter((item) => !item.isRead);
    }

    if (filter === "READ") {
      return notifications.filter((item) => item.isRead);
    }

    return notifications;
  }, [notifications, filter]);

  const unreadOnPage = notifications.filter(
    (item) => !item.isRead
  ).length;

  const readOnPage = notifications.filter(
    (item) => item.isRead
  ).length;

  const getInitial = (notification) => {
    const name =
      notification.senderName ||
      notification.fromName ||
      notification.metadata?.senderName ||
      notification.title ||
      "N";

    return String(name).trim().charAt(0).toUpperCase() || "N";
  };

  const getAvatarColor = (notification) => {
    const colors = [
      "#FCE7F3",
      "#E0F2FE",
      "#DCFCE7",
      "#FEF3C7",
      "#EDE9FE",
      "#FCE7D6",
    ];

    const value = String(
      notification._id || notification.id || "1"
    );

    const index = value.charCodeAt(0) % colors.length;

    return colors[index];
  };

  const formatRelativeTime = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    const diff = Math.max(0, Date.now() - parsed.getTime());

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeLabel = (notification) => {
    const type = notification.type;

    if (!type) return "";

    return String(type)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filterButtonSx = (active) => ({
    minWidth: 0,
    flex: 1,
    px: { xs: 1, sm: 2 },
    py: 0.65,
    minHeight: 34,
    borderRadius: 1.5,
    textTransform: "none",
    fontSize: { xs: 11.5, sm: 13 },
    fontWeight: active ? 700 : 500,
    color: active ? "primary.main" : "text.secondary",
    backgroundColor: active ? "primary.50" : "transparent",
    border: "1px solid",
    borderColor: active ? "primary.light" : "transparent",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: active ? "primary.50" : "action.hover",
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 760,
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2.5 },
        boxSizing: "border-box",
        overflowX: "hidden",
        minHeight: "100%",
        backgroundColor: { xs: "#F7F8FA", sm: "transparent" },
      }}
    >
      {/* Compact Header */}
      <Paper
        elevation={0}
        sx={{
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 1.25, sm: 2 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: { xs: 2, sm: 3 },
          backgroundColor: "background.paper",
          mb: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <NotificationsActive
              color="primary"
              sx={{ fontSize: 20 }}
            />

            <Typography
              fontWeight={700}
              sx={{ fontSize: { xs: 14, sm: 19 } }}
            >
              Notifications
            </Typography>
          </Stack>

          <Tooltip title="Refresh">
            <span>
              <IconButton
                size="small"
                onClick={fetchNotifications}
                disabled={loading}
                aria-label="Refresh notifications"
                sx={{ width: 30, height: 30 }}
              >
                {loading ? (
                  <CircularProgress size={15} />
                ) : (
                  <Refresh sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {/* Filter Tabs */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            mt: 1.25,
            p: 0.4,
            backgroundColor: "#F3F4F6",
            borderRadius: 1.75,
          }}
        >
          <Button
            onClick={() => setFilter("ALL")}
            sx={filterButtonSx(filter === "ALL")}
          >
            All
            <Box
              component="span"
              sx={{
                ml: 0.5,
                fontSize: 10,
                opacity: 0.75,
              }}
            >
              {notifications.length}
            </Box>
          </Button>

          <Button
            onClick={() => setFilter("UNREAD")}
            sx={filterButtonSx(filter === "UNREAD")}
          >
            Unread
            <Box
              component="span"
              sx={{
                ml: 0.5,
                fontSize: 10,
                opacity: 0.75,
              }}
            >
              {unreadOnPage}
            </Box>
          </Button>

          <Button
            onClick={() => setFilter("READ")}
            sx={filterButtonSx(filter === "READ")}
          >
            Read
            <Box
              component="span"
              sx={{
                ml: 0.5,
                fontSize: 10,
                opacity: 0.75,
              }}
            >
              {readOnPage}
            </Box>
          </Button>
        </Stack>
      </Paper>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 1, borderRadius: 2, fontSize: 12 }}
        >
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress size={25} />
        </Box>
      ) : filteredNotifications.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <InboxOutlined
            sx={{
              fontSize: 42,
              color: "text.disabled",
              mb: 1,
            }}
          />

          <Typography fontWeight={600} fontSize={14}>
            {filter === "UNREAD"
              ? "No unread notifications"
              : filter === "READ"
              ? "No read notifications"
              : "No notifications yet"}
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={12}
            sx={{ mt: 0.5 }}
          >
            You are all caught up!
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Notification Cards */}
          <Stack spacing={0.75}>
            {filteredNotifications.map((notification) => {
              const id = notification._id || notification.id;
              const isRead = Boolean(notification.isRead);
              const isProcessing = actionId === id;

              return (
                <Paper
                  key={id}
                  elevation={0}
                  sx={{
                    p: { xs: 1.1, sm: 1.75 },
                    border: "1px solid",
                    borderColor: isRead
                      ? "#E5E7EB"
                      : "#D8E5F8",
                    borderRadius: { xs: 1.75, sm: 2 },
                    backgroundColor: "background.paper",
                    minWidth: 0,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "#FAFBFD",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ minWidth: 0 }}
                  >
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: { xs: 25, sm: 34 },
                        height: { xs: 25, sm: 34 },
                        flexShrink: 0,
                        fontSize: { xs: 11, sm: 14 },
                        fontWeight: 700,
                        bgcolor: getAvatarColor(notification),
                        color: "#374151",
                      }}
                    >
                      {getInitial(notification)}
                    </Avatar>

                    {/* Text */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        component="div"
                        sx={{
                          fontSize: { xs: 11.5, sm: 13.5 },
                          lineHeight: 1.45,
                          color: "text.primary",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 700,
                            mr: 0.4,
                          }}
                        >
                          {notification.title || "Notification"}
                        </Box>

                        {!isRead && (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              ml: 0.4,
                              verticalAlign: "middle",
                            }}
                          />
                        )}

                        {notification.message && (
                          <Box
                            component="span"
                            sx={{
                              color: "text.secondary",
                              ml: 0.4,
                            }}
                          >
                            {notification.message}
                          </Box>
                        )}
                      </Typography>

                      {getTypeLabel(notification) && (
                        <Chip
                          label={getTypeLabel(notification)}
                          size="small"
                          variant="outlined"
                          sx={{
                            mt: 0.55,
                            height: 19,
                            borderRadius: 0.75,
                            fontSize: 9.5,
                            backgroundColor: "#F5F7FA",
                            borderColor: "#E5E7EB",
                            "& .MuiChip-label": {
                              px: 0.75,
                            },
                          }}
                        />
                      )}

                      <Typography
                        component="div"
                        sx={{
                          mt: 0.35,
                          fontSize: { xs: 10, sm: 11 },
                          color: "text.disabled",
                          lineHeight: 1.3,
                        }}
                      >
                        {formatRelativeTime(notification.createdAt)}
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Stack
                      direction="row"
                      spacing={0}
                      sx={{ flexShrink: 0, mt: -0.35 }}
                    >
                      {!isRead && (
                        <Tooltip title="Mark as read">
                          <span>
                            <IconButton
                              size="small"
                              disabled={isProcessing}
                              onClick={() => handleMarkRead(id)}
                              aria-label="Mark as read"
                              sx={{
                                width: 27,
                                height: 27,
                                color: "primary.main",
                              }}
                            >
                              {isProcessing ? (
                                <CircularProgress size={13} />
                              ) : (
                                <MarkEmailRead
                                  sx={{ fontSize: 15 }}
                                />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}

                      <Tooltip title="Delete">
                        <span>
                          <IconButton
                            size="small"
                            disabled={isProcessing}
                            onClick={() => handleDelete(id)}
                            aria-label="Delete notification"
                            sx={{
                              width: 27,
                              height: 27,
                              color: "text.disabled",
                              "&:hover": {
                                color: "error.main",
                              },
                            }}
                          >
                            <DeleteOutline sx={{ fontSize: 16 }} />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1.5,
                overflowX: "auto",
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="small"
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={1}
              />
            </Box>
          )}
        </>
      )}

      {/* Bottom Actions */}
      <Paper
        elevation={0}
        sx={{
          position: { xs: "sticky", sm: "static" },
          bottom: 0,
          zIndex: 2,
          mt: 1.25,
          p: { xs: 0.9, sm: 1.5 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "background.paper",
          boxShadow: {
            xs: "0 -3px 12px rgba(0,0,0,0.04)",
            sm: "none",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Button
            size="small"
            variant="text"
            disabled={unreadCount === 0 || markingAll}
            startIcon={
              markingAll ? (
                <CircularProgress size={13} />
              ) : (
                <DoneAll sx={{ fontSize: 15 }} />
              )
            }
            onClick={handleMarkAllRead}
            sx={{
              textTransform: "none",
              fontSize: { xs: 10.5, sm: 12 },
              minWidth: 0,
              px: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            Mark all as read
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<ArrowBack sx={{ fontSize: 14 }} />}
            onClick={() => navigate(-1)}
            sx={{
              textTransform: "none",
              fontSize: { xs: 10.5, sm: 12 },
              minWidth: 0,
              px: { xs: 1, sm: 1.5 },
              whiteSpace: "nowrap",
              borderRadius: 1.5,
            }}
          >
            Go back
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Notifications;