import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccountCircle,
  CheckCircle,
  Groups,
  LocalMall,
  PersonAdd,
  ShoppingCart,
  WorkspacePremium,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboard } from "../../services/dashboard.service";

import DashboardHeader from "../../components/members/dashboard/DashboardHeader";
import DashboardStats from "../../components/members/dashboard/DashboardStats";
import SupervisorProgress from "../../components/members/dashboard/SupervisorProgress";
import RecentOrders from "../../components/members/dashboard/RecentOrders";
import RecentCommission from "../../components/members/dashboard/RecentCommission";

/* =========================================================
   GETTING STARTED
   Visible ONLY when Selling Points < 40
========================================================= */

const GettingStarted = ({ member, summary }) => {
  const navigate = useNavigate();

  const sellingPoints = Number(
    member?.sellingPoints ??
      summary?.sellingPoints ??
      0
  );

  /* -------------------------------------------------------
     40 SP OR ABOVE = NORMAL DASHBOARD
  ------------------------------------------------------- */

  if (sellingPoints >= 40) {
    return null;
  }

  /* -------------------------------------------------------
     PROFILE COMPLETION CHECK
  ------------------------------------------------------- */

  const hasEmail = Boolean(member?.email);

  const hasAddress = Boolean(member?.address);

  const hasCity = Boolean(member?.city);

  const hasState = Boolean(member?.state);

  const hasPincode = Boolean(
    member?.pincode
  );

  const profileCompleted =
    hasEmail &&
    hasAddress &&
    hasCity &&
    hasState &&
    hasPincode;

  /* -------------------------------------------------------
     STEPS
  ------------------------------------------------------- */

  const steps = [
    {
      number: 1,

      title: "Account Created",

      description:
        "Your Bhagyamma Hub account has already been created successfully. You can now complete your profile details.",

      completed: true,

      icon: <PersonAdd />,
    },

    {
      number: 2,

      title: "Complete Your Profile",

      description:
        "Go to My Profile → Edit Profile. Add your email, delivery address, city, state and pincode, then save your details.",

      completed: profileCompleted,

      icon: <AccountCircle />,

      action: "profile",
    },

    {
      number: 3,

      title: "Explore Products",

      description:
        "Open Products to view the available products, understand them and place an order whenever you are ready.",

      completed: false,

      icon: <ShoppingCart />,

      action: "products",
    },

    {
      number: 4,

      title: "Build Your Network",

      description:
        "After you understand the business, you can share your own referral code with people you personally refer to Bhagyamma Hub.",

      completed: false,

      icon: <Groups />,
    },
  ];

  /* -------------------------------------------------------
     ACTION HANDLER
  ------------------------------------------------------- */

  const handleAction = (action) => {
    if (action === "profile") {
      navigate("/member/profile");
      return;
    }

    if (action === "products") {
      navigate("/member/products");
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: {
          xs: 2,
          sm: 3,
        },

        borderRadius: {
          xs: 2,
          sm: 3,
        },

        border:
          "1px solid #DDE7DE",

        overflow: "hidden",

        width: "100%",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #2E7D32 0%, #43A047 100%)",

          color: "#fff",

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          py: {
            xs: 2,
            sm: 3,
            md: 3.5,
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
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <WorkspacePremium
                sx={{
                  fontSize: {
                    xs: 22,
                    sm: 28,
                  },
                }}
              />

              <Typography
                fontWeight={800}
                sx={{
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                  },
                }}
              >
                Getting Started
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 1,

                opacity: 0.95,

                lineHeight: 1.6,

                fontSize: {
                  xs: "0.82rem",
                  sm: "0.95rem",
                },

                maxWidth: 750,
              }}
            >
              You are new to Bhagyamma Hub.
              Follow these simple steps to
              understand your account and
              get started.
            </Typography>
          </Box>

          <Chip
            label={`${sellingPoints} SP`}
            sx={{
              backgroundColor: "#fff",

              color: "#2E7D32",

              fontWeight: 800,

              fontSize: {
                xs: 12,
                sm: 14,
              },

              alignSelf: {
                xs: "flex-start",
                sm: "center",
              },
            }}
          />
        </Stack>
      </Box>

      {/* =================================================
          CONTENT
      ================================================= */}

      <CardContent
        sx={{
          px: {
            xs: 1.5,
            sm: 3,
            md: 4,
          },

          py: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* INTRODUCTION */}

        <Box
          sx={{
            mb: 2.5,
          }}
        >
          <Typography
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.1rem",
              },
            }}
          >
            What you need to know
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.7,

              lineHeight: 1.7,

              fontSize: {
                xs: "0.82rem",
                sm: "0.9rem",
              },
            }}
          >
            You currently have{" "}
            <strong>
              {sellingPoints} Selling Points
            </strong>
            . These instructions are shown
            while your SP is below 40 so you
            can understand the platform.
          </Typography>
        </Box>

        {/* =================================================
            STEPS
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1.5,
            sm: 2,
          }}
        >
          {steps.map((step) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={step.number}
            >
              <Box
                sx={{
                  height: "100%",

                  p: {
                    xs: 2,
                    sm: 2.5,
                  },

                  borderRadius: 2,

                  border:
                    "1px solid #E1E8E1",

                  backgroundColor:
                    step.completed
                      ? "#F1F8F2"
                      : "#FAFAFA",

                  display: "flex",

                  flexDirection:
                    "column",

                  boxSizing:
                    "border-box",
                }}
              >
                {/* ICON */}

                <Box
                  sx={{
                    width: {
                      xs: 42,
                      sm: 46,
                    },

                    height: {
                      xs: 42,
                      sm: 46,
                    },

                    borderRadius:
                      "50%",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    backgroundColor:
                      step.completed
                        ? "#2E7D32"
                        : "#E8F5E9",

                    color:
                      step.completed
                        ? "#fff"
                        : "#2E7D32",

                    mb: 1.5,

                    flexShrink: 0,
                  }}
                >
                  {step.completed ? (
                    <CheckCircle
                      sx={{
                        fontSize: {
                          xs: 22,
                          sm: 25,
                        },
                      }}
                    />
                  ) : (
                    step.icon
                  )}
                </Box>

                {/* STEP NUMBER */}

                <Typography
                  variant="caption"
                  fontWeight={800}
                  color="success.main"
                  sx={{
                    fontSize: {
                      xs: "0.68rem",
                      sm: "0.72rem",
                    },
                  }}
                >
                  STEP {step.number}
                </Typography>

                {/* TITLE */}

                <Typography
                  fontWeight={800}
                  sx={{
                    mt: 0.5,

                    fontSize: {
                      xs: "0.95rem",
                      sm: "1rem",
                    },

                    lineHeight: 1.4,
                  }}
                >
                  {step.title}
                </Typography>

                {/* DESCRIPTION */}

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,

                    lineHeight: 1.65,

                    fontSize: {
                      xs: "0.78rem",
                      sm: "0.85rem",
                    },

                    flexGrow: 1,
                  }}
                >
                  {step.description}
                </Typography>

                {/* STATUS / ACTION */}

                <Box
                  sx={{
                    mt: 2,
                  }}
                >
                  {step.completed ? (
                    <Chip
                      label="Completed"
                      size="small"
                      color="success"
                      icon={
                        <CheckCircle />
                      }
                      sx={{
                        fontWeight: 700,

                        fontSize: {
                          xs: 11,
                          sm: 12,
                        },
                      }}
                    />
                  ) : step.action ? (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      fullWidth
                      onClick={() =>
                        handleAction(
                          step.action
                        )
                      }
                      sx={{
                        minHeight: 40,

                        borderRadius: 2,

                        textTransform:
                          "none",

                        fontWeight: 800,

                        fontSize: {
                          xs: "0.78rem",
                          sm: "0.82rem",
                        },
                      }}
                    >
                      {step.action ===
                      "profile"
                        ? "Go to My Profile"
                        : "View Products"}
                    </Button>
                  ) : (
                    <Chip
                      label="Learn More"
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{
                        fontWeight: 700,

                        fontSize: {
                          xs: 11,
                          sm: 12,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* =================================================
            PROFILE REMINDER
        ================================================= */}

        {!profileCompleted && (
          <Box
            sx={{
              mt: 2.5,

              p: {
                xs: 1.8,
                sm: 2,
              },

              borderRadius: 2,

              backgroundColor:
                "#FFF8E1",

              border:
                "1px solid #FFE082",
            }}
          >
            <Typography
              fontWeight={800}
              sx={{
                fontSize: {
                  xs: "0.88rem",
                  sm: "0.95rem",
                },
              }}
            >
              Profile not completed yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,

                lineHeight: 1.6,

                fontSize: {
                  xs: "0.78rem",
                  sm: "0.85rem",
                },
              }}
            >
              Please open{" "}
              <strong>My Profile</strong>,
              select{" "}
              <strong>
                Edit Profile
              </strong>
              , fill in your email and
              complete your delivery address,
              city, state and pincode. Then
              press <strong>Save Changes</strong>.
            </Typography>

            <Button
              variant="contained"
              color="success"
              startIcon={
                <AccountCircle />
              }
              onClick={() =>
                navigate(
                  "/member/profile"
                )
              }
              sx={{
                mt: 1.5,

                minHeight: 42,

                borderRadius: 2,

                textTransform:
                  "none",

                fontWeight: 800,

                fontSize: {
                  xs: "0.78rem",
                  sm: "0.85rem",
                },
              }}
            >
              Complete My Profile
            </Button>
          </Box>
        )}

        {/* =================================================
            SP INFORMATION
        ================================================= */}

        <Box
          sx={{
            mt: 2.5,

            p: {
              xs: 1.8,
              sm: 2,
            },

            borderRadius: 2,

            backgroundColor:
              "#F5F9F5",

            border:
              "1px solid #E1EAE1",
          }}
        >
          <Typography
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "0.88rem",
                sm: "0.95rem",
              },
            }}
          >
            Your Selling Points
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,

              lineHeight: 1.6,

              fontSize: {
                xs: "0.78rem",
                sm: "0.85rem",
              },
            }}
          >
            You currently have{" "}
            <strong>
              {sellingPoints} SP
            </strong>
            . Once you reach{" "}
            <strong>40 SP</strong>, this
            Getting Started section will
            automatically disappear and
            you will continue with your
            normal member dashboard.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};


/* =========================================================
   MAIN DASHBOARD
========================================================= */

const Dashboard = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data =
        await getDashboard();

      console.log(
        "MEMBER DASHBOARD:",
        data
      );

      setDashboard(data);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          px: 2,
        }}
      >
        <CircularProgress
          color="success"
        />
      </Box>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const member =
    dashboard?.member || {};

  const summary =
    dashboard?.summary || {};

  const sellingPoints =
    Number(
      member?.sellingPoints ??
        summary?.sellingPoints ??
        0
    );

  /* =======================================================
     MAIN DASHBOARD
  ======================================================= */

  return (
    <Box
      sx={{
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },

        bgcolor: "#F5F7FA",

        minHeight: "100vh",

        width: "100%",

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",

          maxWidth: 1400,

          mx: "auto",
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <DashboardHeader
          user={
            dashboard?.member
          }
          summary={
            dashboard?.summary
          }
        />

        {/* =================================================
            GETTING STARTED

            ONLY FOR SP BELOW 40
        ================================================= */}

        {sellingPoints < 40 && (
          <GettingStarted
            member={member}
            summary={summary}
          />
        )}

        {/* =================================================
            NORMAL DASHBOARD
        ================================================= */}

        <DashboardStats
          data={dashboard}
        />

        <SupervisorProgress
          summary={
            dashboard?.summary
          }
        />

        <RecentOrders
          orders={
            dashboard?.recentOrders
          }
        />

        <RecentCommission
          commissions={
            dashboard?.recentCommissions
          }
        />
      </Box>
    </Box>
  );
};

export default Dashboard;