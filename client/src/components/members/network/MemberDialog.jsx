import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  Person,
  Phone,
  Email,
  Badge,
  CardGiftcard,
  CalendarMonth,
  Group,
} from "@mui/icons-material";

const MemberDialog = ({
  open,
  onClose,
  member,
}) => {
  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 0,
          border: "1px solid #2E7D32",
          boxShadow: "none",
          m: 1,
        },
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <DialogTitle
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1.2,
          fontSize: {
            xs: "15px",
            sm: "17px",
          },
          fontWeight: 700,
          color: "#1F2937",
          borderBottom:
            "1px solid #E5E7EB",
        }}
      >
        Member Details
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.5, sm: 2 },
        }}
      >
        {/* =================================================
            MEMBER HEADER
        ================================================= */}

        <Stack
          direction="row"
          spacing={{ xs: 1.2, sm: 2 }}
          alignItems="center"
          mb={1.5}
        >
          <Avatar
            sx={{
              width: {
                xs: 48,
                sm: 58,
              },
              height: {
                xs: 48,
                sm: 58,
              },
              bgcolor: "#2E7D32",
              borderRadius: 0,
              fontSize: {
                xs: 20,
                sm: 24,
              },
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {member.name
              ?.charAt(0)
              ?.toUpperCase()}
          </Avatar>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "15px",
                  sm: "18px",
                },
                lineHeight: 1.2,
                fontWeight: 700,
                color: "#111827",
                wordBreak: "break-word",
              }}
            >
              {member.name}
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },
                color: "#6B7280",
                wordBreak: "break-word",
              }}
            >
              {member.userId}
            </Typography>

            <Stack
              direction="row"
              spacing={0.5}
              mt={0.7}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                label={
                  member.role ||
                  "MEMBER"
                }
                size="small"
                sx={{
                  height: 22,
                  borderRadius: 0,
                  background:
                    "#E8F5E9",
                  color:
                    "#2E7D32",
                  fontSize: "9px",
                  fontWeight: 700,
                  "& .MuiChip-label": {
                    px: 0.8,
                  },
                }}
              />

              <Chip
                label={
                  member.isActive
                    ? "Active"
                    : "Inactive"
                }
                size="small"
                sx={{
                  height: 22,
                  borderRadius: 0,
                  background:
                    member.isActive
                      ? "#E8F5E9"
                      : "#FEE2E2",
                  color:
                    member.isActive
                      ? "#15803D"
                      : "#DC2626",
                  fontSize: "9px",
                  fontWeight: 700,
                  "& .MuiChip-label": {
                    px: 0.8,
                  },
                }}
              />
            </Stack>
          </Box>
        </Stack>

        <Divider
          sx={{
            mb: 1.5,
          }}
        />

        {/* =================================================
            MEMBER INFORMATION
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.5,
          }}
        >
          {/* MEMBER NAME */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoItem
              icon={<Person />}
              label="Member Name"
              value={member.name}
            />
          </Grid>

          {/* MEMBER ID */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoItem
              icon={<Badge />}
              label="Member ID"
              value={member.userId}
            />
          </Grid>

          {/* MOBILE */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoItem
              icon={<Phone />}
              label="Mobile"
              value={
                member.mobile || "-"
              }
            />
          </Grid>

          {/* EMAIL */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoItem
              icon={<Email />}
              label="Email"
              value={
                member.email || "-"
              }
            />
          </Grid>

          {/* REFERRAL CODE */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoItem
              icon={<CardGiftcard />}
              label="Referral Code"
              value={
                member.referralCode ||
                "-"
              }
            />
          </Grid>

          {/* JOINING DATE */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoItem
              icon={<CalendarMonth />}
              label="Joining Date"
              value={
                member.createdAt
                  ? new Date(
                      member.createdAt
                    ).toLocaleDateString()
                  : "-"
              }
            />
          </Grid>

          {/* DIRECT MEMBERS */}

          <Grid
            item
            xs={12}
            sm={6}
          >
            <InfoItem
              icon={<Group />}
              label="Direct Members"
              value={
                member.children
                  ?.length || 0
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

/* =========================================================
   INFORMATION ITEM
========================================================= */

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        minWidth: 0,
        p: 1,
        border:
          "1px solid #E5E7EB",
        borderRadius: 0,
        background: "#FFFFFF",
        minHeight: 48,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          minWidth: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#E8F5E9",
          color: "#2E7D32",
          borderRadius: 0,
          "& svg": {
            fontSize: 16,
          },
        }}
      >
        {icon}
      </Box>

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "9px",
            lineHeight: 1.2,
            color: "#6B7280",
            mb: 0.3,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "10px",
              sm: "11px",
            },
            lineHeight: 1.3,
            fontWeight: 700,
            color: "#1F2937",
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default MemberDialog;