import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Paper,
  Divider,
  Chip,
  Box,
} from "@mui/material";

import {
  Close,
  Person,
  Phone,
  Email,
  CalendarMonth,
  Group,
  Badge,
  Share,
} from "@mui/icons-material";

const InfoRow = ({ icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1,
      borderBottom: "1px solid #F1F1F1",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {icon}

      <Typography
        fontWeight={600}
        color="text.secondary"
      >
        {label}
      </Typography>
    </Box>

    <Typography
      fontWeight={600}
      textAlign="right"
    >
      {value || "-"}
    </Typography>
  </Box>
);

const MemberDetailsModal = ({
  open,
  onClose,
  member,
}) => {
  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      {/* Header */}

      <DialogTitle
        sx={{
          bgcolor: "#2E7D32",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Member Details

        <IconButton
          onClick={onClose}
          sx={{ color: "#fff" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>

        {/* Profile */}

        <Box
          sx={{
            textAlign: "center",
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 95,
              height: 95,
              mx: "auto",
              bgcolor: "#2E7D32",
            }}
          >
            <Person sx={{ fontSize: 50 }} />
          </Avatar>

          <Typography
            variant="h5"
            fontWeight="bold"
            mt={2}
          >
            {member.name}
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            {member.userId}
          </Typography>

          <Chip
            label={member.role}
            color={
              member.role === "MANAGER"
                ? "primary"
                : "success"
            }
            sx={{ mt: 2 }}
          />
        </Box>

        <Grid container spacing={3}>

          {/* Personal */}

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                👤 Personal Information
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <InfoRow
                icon={<Person color="success" />}
                label="Name"
                value={member.name}
              />

              <InfoRow
                icon={<Badge color="primary" />}
                label="User ID"
                value={member.userId}
              />

              <InfoRow
                icon={<Share color="warning" />}
                label="Referral Code"
                value={member.referralCode}
              />

              <InfoRow
                icon={<Group color="info" />}
                label="Role"
                value={member.role}
              />
            </Paper>
          </Grid>

          {/* Contact */}

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                📞 Contact Information
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <InfoRow
                icon={<Phone color="success" />}
                label="Mobile"
                value={member.mobile}
              />

              <InfoRow
                icon={<Email color="error" />}
                label="Email"
                value={member.email}
              />
            </Paper>
          </Grid>

          {/* Referral */}

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                👥 Referral Information
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <InfoRow
                icon={<Person color="primary" />}
                label="Sponsor"
                value={member.sponsorName}
              />

              <InfoRow
                icon={<Group color="success" />}
                label="Direct Members"
                value={member.children?.length || 0}
              />
            </Paper>
          </Grid>

          {/* Account */}

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                📅 Account Information
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <InfoRow
                icon={<CalendarMonth color="warning" />}
                label="Joined On"
                value={
                  member.createdAt
                    ? new Date(
                        member.createdAt
                      ).toLocaleDateString()
                    : "-"
                }
              />
            </Paper>
          </Grid>

        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsModal;