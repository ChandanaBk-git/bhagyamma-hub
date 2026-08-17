import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import {
  WorkspacePremium,
  Badge,
} from "@mui/icons-material";

const DashboardHeader = ({ user, summary }) => {
  const rank = summary?.currentRank || "MEMBER";

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        mb: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
        borderRadius: {
          xs: 2.5,
          sm: 3,
          md: 4,
        },
        background:
          "linear-gradient(135deg,#2E7D32,#43A047)",
        color: "#fff",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 4,
          },
          "&:last-child": {
            pb: {
              xs: 2,
              sm: 2.5,
              md: 4,
            },
          },
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={{
            xs: 1.5,
            sm: 2,
          }}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* AVATAR */}
          <Avatar
            sx={{
              width: {
                xs: 58,
                sm: 68,
                md: 75,
              },
              height: {
                xs: 58,
                sm: 68,
                md: 75,
              },
              bgcolor: "#fff",
              color: "#2E7D32",
              fontSize: {
                xs: 25,
                sm: 29,
                md: 32,
              },
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </Avatar>

          {/* MEMBER INFORMATION */}
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "1.15rem",
                  sm: "1.35rem",
                  md: "1.5rem",
                },
                lineHeight: 1.3,
                overflowWrap: "anywhere",
              }}
            >
              Welcome, {user?.name || "Member"}
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                opacity: 0.9,
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.9rem",
                },
                overflowWrap: "anywhere",
              }}
            >
              Member ID: {user?.userId || "--"}
            </Typography>

            <Box
              sx={{
                mt: 1.5,
                display: "flex",
                flexWrap: "wrap",
                gap: 0.8,
                width: "100%",
              }}
            >
              <Chip
                icon={<WorkspacePremium />}
                label={rank}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  color: "#2E7D32",
                  fontWeight: 800,
                  maxWidth: "100%",

                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />

              <Chip
                icon={<Badge />}
                label={
                  user?.isActive
                    ? "Active"
                    : "Inactive"
                }
                size="small"
                color={
                  user?.isActive
                    ? "success"
                    : "error"
                }
              />
            </Box>
          </Box>

          {/* WALLET */}
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: 0,
              textAlign: {
                xs: "left",
                sm: "right",
              },
              flexShrink: 0,
              pt: {
                xs: 0.5,
                sm: 0,
              },
              borderTop: {
                xs: "1px solid rgba(255,255,255,0.18)",
                sm: "none",
              },
              mt: {
                xs: 0.5,
                sm: 0,
              },
            }}
          >
            <Typography
              sx={{
                opacity: 0.85,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.82rem",
                },
              }}
            >
              Wallet Balance
            </Typography>

            <Typography
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "1.45rem",
                  sm: "1.8rem",
                  md: "2rem",
                },
                lineHeight: 1.2,
                overflowWrap: "anywhere",
              }}
            >
              ₹{summary?.walletBalance || 0}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;