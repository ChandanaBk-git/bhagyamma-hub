
import { Box, Typography } from "@mui/material";
import DangerZone from "../../components/members/settings/DangerZone";

const Settings = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F6F8F7",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 650, mx: "auto" }}>
        <Typography
          variant="h5"
          fontWeight={800}
          color="#263C2D"
          mb={0.5}
        >
          Delete Account
        </Typography>

        <Typography
          fontSize={13}
          color="text.secondary"
          mb={3}
        >
          Manage the permanent deletion of your member account.
        </Typography>

        <Box
          sx={{
            bgcolor: "#FFFFFF",
            border: "1px solid #E8ECE9",
            borderRadius: 3,
            p: { xs: 2.5, sm: 3 },
            boxShadow: "0 3px 15px rgba(0,0,0,0.03)",
          }}
        >
          <DangerZone />
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
