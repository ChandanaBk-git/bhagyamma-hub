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

        m: 0,
        p: 0,

        boxSizing: "border-box",

        bgcolor: "#F5F7FA",

        overflowX: "hidden",

        borderRadius: 0,

        "& .MuiCard-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius:
            "0 !important",
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
            sm: "100%",
            md: "1400px",
          },

          minWidth: 0,

          m: {
            xs: 0,
            md: "0 auto",
          },

          p: {
            xs: "8px",
            sm: "12px",
            md: "16px 8px 24px",
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
            m: 0,

            mb: {
              xs: 0.5,
              sm: 0.75,
              md: 1,
            },

            fontSize: {
              xs: "18px",
              sm: "22px",
              md: "26px",
            },

            lineHeight: 1.25,

            fontWeight: 700,

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
            m: 0,

            mb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            fontSize: {
              xs: "9px",
              sm: "11px",
              md: "12px",
            },

            lineHeight: 1.4,

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

            m: 0,

            mb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            border:
              "1px solid #DDE7DE",

            borderLeft:
              "3px solid #2E7D32",

            backgroundColor: "#FFFFFF",

            boxShadow: "none",

            overflow: "hidden",

            boxSizing: "border-box",
          }}
        >
          <CardContent
            sx={{
              width: "100%",

              p: {
                xs: 1.25,
                sm: 1.5,
                md: 1.75,
              },

              boxSizing: "border-box",

              "&:last-child": {
                pb: {
                  xs: 1.25,
                  sm: 1.5,
                  md: 1.75,
                },
              },
            }}
          >
            <Stack
              direction="row"
              spacing={{
                xs: 1,
                sm: 1.25,
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
                    xs: 34,
                    sm: 40,
                    md: 44,
                  },

                  height: {
                    xs: 34,
                    sm: 40,
                    md: 44,
                  },

                  minWidth: {
                    xs: 34,
                    sm: 40,
                    md: 44,
                  },

                  bgcolor: "#E8F5E9",

                  color: "#2E7D32",

                  borderRadius: 0,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  flexShrink: 0,
                }}
              >
                <CardGiftcard
                  sx={{
                    fontSize: {
                      xs: 19,
                      sm: 22,
                      md: 25,
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
                      xs: "13px",
                      sm: "15px",
                      md: "16px",
                    },

                    lineHeight: 1.2,

                    mb: {
                      xs: 0.4,
                      sm: 0.5,
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
                      xs: 21,
                      sm: 23,
                    },

                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                    },

                    fontWeight: 600,
                  }}
                />

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: {
                      xs: 0.5,
                      sm: 0.75,
                    },

                    fontSize: {
                      xs: "9px",
                      sm: "10px",
                      md: "11px",
                    },

                    lineHeight: 1.4,
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
            m: 0,
            p: 0,
            boxSizing: "border-box",
          }}
        >
          <Grid
            container
            sx={{
              width: "100%",
              maxWidth: "100%",

              m: 0,
              p: 0,

              boxSizing: "border-box",

              columnGap: {
                xs: 0,
                md: 1.5,
              },

              rowGap: {
                xs: 1,
                sm: 1.25,
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
                  md: "calc(58.333333% - 6px)",
                },

                maxWidth: "100%",
                minWidth: 0,

                m: 0,
                p: 0,

                boxSizing: "border-box",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: "100%",

                  m: 0,

                  border:
                    "1px solid #DDE7DE",

                  backgroundColor: "#FFFFFF",

                  boxShadow: "none",

                  boxSizing: "border-box",
                }}
              >
                <CardContent
                  sx={{
                    width: "100%",

                    p: {
                      xs: 1.25,
                      sm: 1.5,
                      md: 1.75,
                    },

                    boxSizing: "border-box",

                    "&:last-child": {
                      pb: {
                        xs: 1.25,
                        sm: 1.5,
                        md: 1.75,
                      },
                    },
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "13px",
                        sm: "15px",
                        md: "16px",
                      },

                      lineHeight: 1.25,

                      mb: {
                        xs: 0.75,
                        sm: 1,
                      },
                    }}
                  >
                    What's included
                  </Typography>

                  <Divider
                    sx={{
                      mb: {
                        xs: 0.75,
                        sm: 1,
                      },
                    }}
                  />

                  <Stack
                    spacing={{
                      xs: 0.6,
                      sm: 0.8,
                    }}
                  >
                    {benefits.map((benefit) => (
                      <Stack
                        key={benefit}
                        direction="row"
                        spacing={{
                          xs: 0.6,
                          sm: 0.8,
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
                              xs: 15,
                              sm: 17,
                            },

                            flexShrink: 0,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: {
                              xs: "9px",
                              sm: "11px",
                              md: "12px",
                            },

                            lineHeight: 1.3,

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
                  md: "calc(41.666667% - 6px)",
                },

                maxWidth: "100%",
                minWidth: 0,

                m: 0,
                p: 0,

                boxSizing: "border-box",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: "100%",

                  m: 0,

                  border:
                    "1px solid #DDE7DE",

                  backgroundColor: "#FFFFFF",

                  boxShadow: "none",

                  boxSizing: "border-box",
                }}
              >
                <CardContent
                  sx={{
                    width: "100%",

                    p: {
                      xs: 1.25,
                      sm: 1.5,
                      md: 1.75,
                    },

                    boxSizing: "border-box",

                    "&:last-child": {
                      pb: {
                        xs: 1.25,
                        sm: 1.5,
                        md: 1.75,
                      },
                    },
                  }}
                >
                  <Typography
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "13px",
                        sm: "15px",
                        md: "16px",
                      },

                      lineHeight: 1.25,

                      mb: {
                        xs: 0.75,
                        sm: 1,
                      },
                    }}
                  >
                    Dispatch Details
                  </Typography>

                  <Divider
                    sx={{
                      mb: {
                        xs: 0.75,
                        sm: 1,
                      },
                    }}
                  />

                  <Stack
                    spacing={{
                      xs: 0.75,
                      sm: 1,
                    }}
                  >
                    {/* VERIFICATION */}

                    <Stack
                      direction="row"
                      spacing={{
                        xs: 0.6,
                        sm: 0.8,
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
                            xs: 17,
                            sm: 19,
                          },

                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "9px",
                            sm: "11px",
                            md: "12px",
                          },

                          lineHeight: 1.3,
                        }}
                      >
                        Account verification required
                      </Typography>
                    </Stack>

                    {/* SHIPPING */}

                    <Stack
                      direction="row"
                      spacing={{
                        xs: 0.6,
                        sm: 0.8,
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
                            xs: 17,
                            sm: 19,
                          },

                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: {
                            xs: "9px",
                            sm: "11px",
                            md: "12px",
                          },

                          lineHeight: 1.3,
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
                      mt: {
                        xs: 1,
                        sm: 1.25,
                      },

                      minHeight: {
                        xs: 36,
                        sm: 40,
                      },

                      borderRadius: 0,

                      textTransform: "none",

                      fontWeight: 700,

                      fontSize: {
                        xs: "10px",
                        sm: "11px",
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