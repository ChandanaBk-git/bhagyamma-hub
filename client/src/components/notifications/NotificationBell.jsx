import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, IconButton, Tooltip } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import axiosInstance from "../../api/axios";

const NotificationBell = ({ to = "/member/notifications" }) => {
const [unreadCount, setUnreadCount] = useState(0);
const navigate = useNavigate();

useEffect(() => {
let mounted = true;

```
const fetchUnreadCount = async () => {
  try {
    const response = await axiosInstance.get(
      "/notifications/unread-count"
    );

    if (mounted && response.data?.success) {
      setUnreadCount(
        Number(response.data.unreadCount || 0)
      );
    }
  } catch (error) {
    console.error(
      "Failed to fetch notification count:",
      error
    );
  }
};

fetchUnreadCount();

const interval = setInterval(fetchUnreadCount, 30000);

return () => {
  mounted = false;
  clearInterval(interval);
};
```

}, []);

return ( <Tooltip title="Notifications">
<IconButton
color="inherit"
onClick={() => navigate(to)}
aria-label="Open notifications"
> <Badge
       badgeContent={unreadCount}
       color="error"
       max={99}
       overlap="circular"
     > <NotificationsNoneIcon /> </Badge> </IconButton> </Tooltip>
);
};

export default NotificationBell;
