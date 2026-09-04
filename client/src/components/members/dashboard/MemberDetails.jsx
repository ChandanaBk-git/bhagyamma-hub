import {
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Box,
  Avatar,
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


const MemberDetails = ({ user = {} }) => {

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        backgroundColor: "#FFFFFF",

        boxShadow: "none",

        overflow: "hidden",

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        boxSizing: "border-box",
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

        {/* ==========================================
            HEADER
        ========================================== */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: {
              xs: "8px",
              sm: "10px",
              md: "12px",
            },

            mb: {
              xs: "10px",
              sm: "13px",
              md: "16px",
            },

            minWidth: 0,
          }}
        >

          {/* AVATAR */}

          <Avatar
            sx={{
              width: {
                xs: 40,
                sm: 46,
                md: 52,
              },

              height: {
                xs: 40,
                sm: 46,
                md: 52,
              },

              bgcolor: "#2E7D32",

              fontSize: {
                xs: 17,
                sm: 20,
                md: 23,
              },

              fontWeight: 700,

              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </Avatar>


          {/* MEMBER NAME */}

          <Box
            sx={{
              flex: 1,

              minWidth: 0,

              overflow: "hidden",
            }}
          >

            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                  md: "18px",
                },

                lineHeight: 1.2,

                color: "#292929",

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "-"}
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                mt: "2px",

                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.2,

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",
              }}
            >
              {user?.userId || "-"}
            </Typography>

          </Box>


          {/* STATUS */}

          <Chip
            label={
              user?.isActive
                ? "Active"
                : "Inactive"
            }
            color={
              user?.isActive
                ? "success"
                : "error"
            }
            size="small"
            sx={{
              height: {
                xs: "21px",
                sm: "23px",
              },

              borderRadius: 0,

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 600,

              flexShrink: 0,

              "& .MuiChip-label": {
                px: {
                  xs: "6px",
                  sm: "7px",
                },
              },
            }}
          />

        </Box>


        {/* ==========================================
            MEMBER INFORMATION
        ========================================== */}

        <Grid
          container
          spacing={{
            xs: 0.75,
            sm: 1,
            md: 1.5,
          }}
        >

          {/* MOBILE */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                boxSizing: "border-box",

                height: "100%",
              }}
            >

              <Phone
                sx={{
                  color: "#2E7D32",

                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Mobile
                </Typography>

                <Typography
                  fontWeight={500}
                  sx={{
                    mt: "2px",

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.mobile || "-"}
                </Typography>

              </Box>

            </Box>

          </Grid>


          {/* EMAIL */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                height: "100%",

                boxSizing: "border-box",
              }}
            >

              <Email
                sx={{
                  color: "#2E7D32",

                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Email
                </Typography>

                <Typography
                  fontWeight={500}
                  sx={{
                    mt: "2px",

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.email || "-"}
                </Typography>

              </Box>

            </Box>

          </Grid>


          {/* MEMBER ID */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                height: "100%",

                boxSizing: "border-box",
              }}
            >

              <Badge
                color="success"
                sx={{
                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Member ID
                </Typography>

                <Typography
                  fontWeight={500}
                  sx={{
                    mt: "2px",

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.userId || "-"}
                </Typography>

              </Box>

            </Box>

          </Grid>


          {/* REFERRAL CODE */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                height: "100%",

                boxSizing: "border-box",
              }}
            >

              <CardGiftcard
                color="success"
                sx={{
                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Referral Code
                </Typography>

                <Typography
                  fontWeight={500}
                  sx={{
                    mt: "2px",

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.referralCode || "-"}
                </Typography>

              </Box>

            </Box>

          </Grid>


          {/* SPONSOR */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "flex-start",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                height: "100%",

                boxSizing: "border-box",
              }}
            >

              <Group
                color="success"
                sx={{
                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Sponsor
                </Typography>

                <Typography
                  fontWeight={500}
                  sx={{
                    mt: "2px",

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.sponsorId?.name || "--"}
                </Typography>

                <Typography
                  sx={{
                    mt: "2px",

                    color: "#888",

                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.sponsorId?.userId || ""}
                </Typography>

              </Box>

            </Box>

          </Grid>


          {/* JOINING DATE */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                height: "100%",

                boxSizing: "border-box",
              }}
            >

              <CalendarMonth
                color="success"
                sx={{
                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Joining Date
                </Typography>

                <Typography
                  fontWeight={500}
                  sx={{
                    mt: "2px",

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.createdAt
                    ? new Date(
                        user.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </Typography>

              </Box>

            </Box>

          </Grid>


          {/* PAYMENT STATUS */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                height: "100%",

                boxSizing: "border-box",
              }}
            >

              <Badge
                color="success"
                sx={{
                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,

                    mb: "3px",
                  }}
                >
                  Payment Status
                </Typography>

                <Chip
                  size="small"
                  label={
                    user?.paymentStatus ||
                    "Pending"
                  }
                  color={
                    user?.paymentStatus ===
                    "Paid"
                      ? "success"
                      : "warning"
                  }
                  sx={{
                    height: {
                      xs: "19px",
                      sm: "21px",
                    },

                    borderRadius: 0,

                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                    },

                    "& .MuiChip-label": {
                      px: "5px",
                    },
                  }}
                />

              </Box>

            </Box>

          </Grid>


          {/* ROLE */}

          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 6,
            }}
          >

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: {
                  xs: "6px",
                  sm: "8px",
                },

                minWidth: 0,

                p: {
                  xs: "7px",
                  sm: "9px",
                  md: "10px",
                },

                border: "1px solid #E8E8E8",

                height: "100%",

                boxSizing: "border-box",
              }}
            >

              <Person
                color="success"
                sx={{
                  fontSize: {
                    xs: 17,
                    sm: 19,
                    md: 21,
                  },

                  flexShrink: 0,
                }}
              />

              <Box
                sx={{
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Role
                </Typography>

                <Typography
                  fontWeight={500}
                  sx={{
                    mt: "2px",

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.role || "MEMBER"}
                </Typography>

              </Box>

            </Box>

          </Grid>

        </Grid>

      </CardContent>

    </Card>
  );
};


export default MemberDetails;