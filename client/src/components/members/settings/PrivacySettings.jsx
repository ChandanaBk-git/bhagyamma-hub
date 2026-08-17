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

const PrivacySettings = ({ value = {}, onChange }) => {

  const [privacy, setPrivacy] = useState(value);

  const syncValue = (nextValue) => {
    setPrivacy(nextValue);
    onChange?.(nextValue);
  };

  const handleToggle = (field) => {
    const nextValue = {
      ...privacy,
      [field]: !privacy[field],
    };
    syncValue(nextValue);
  };

  return (

    <Card
      elevation={2}
      sx={{
        borderRadius:4,
        mb:3,
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Privacy Settings
        </Typography>

        <Stack spacing={2}>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Stack>

              <Typography fontWeight="bold">
                Public Profile
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Allow other members to view your profile.
              </Typography>

            </Stack>

            <Switch
              color="success"
              checked={privacy.profileVisibility}
              onChange={() =>
                handleToggle("profileVisibility")
              }
            />

          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Stack>

              <Typography fontWeight="bold">
                Show Mobile Number
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Display your mobile number to your network.
              </Typography>

            </Stack>

            <Switch
              color="success"
              checked={privacy.showMobile}
              onChange={() =>
                handleToggle("showMobile")
              }
            />

          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Stack>

              <Typography fontWeight="bold">
                Show Email Address
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Allow members to view your email.
              </Typography>

            </Stack>

            <Switch
              color="success"
              checked={privacy.showEmail}
              onChange={() =>
                handleToggle("showEmail")
              }
            />

          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Stack>

              <Typography fontWeight="bold">
                Show Referral Network
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Display your referral tree publicly.
              </Typography>

            </Stack>

            <Switch
              color="success"
              checked={privacy.showNetwork}
              onChange={() =>
                handleToggle("showNetwork")
              }
            />

          </Stack>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >

            <Stack>

              <Typography fontWeight="bold">
                Two-Factor Authentication
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Add an extra layer of security to your account.
              </Typography>

            </Stack>

            <Switch
              color="success"
              checked={privacy.twoFactor}
              onChange={() =>
                handleToggle("twoFactor")
              }
            />

          </Stack>

        </Stack>

        <Button
          variant="contained"
          color="success"
          sx={{
            mt:4,
          }}
          onClick={() => syncValue(privacy)}
        >
          Save Privacy Settings
        </Button>

      </CardContent>

    </Card>

  );

};

export default PrivacySettings;