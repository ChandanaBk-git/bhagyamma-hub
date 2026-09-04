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


const DashboardHeader = ({
  user,
  summary,
}) => {

  const rank =
    summary?.currentRank || "MEMBER";


  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        background:
          "linear-gradient(135deg,#2E7D32,#43A047)",

        color: "#fff",

        overflow: "hidden",

        boxSizing: "border-box",

        boxShadow: "none",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "10px",
            sm: "13px",
            md: "16px",
          },

          "&:last-child": {
            pb: {
              xs: "10px",
              sm: "13px",
              md: "16px",
            },
          },
        }}
      >

        <Stack
          direction="row"
          spacing={{
            xs: 1,
            sm: 1.5,
          }}
          alignItems="center"
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >

          {/* ==========================================
              AVATAR
          ========================================== */}

          <Avatar
            sx={{
              width: {
                xs: 42,
                sm: 50,
                md: 56,
              },

              height: {
                xs: 42,
                sm: 50,
                md: 56,
              },

              bgcolor: "#fff",

              color: "#2E7D32",

              fontSize: {
                xs: 18,
                sm: 22,
                md: 25,
              },

              fontWeight: 700,

              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </Avatar>


          {/* ==========================================
              MEMBER INFORMATION
          ========================================== */}

          <Box
            sx={{
              minWidth: 0,

              flex: 1,

              overflow: "hidden",
            }}
          >

            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "15px",
                  md: "17px",
                },

                lineHeight: 1.2,

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              Welcome, {user?.name || "Member"}
            </Typography>


            <Typography
              sx={{
                mt: "3px",

                opacity: 0.88,

                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.2,

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              Member ID: {user?.userId || "--"}
            </Typography>


            {/* STATUS / RANK */}

            <Box
              sx={{
                mt: {
                  xs: "5px",
                  sm: "6px",
                },

                display: "flex",

                flexWrap: "wrap",

                gap: "4px",

                width: "100%",
              }}
            >

              <Chip
                icon={<WorkspacePremium />}
                label={rank}
                size="small"
                sx={{
                  height: {
                    xs: "20px",
                    sm: "22px",
                  },

                  borderRadius: 0,

                  bgcolor: "#fff",

                  color: "#2E7D32",

                  fontWeight: 700,

                  maxWidth: "110px",

                  fontSize: {
                    xs: "8px",
                    sm: "9px",
                  },

                  "& .MuiChip-icon": {
                    fontSize: {
                      xs: "12px",
                      sm: "14px",
                    },

                    ml: "4px",
                  },

                  "& .MuiChip-label": {
                    px: "5px",

                    overflow: "hidden",

                    textOverflow: "ellipsis",

                    whiteSpace: "nowrap",
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
                sx={{
                  height: {
                    xs: "20px",
                    sm: "22px",
                  },

                  borderRadius: 0,

                  fontSize: {
                    xs: "8px",
                    sm: "9px",
                  },

                  "& .MuiChip-icon": {
                    fontSize: {
                      xs: "12px",
                      sm: "14px",
                    },

                    ml: "4px",
                  },

                  "& .MuiChip-label": {
                    px: "5px",
                  },
                }}
              />

            </Box>

          </Box>


          {/* ==========================================
              WALLET
          ========================================== */}

          <Box
            sx={{
              minWidth: {
                xs: "65px",
                sm: "85px",
                md: "100px",
              },

              flexShrink: 0,

              textAlign: "right",
            }}
          >

            <Typography
              sx={{
                opacity: 0.82,

                fontSize: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },

                lineHeight: 1.2,

                whiteSpace: "nowrap",
              }}
            >
              Wallet Balance
            </Typography>


            <Typography
              fontWeight={700}
              sx={{
                mt: "3px",

                fontSize: {
                  xs: "15px",
                  sm: "18px",
                  md: "21px",
                },

                lineHeight: 1.1,

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",
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