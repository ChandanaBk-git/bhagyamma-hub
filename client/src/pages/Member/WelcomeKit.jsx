import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  CardGiftcard,
  CheckCircle,
  LocalShipping,
  VerifiedUser,
} from "@mui/icons-material";

const WelcomeKit = () => {
  const benefits = [
    "Membership activation",
    "Exclusive product access",
    "Support from the Bhagyamma team",
    "Priority updates for new launches",
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        minHeight: "100vh",

        margin: 0,
        padding: 0,

        boxSizing: "border-box",

        bgcolor: "#F5F7FA",

        overflowX: "hidden",

        "& .MuiCard-root": {
          borderRadius: "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius: "0 !important",
        },
      }}
    >
      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: {
            xs: "100%",
            md: "1400px",
          },

          margin: {
            xs: 0,
            md: "0 auto",
          },

          padding: {
            xs: "8px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing: "border-box",

          overflowX: "hidden",
        }}
      >
        {/* =================================================
            TITLE
        ================================================= */}

        <Typography
          component="h1"
          sx={{
            margin: 0,

            marginBottom: {
              xs: "5px",
              sm: "7px",
              md: "8px",
            },

            fontSize: {
              xs: "20px",
              sm: "25px",
              md: "30px",
            },

            lineHeight: {
              xs: "25px",
              sm: "31px",
              md: "36px",
            },

            fontWeight: 800,

            color: "#292929",
          }}
        >
          Welcome Kit
        </Typography>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <Typography
          color="text.secondary"
          sx={{
            margin: 0,

            marginBottom: {
              xs: "12px",
              sm: "16px",
              md: "20px",
            },

            fontSize: {
              xs: "11px",
              sm: "13px",
              md: "14px",
            },

            lineHeight: 1.45,

            maxWidth: "850px",
          }}
        >
          Your welcome kit includes the essentials to start
          your journey with Bhagyamma Hub.
        </Typography>

        {/* =================================================
            WELCOME KIT STATUS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "100%",

            margin: 0,

            marginBottom: {
              xs: "12px",
              sm: "16px",
              md: "20px",
            },

            border: "1px solid #E5E5E5",

            borderLeft: "3px solid #2E7D32",

            backgroundColor: "#FFFFFF",

            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",

            overflow: "hidden",

            boxSizing: "border-box",
          }}
        >
          <CardContent
            sx={{
              width: "100%",

              padding: {
                xs: "12px",
                sm: "16px",
                md: "20px",
              },

              boxSizing: "border-box",

              "&:last-child": {
                paddingBottom: {
                  xs: "12px",
                  sm: "16px",
                  md: "20px",
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
              {/* ICON */}

              <Box
                sx={{
                  width: {
                    xs: 44,
                    sm: 52,
                    md: 58,
                  },

                  height: {
                    xs: 44,
                    sm: 52,
                    md: 58,
                  },

                  minWidth: {
                    xs: 44,
                    sm: 52,
                    md: 58,
                  },

                  bgcolor: "#E8F5E9",

                  color: "#2E7D32",

                  borderRadius: "50%",

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  flexShrink: 0,
                }}
              >
                <CardGiftcard
                  sx={{
                    fontSize: {
                      xs: 24,
                      sm: 29,
                      md: 32,
                    },
                  }}
                />
              </Box>

              {/* CONTENT */}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "15px",
                      sm: "17px",
                      md: "19px",
                    },

                    lineHeight: 1.2,

                    marginBottom: {
                      xs: "5px",
                      sm: "7px",
                    },
                  }}
                >
                  Welcome Kit Status
                </Typography>

                <Chip
                  size="small"
                  label="Pending Verification"
                  color="warning"
                  sx={{
                    height: {
                      xs: 23,
                      sm: 26,
                    },

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                    },

                    fontWeight: 600,
                  }}
                />

                <Typography
                  color="text.secondary"
                  sx={{
                    marginTop: {
                      xs: "6px",
                      sm: "8px",
                    },

                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                      md: "13px",
                    },

                    lineHeight: 1.45,
                  }}
                >
                  Our team will verify your account and
                  process the welcome kit dispatch once
                  your payment and documents are completed.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* =================================================
            DETAILS
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            margin: 0,
            padding: 0,
            boxSizing: "border-box",
          }}
        >
          <Grid
            container
            sx={{
              width: "100%",
              maxWidth: "100%",
              margin: 0,
              padding: 0,

              boxSizing: "border-box",

              columnGap: {
                xs: 0,
                md: 2.5,
              },

              rowGap: {
                xs: 1.5,
                sm: 2,
                md: 0,
              },
            }}
          >
            {/* =================================================
                WHAT'S INCLUDED
            ================================================= */}

            <Grid
              item
              xs={12}
              md={7}
              sx={{
                width: {
                  xs: "100%",
                  md: "calc(58.333333% - 10px)",
                },

                maxWidth: "100%",

                minWidth: 0,

                margin: 0,
                padding: 0,

                boxSizing: "border-box",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: "100%",

                  margin: 0,

                  border: "1px solid #E5E5E5",

                  backgroundColor: "#FFFFFF",

                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.06)",

                  boxSizing: "border-box",
                }}
              >
                <CardContent
                  sx={{
                    width: "100%",

                    padding: {
                      xs: "12px",
                      sm: "16px",
                      md: "20px",
                    },

                    boxSizing: "border-box",

                    "&:last-child": {
                      paddingBottom: {
                        xs: "12px",
                        sm: "16px",
                        md: "20px",
                      },
                    },
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "15px",
                        sm: "17px",
                        md: "19px",
                      },

                      lineHeight: 1.25,

                      marginBottom: {
                        xs: "8px",
                        sm: "10px",
                      },
                    }}
                  >
                    What's included
                  </Typography>

                  <Divider
                    sx={{
                      marginBottom: {
                        xs: "9px",
                        sm: "12px",
                      },
                    }}
                  />

                  <Stack
                    spacing={{
                      xs: 0.8,
                      sm: 1,
                    }}
                  >
                    {benefits.map((benefit) => (
                      <Stack
                        key={benefit}
                        direction="row"
                        spacing={{
                          xs: 0.8,
                          sm: 1,
                        }}
                        alignItems="center"
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <CheckCircle
                          color="success"
                          sx={{
                            fontSize: {
                              xs: 17,
                              sm: 19,
                            },

                            flexShrink: 0,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: {
                              xs: "11px",
                              sm: "13px",
                              md: "14px",
                            },

                            lineHeight: 1.35,

                            minWidth: 0,
                          }}
                        >
                          {benefit}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* =================================================
                DISPATCH DETAILS
            ================================================= */}

            <Grid
              item
              xs={12}
              md={5}
              sx={{
                width: {
                  xs: "100%",
                  md: "calc(41.666667% - 10px)",
                },

                maxWidth: "100%",

                minWidth: 0,

                margin: 0,
                padding: 0,

                boxSizing: "border-box",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: "100%",

                  margin: 0,

                  border: "1px solid #E5E5E5",

                  backgroundColor: "#FFFFFF",

                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.06)",

                  boxSizing: "border-box",
                }}
              >
                <CardContent
                  sx={{
                    width: "100%",

                    padding: {
                      xs: "12px",
                      sm: "16px",
                      md: "20px",
                    },

                    boxSizing: "border-box",

                    "&:last-child": {
                      paddingBottom: {
                        xs: "12px",
                        sm: "16px",
                        md: "20px",
                      },
                    },
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "15px",
                        sm: "17px",
                        md: "19px",
                      },

                      lineHeight: 1.25,

                      marginBottom: {
                        xs: "8px",
                        sm: "10px",
                      },
                    }}
                  >
                    Dispatch Details
                  </Typography>

                  <Divider
                    sx={{
                      marginBottom: {
                        xs: "9px",
                        sm: "12px",
                      },
                    }}
                  />

                  <Stack
                    spacing={{
                      xs: 1,
                      sm: 1.25,
                    }}
                  >
                    {/* VERIFICATION */}

                    <Stack
                      direction="row"
                      spacing={{
                        xs: 0.8,
                        sm: 1,
                      }}
                      alignItems="center"
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <VerifiedUser
                        color="success"
                        sx={{
                          fontSize: {
                            xs: 19,
                            sm: 21,
                          },

                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "13px",
                            md: "14px",
                          },

                          lineHeight: 1.35,
                        }}
                      >
                        Account verification required
                      </Typography>
                    </Stack>

                    {/* SHIPPING */}

                    <Stack
                      direction="row"
                      spacing={{
                        xs: 0.8,
                        sm: 1,
                      }}
                      alignItems="center"
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <LocalShipping
                        color="success"
                        sx={{
                          fontSize: {
                            xs: 19,
                            sm: 21,
                          },

                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "11px",
                            sm: "13px",
                            md: "14px",
                          },

                          lineHeight: 1.35,
                        }}
                      >
                        Dispatch begins after approval
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* BUTTON */}

                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    href="/member/profile"
                    sx={{
                      marginTop: {
                        xs: "12px",
                        sm: "16px",
                      },

                      minHeight: {
                        xs: 40,
                        sm: 44,
                      },

                      borderRadius: "5px",

                      textTransform: "none",

                      fontWeight: 700,

                      fontSize: {
                        xs: "12px",
                        sm: "13px",
                      },
                    }}
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomeKit;