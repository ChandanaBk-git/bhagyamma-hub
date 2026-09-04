import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PaymentScannerCard from "../../components/members/dashboard/PaymentScannerCard";

import {
  AccountCircle,
  CheckCircle,
  Groups,
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
   SHOW ONLY WHEN SELLING POINTS < 40
========================================================= */

const GettingStarted = ({
  member,
  summary,
}) => {
  const navigate = useNavigate();

  const sellingPoints = Number(
    member?.sellingPoints ??
      summary?.sellingPoints ??
      0
  );

  /* -------------------------------------------------------
     40 SP OR ABOVE
  ------------------------------------------------------- */

  if (sellingPoints >= 40) {
    return null;
  }

  /* -------------------------------------------------------
     PROFILE CHECK
  ------------------------------------------------------- */

  const hasEmail = Boolean(member?.email);
  const hasAddress = Boolean(member?.address);
  const hasCity = Boolean(member?.city);
  const hasState = Boolean(member?.state);
  const hasPincode = Boolean(member?.pincode);

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
        "Your Bhagyamma Hub account has already been created successfully.",
      completed: true,
      icon: <PersonAdd />,
    },

    {
      number: 2,
      title: "Complete Your Profile",
      description:
        "Complete your email and delivery address details from My Profile.",
      completed: profileCompleted,
      icon: <AccountCircle />,
      action: "profile",
    },

    {
      number: 3,
      title: "Explore Products",
      description:
        "View the available products and place an order whenever you are ready.",
      completed: false,
      icon: <ShoppingCart />,
      action: "products",
    },

    {
      number: 4,
      title: "Build Your Network",
      description:
        "Share your referral code with people you personally refer to Bhagyamma Hub.",
      completed: false,
      icon: <Groups />,
    },
  ];

  /* -------------------------------------------------------
     ACTION
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

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        m: 0,
        mb: 1.25,
        p: 0,
        borderRadius: 0,
        border: "1px solid #E0E0E0",
        boxShadow: "none",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #2E7D32 0%, #43A047 100%)",
          color: "#FFFFFF",
          px: {
            xs: 1.25,
            sm: 1.75,
            md: 2,
          },
          py: {
            xs: 1.1,
            sm: 1.4,
            md: 1.6,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
            >
              <WorkspacePremium
                sx={{
                  fontSize: {
                    xs: 18,
                    sm: 21,
                  },
                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  fontSize: {
                    xs: "14px",
                    sm: "17px",
                  },
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                Getting Started
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 0.35,
                fontSize: {
                  xs: "9px",
                  sm: "11px",
                },
                lineHeight: 1.4,
                opacity: 0.95,
              }}
            >
              Follow these simple steps to get started with Bhagyamma Hub.
            </Typography>
          </Box>

          <Chip
            label={`${sellingPoints} SP`}
            sx={{
              height: {
                xs: 23,
                sm: 26,
              },
              borderRadius: 0,
              backgroundColor: "#FFFFFF",
              color: "#2E7D32",
              fontWeight: 800,
              fontSize: {
                xs: 9,
                sm: 11,
              },
              flexShrink: 0,
            }}
          />
        </Stack>
      </Box>

      {/* CONTENT */}

      <CardContent
        sx={{
          p: {
            xs: 1,
            sm: 1.5,
            md: 1.75,
          },

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.5,
              md: 1.75,
            },
          },
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "12px",
              sm: "14px",
            },
            fontWeight: 800,
            lineHeight: 1.3,
          }}
        >
          What you need to know
        </Typography>

        <Typography
          sx={{
            mt: 0.25,
            color: "text.secondary",
            fontSize: {
              xs: "9px",
              sm: "11px",
            },
            lineHeight: 1.4,
          }}
        >
          You currently have{" "}
          <strong>{sellingPoints} Selling Points</strong>.
        </Typography>

        {/* STEPS */}

        <Grid
          container
          spacing={{
            xs: 0.75,
            sm: 1,
          }}
          sx={{
            mt: 0.25,
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
                    xs: 1,
                    sm: 1.25,
                  },
                  border: "1px solid #E0E0E0",
                  borderRadius: 0,
                  backgroundColor: step.completed
                    ? "#F4FAF4"
                    : "#FFFFFF",
                  boxSizing: "border-box",
                }}
              >
                {/* ICON */}

                <Box
                  sx={{
                    width: {
                      xs: 30,
                      sm: 34,
                    },
                    height: {
                      xs: 30,
                      sm: 34,
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 0,
                    backgroundColor: step.completed
                      ? "#2E7D32"
                      : "#E8F5E9",
                    color: step.completed
                      ? "#FFFFFF"
                      : "#2E7D32",
                    mb: 0.75,
                  }}
                >
                  {step.completed ? (
                    <CheckCircle
                      sx={{
                        fontSize: {
                          xs: 16,
                          sm: 19,
                        },
                      }}
                    />
                  ) : (
                    step.icon
                  )}
                </Box>

                {/* STEP */}

                <Typography
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                    },
                    fontWeight: 800,
                    color: "#2E7D32",
                  }}
                >
                  STEP {step.number}
                </Typography>

                {/* TITLE */}

                <Typography
                  sx={{
                    mt: 0.25,
                    fontSize: {
                      xs: "11px",
                      sm: "13px",
                    },
                    fontWeight: 800,
                    lineHeight: 1.25,
                  }}
                >
                  {step.title}
                </Typography>

                {/* DESCRIPTION */}

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: {
                      xs: "9px",
                      sm: "10px",
                    },
                    color: "text.secondary",
                    lineHeight: 1.4,
                  }}
                >
                  {step.description}
                </Typography>

                {/* ACTION */}

                <Box
                  sx={{
                    mt: 1,
                  }}
                >
                  {step.completed ? (
                    <Chip
                      label="Completed"
                      size="small"
                      color="success"
                      icon={<CheckCircle />}
                      sx={{
                        height: 21,
                        borderRadius: 0,
                        fontSize: 8,
                        fontWeight: 700,
                        "& .MuiChip-icon": {
                          fontSize: 13,
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
                        handleAction(step.action)
                      }
                      sx={{
                        minHeight: 30,
                        borderRadius: 0,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                        },
                        boxShadow: "none",
                      }}
                    >
                      {step.action === "profile"
                        ? "My Profile"
                        : "View Products"}
                    </Button>
                  ) : (
                    <Chip
                      label="Learn More"
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{
                        height: 21,
                        borderRadius: 0,
                        fontSize: 8,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* PROFILE REMINDER */}

        {!profileCompleted && (
          <Box
            sx={{
              mt: 1,
              p: {
                xs: 1,
                sm: 1.25,
              },
              backgroundColor: "#FFF8E1",
              border: "1px solid #FFE082",
              borderRadius: 0,
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "10px",
                  sm: "12px",
                },
                fontWeight: 800,
              }}
            >
              Profile not completed yet
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                },
                color: "text.secondary",
                lineHeight: 1.4,
              }}
            >
              Please complete your email and delivery address from My Profile.
            </Typography>

            <Button
              variant="contained"
              color="success"
              startIcon={<AccountCircle />}
              onClick={() =>
                navigate("/member/profile")
              }
              sx={{
                mt: 0.75,
                minHeight: 30,
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 700,
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                },
                boxShadow: "none",
                "& .MuiButton-startIcon": {
                  marginRight: 0.5,
                },
              }}
            >
              Complete Profile
            </Button>
          </Box>
        )}

        {/* SP INFORMATION */}

        <Box
          sx={{
            mt: 1,
            p: {
              xs: 1,
              sm: 1.25,
            },
            backgroundColor: "#F5F9F5",
            border: "1px solid #E1EAE1",
            borderRadius: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "10px",
                sm: "12px",
              },
              fontWeight: 800,
            }}
          >
            Your Selling Points
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: {
                xs: "9px",
                sm: "10px",
              },
              color: "text.secondary",
              lineHeight: 1.4,
            }}
          >
            You currently have{" "}
            <strong>{sellingPoints} SP</strong>.
            Once you reach <strong>40 SP</strong>,
            this Getting Started section will disappear.
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
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();

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
          width: "100%",
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const member = dashboard?.member || {};
  const summary = dashboard?.summary || {};

  const sellingPoints = Number(
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
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        margin: 0,
        padding: 0,
        backgroundColor: "#F5F7FA",
        minHeight: "100vh",
        boxSizing: "border-box",
        overflowX: "hidden",

        borderRadius: "0 !important",

        /* REMOVE CURVED CARDS */

        "& .MuiCard-root": {
          borderRadius: "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius: "0 !important",
        },

        "& .MuiCardContent-root": {
          borderRadius: "0 !important",
        },

        "& .MuiAlert-root": {
          borderRadius: "0 !important",
        },

        /* BUTTONS / CHIPS */

        "& .MuiButton-root": {
          borderRadius: "0 !important",
        },

        "& .MuiChip-root": {
          borderRadius: "0 !important",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1400px",
          },
          minWidth: 0,
          margin: {
            xs: 0,
            md: "0 auto",
          },
          padding: {
            xs: 0,
            sm: 0,
            md: "0 8px",
          },
          boxSizing: "border-box",
          overflowX: "hidden",

          borderRadius: "0 !important",

          "& .MuiCard-root": {
            borderRadius: "0 !important",
          },

          "& .MuiPaper-root": {
            borderRadius: "0 !important",
          },

          "& > *": {
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            borderRadius: "0 !important",
          },
        }}
      >
        {/* HEADER */}

        <DashboardHeader
          user={dashboard?.member}
          summary={dashboard?.summary}
        />

        {/* GETTING STARTED */}

        {sellingPoints < 40 && (
          <GettingStarted
            member={member}
            summary={summary}
          />
        )}

        {/* DASHBOARD STATS */}

        <DashboardStats
          data={dashboard}
        />

        {/* PAYMENT */}

        <PaymentScannerCard />

        {/* SUPERVISOR */}

        <SupervisorProgress
          summary={dashboard?.summary}
        />

        {/* RECENT ORDERS */}

        <RecentOrders
          orders={dashboard?.recentOrders}
        />

        {/* RECENT COMMISSION */}

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