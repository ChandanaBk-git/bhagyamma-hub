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

const formatCurrency = (value) => {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return "-";
  }

  return `₹${numericValue.toLocaleString("en-IN")}`;
};

const InfoRow = ({
  icon,
  label,
  value,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      py: {
        xs: 0.65,
        sm: 0.8,
      },

      gap: 1,

      borderBottom:
        "1px solid #F1F1F1",

      "&:last-child": {
        borderBottom: "none",
      },
    }}
  >

    <Box
      sx={{
        display: "flex",
        alignItems: "center",

        gap: {
          xs: 0.6,
          sm: 0.8,
        },

        minWidth: 0,
        flex: 1,
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,

          "& .MuiSvgIcon-root": {
            fontSize: {
              xs: 16,
              sm: 18,
            },
          },
        }}
      >
        {icon}
      </Box>


      <Typography
        sx={{
          fontSize: {
            xs: "9px",
            sm: "10px",
          },

          fontWeight: 600,

          color:
            "text.secondary",

          lineHeight: 1.3,

          whiteSpace:
            "nowrap",
        }}
      >
        {label}
      </Typography>

    </Box>


    <Typography
      sx={{
        fontSize: {
          xs: "9px",
          sm: "10px",
        },

        fontWeight: 600,

        textAlign: "right",

        lineHeight: 1.3,

        maxWidth: {
          xs: "55%",
          sm: "60%",
        },

        wordBreak:
          "break-word",
      }}
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
          borderRadius: 0,

          boxShadow: "none",

          border:
            "1px solid #E0E0E0",

          width: {
            xs: "calc(100% - 16px)",
            sm: "calc(100% - 32px)",
          },

          margin: {
            xs: 1,
            sm: 2,
          },

          maxHeight:
            "calc(100vh - 24px)",
        },
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <DialogTitle
        sx={{
          bgcolor: "#2E7D32",

          color: "#fff",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          px: {
            xs: 1.25,
            sm: 1.75,
          },

          py: {
            xs: 0.9,
            sm: 1.1,
          },

          fontSize: {
            xs: "14px",
            sm: "16px",
          },

          fontWeight: 800,
        }}
      >

        Member Details

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#fff",

            width: {
              xs: 28,
              sm: 32,
            },

            height: {
              xs: 28,
              sm: 32,
            },
          }}
        >
          <Close
            sx={{
              fontSize: {
                xs: 18,
                sm: 20,
              },
            }}
          />
        </IconButton>

      </DialogTitle>


      {/* =================================================
          CONTENT
      ================================================= */}

      <DialogContent
        sx={{
          p: {
            xs: 1,
            sm: 1.5,
            md: 2,
          },

          overflowX: "hidden",

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },
          },
        }}
      >

        {/* =================================================
            PROFILE
        ================================================= */}

        <Box
          sx={{
            textAlign: "center",

            mb: {
              xs: 1.25,
              sm: 1.5,
            },
          }}
        >

          <Avatar
            sx={{
              width: {
                xs: 55,
                sm: 65,
              },

              height: {
                xs: 55,
                sm: 65,
              },

              mx: "auto",

              bgcolor: "#2E7D32",
            }}
          >
            <Person
              sx={{
                fontSize: {
                  xs: 30,
                  sm: 36,
                },
              }}
            />
          </Avatar>


          <Typography
            sx={{
              mt: {
                xs: 0.75,
                sm: 1,
              },

              fontSize: {
                xs: "15px",
                sm: "18px",
              },

              fontWeight: 800,

              lineHeight: 1.25,

              wordBreak:
                "break-word",
            }}
          >
            {member.name}
          </Typography>


          <Typography
            sx={{
              mt: 0.25,

              fontSize: {
                xs: "9px",
                sm: "11px",
              },

              color:
                "text.secondary",
            }}
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
            sx={{
              mt: 0.75,

              height: {
                xs: 21,
                sm: 24,
              },

              borderRadius: 0,

              fontSize: {
                xs: "8px",
                sm: "10px",
              },

              fontWeight: 700,
            }}
          />

        </Box>


        {/* =================================================
            INFORMATION GRID
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 0.75,
            sm: 1,
          }}
        >

          {/* =================================================
              PERSONAL
          ================================================= */}

          <Grid item xs={12} md={6}>

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 1,
                  sm: 1.25,
                },

                borderRadius: 0,

                border:
                  "1px solid #E0E0E0",

                boxShadow: "none",

                height: "100%",

                boxSizing:
                  "border-box",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "13px",
                  },

                  fontWeight: 800,

                  mb: 0.75,
                }}
              >
                👤 Personal Information
              </Typography>

              <Divider sx={{ mb: 0.25 }} />

              <InfoRow
                icon={
                  <Person color="success" />
                }
                label="Name"
                value={member.name}
              />

              <InfoRow
                icon={
                  <Badge color="primary" />
                }
                label="User ID"
                value={member.userId}
              />

              <InfoRow
                icon={
                  <Share color="warning" />
                }
                label="Referral Code"
                value={
                  member.referralCode
                }
              />

              <InfoRow
                icon={
                  <Group color="info" />
                }
                label="Role"
                value={member.role}
              />

            </Paper>

          </Grid>


          {/* =================================================
              CONTACT
          ================================================= */}

          <Grid item xs={12} md={6}>

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 1,
                  sm: 1.25,
                },

                borderRadius: 0,

                border:
                  "1px solid #E0E0E0",

                boxShadow: "none",

                height: "100%",

                boxSizing:
                  "border-box",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "13px",
                  },

                  fontWeight: 800,

                  mb: 0.75,
                }}
              >
                📞 Contact Information
              </Typography>

              <Divider sx={{ mb: 0.25 }} />

              <InfoRow
                icon={
                  <Phone color="success" />
                }
                label="Mobile"
                value={member.mobile}
              />

              <InfoRow
                icon={
                  <Email color="error" />
                }
                label="Email"
                value={member.email}
              />

            </Paper>

          </Grid>


          {/* =================================================
              REFERRAL
          ================================================= */}

          <Grid item xs={12} md={6}>

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 1,
                  sm: 1.25,
                },

                borderRadius: 0,

                border:
                  "1px solid #E0E0E0",

                boxShadow: "none",

                height: "100%",

                boxSizing:
                  "border-box",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "13px",
                  },

                  fontWeight: 800,

                  mb: 0.75,
                }}
              >
                👥 Referral Information
              </Typography>

              <Divider sx={{ mb: 0.25 }} />

              <InfoRow
                icon={
                  <Person color="primary" />
                }
                label="Sponsor"
                value={
                  member.sponsorName
                }
              />

              <InfoRow
                icon={
                  <Group color="success" />
                }
                label="Direct Members"
                value={
                  member.children?.length ||
                  0
                }
              />

            </Paper>

          </Grid>


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <Grid item xs={12} md={6}>

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 1,
                  sm: 1.25,
                },

                borderRadius: 0,

                border:
                  "1px solid #E0E0E0",

                boxShadow: "none",

                height: "100%",

                boxSizing:
                  "border-box",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "13px",
                  },

                  fontWeight: 800,

                  mb: 0.75,
                }}
              >
                � Credits
              </Typography>

              <Divider sx={{ mb: 0.25 }} />

              <InfoRow
                icon={
                  <Badge color="success" />
                }
                label="Available Credits"
                value={formatCurrency(
                  member.walletBalance ??
                    member.wallet?.balance ??
                    0
                )}
              />

              <InfoRow
                icon={
                  <CalendarMonth color="warning" />
                }
                label="Total Commission"
                value={formatCurrency(
                  member.totalCommission ??
                    member.wallet?.totalCommission ??
                    0
                )}
              />

            </Paper>

          </Grid>

          {/* =================================================
              ACCOUNT
          ================================================= */}

          <Grid item xs={12} md={6}>

            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 1,
                  sm: 1.25,
                },

                borderRadius: 0,

                border:
                  "1px solid #E0E0E0",

                boxShadow: "none",

                height: "100%",

                boxSizing:
                  "border-box",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "13px",
                  },

                  fontWeight: 800,

                  mb: 0.75,
                }}
              >
                �📅 Account Information
              </Typography>

              <Divider sx={{ mb: 0.25 }} />

              <InfoRow
                icon={
                  <CalendarMonth color="warning" />
                }
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