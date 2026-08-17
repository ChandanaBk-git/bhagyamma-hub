import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Switch,
  Divider,
  Button,
} from "@mui/material";

const NotificationSettings = ({ value = {}, onChange }) => {

  const [notifications, setNotifications] = useState(value);

  const syncValue = (nextValue) => {
    setNotifications(nextValue);
    onChange?.(nextValue);
  };

  const handleToggle = (field) => {
    const nextValue = {
      ...notifications,
      [field]: !notifications[field],
    };
    syncValue(nextValue);
  };

  const settings = [

    {
      key: "email",
      title: "Email Notifications",
      description:
        "Receive important account updates through email.",
    },

    {
      key: "sms",
      title: "SMS Notifications",
      description:
        "Receive SMS alerts for important activities.",
    },

    {
      key: "push",
      title: "Push Notifications",
      description:
        "Receive instant browser notifications.",
    },

    {
      key: "orderUpdates",
      title: "Order Updates",
      description:
        "Notify me when my orders are processed or delivered.",
    },

    {
      key: "commissionAlerts",
      title: "Commission Alerts",
      description:
        "Notify me whenever I receive a commission.",
    },

    {
      key: "referralAlerts",
      title: "Referral Notifications",
      description:
        "Notify me whenever someone joins under my referral.",
    },

    {
      key: "promotionalOffers",
      title: "Promotional Offers",
      description:
        "Receive offers, discounts and promotional campaigns.",
    },

  ];

  return (

    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Notification Settings
        </Typography>

        <Stack spacing={2}>

          {settings.map((item, index) => (

            <div key={item.key}>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >

                <Stack>

                  <Typography fontWeight="bold">
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.description}
                  </Typography>

                </Stack>

                <Switch
                  color="success"
                  checked={notifications[item.key]}
                  onChange={() =>
                    handleToggle(item.key)
                  }
                />

              </Stack>

              {index !== settings.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}

            </div>

          ))}

        </Stack>

        <Button
          variant="contained"
          color="success"
          sx={{
            mt: 4,
          }}
          onClick={() => syncValue(notifications)}
        >
          Save Notification Settings
        </Button>

      </CardContent>

    </Card>

  );

};

export default NotificationSettings;