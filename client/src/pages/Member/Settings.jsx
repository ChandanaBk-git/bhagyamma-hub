import { Box, Typography, Alert, Snackbar } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import AccountSettings from "../../components/members/settings/AccountSettings";
import NotificationSettings from "../../components/members/settings/NotificationSettings";
import PrivacySettings from "../../components/members/settings/PrivacySettings";
import ThemeSettings from "../../components/members/settings/ThemeSettings";
import DangerZone from "../../components/members/settings/DangerZone";

const STORAGE_KEY = "member-settings";

const defaultSettings = {
  notifications: {
    email: true,
    sms: false,
    push: true,
    orderUpdates: true,
    commissionAlerts: true,
    referralAlerts: true,
    promotionalOffers: false,
  },
  privacy: {
    profileVisibility: true,
    showMobile: false,
    showEmail: false,
    showNetwork: true,
    twoFactor: false,
  },
  appearance: {
    darkMode: false,
    themeColor: "Green",
    language: "English",
  },
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const saveSettings = (nextSettings) => {
    setSettings(nextSettings);
    setToast({ open: true, message: "Settings saved", severity: "success" });
  };

  const accountSummary = useMemo(() => ({
    userId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).userId || "-" : "-",
    email: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email || "-" : "-",
    mobile: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).mobile || "-" : "-",
    language: settings.appearance.language,
  }), [settings.appearance.language]);

  return (
    <Box sx={{ p: 3, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      <AccountSettings summary={accountSummary} />

      <NotificationSettings
        value={settings.notifications}
        onChange={(notifications) => saveSettings({ ...settings, notifications })}
      />

      <PrivacySettings
        value={settings.privacy}
        onChange={(privacy) => saveSettings({ ...settings, privacy })}
      />

      <ThemeSettings
        value={settings.appearance}
        onChange={(appearance) => saveSettings({ ...settings, appearance })}
      />

      <DangerZone />

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;