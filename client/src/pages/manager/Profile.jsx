import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Alert,
  Avatar,
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
  Person,
  Phone,
  Email,
  Badge,
  AccountTree,
  Star,
  CalendarMonth,
  Security,
  ArrowBack,
} from "@mui/icons-material";

import {
  getProfile,
} from "../../services/manager.service";


/* =====================================================
   HELPERS
===================================================== */

const formatDate = (
  value
) => {

  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

};


const money = (
  value
) => {

  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;

};


/* =====================================================
   INFORMATION ITEM
===================================================== */

const InfoItem = ({
  icon,
  label,
  value,
}) => {

  return (

    <Box
      sx={{
        display: "flex",

        alignItems: "flex-start",

        gap: 1.2,

        minWidth: 0,
      }}
    >

      <Box
        sx={{
          width: {
            xs: 36,
            sm: 40,
          },

          height: {
            xs: 36,
            sm: 40,
          },

          flexShrink: 0,

          borderRadius: 2,

          bgcolor: "#E8F5E9",

          color: "#2E7D32",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
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
          fontSize={{
            xs: 10,
            sm: 11,
          }}
          color="text.secondary"
        >
          {label}
        </Typography>


        <Typography
          fontSize={{
            xs: 13,
            sm: 14,
          }}
          fontWeight={700}
          sx={{
            mt: 0.2,

            overflowWrap:
              "anywhere",
          }}
        >
          {value || "-"}
        </Typography>

      </Box>

    </Box>

  );

};


/* =====================================================
   STAT CARD
===================================================== */

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
}) => {

  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",

        height: "100%",

        border:
          "1px solid #E5E7EB",

        borderRadius: 3,
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: 1.6,
            sm: 2,
          },

          "&:last-child": {
            pb: {
              xs: 1.6,
              sm: 2,
            },
          },
        }}
      >

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1.2,
          }}
        >

          <Box
            sx={{
              width: {
                xs: 40,
                sm: 46,
              },

              height: {
                xs: 40,
                sm: 46,
              },

              flexShrink: 0,

              borderRadius: 2,

              bgcolor:
                "#E8F5E9",

              color:
                "#2E7D32",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {icon}
          </Box>


          <Box
            sx={{
              minWidth: 0,
            }}
          >

            <Typography
              fontSize={{
                xs: 10,
                sm: 11,
              }}
              color="text.secondary"
            >
              {title}
            </Typography>


            <Typography
              fontSize={{
                xs: 19,
                sm: 23,
              }}
              fontWeight={800}
            >
              {value}
            </Typography>


            {subtitle && (

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                {subtitle}
              </Typography>

            )}

          </Box>

        </Box>

      </CardContent>

    </Card>

  );

};


/* =====================================================
   PAGE
===================================================== */

const Profile = () => {

  const navigate =
    useNavigate();


  const [
    profile,
    setProfile,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  useEffect(
    () => {

      loadProfile();

    },
    []
  );


  const loadProfile =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getProfile();


        const result =
          response?.data ||
          response;


        setProfile(
          result
        );

      } catch (err) {

        console.error(
          "Manager profile error:",
          err
        );


        setError(
          err?.response?.data?.message ||
          "Unable to load manager profile."
        );

      } finally {

        setLoading(false);

      }

    };


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "60vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >

        <CircularProgress
          color="success"
        />

      </Box>

    );

  }


  /* ===================================================
     ERROR
  =================================================== */

  if (error) {

    return (

      <Box
        sx={{
          width: "100%",

          maxWidth: 1200,

          mx: "auto",
        }}
      >

        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>

      </Box>

    );

  }


  if (!profile) {

    return (

      <Alert
        severity="warning"
        sx={{
          borderRadius: 2,
        }}
      >
        Manager profile information is not available.
      </Alert>

    );

  }


  /* ===================================================
     VALUES
  =================================================== */

  const name =
    profile.name ||
    profile.fullName ||
    "Manager";


  const userId =
    profile.userId ||
    profile.memberId ||
    "-";


  const mobile =
    profile.mobile ||
    profile.phone ||
    "-";


  const email =
    profile.email ||
    "-";


  const referralCode =
    profile.referralCode ||
    "-";


  const role =
    profile.role ||
    "MANAGER";


  const isActive =
    profile.isActive !== false;


  const sellingPoints =
    Number(
      profile.sellingPoints || 0
    );


  const lifetimePurchase =
    Number(
      profile.lifetimePurchase || 0
    );


  return (

    <Box
      sx={{
        width: "100%",

        maxWidth: 1400,

        mx: "auto",

        minWidth: 0,

        overflowX: "hidden",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          justifyContent:
            "space-between",

          gap: 1.5,

          mb: 2,
        }}
      >

        <Box
          sx={{
            minWidth: 0,
          }}
        >

          <Typography
            sx={{
              fontSize: {
                xs: 22,
                sm: 27,
                md: 30,
              },

              fontWeight: 800,
            }}
          >
            Manager Profile
          </Typography>


          <Typography
            sx={{
              mt: 0.4,

              fontSize: {
                xs: 12,
                sm: 13,
              },

              color:
                "text.secondary",
            }}
          >
            View your manager account information.
          </Typography>

        </Box>


        <Button
          variant="outlined"
          color="success"
          startIcon={
            <ArrowBack />
          }
          onClick={() =>
            navigate(
              "/manager/dashboard"
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },

            minHeight: 42,

            borderRadius: 2,
          }}
        >
          Dashboard
        </Button>

      </Box>


      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border:
            "1px solid #E5E7EB",

          borderRadius: 3,

          mb: 2,
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 1.7,
              sm: 2.5,
            },

            "&:last-child": {
              pb: {
                xs: 1.7,
                sm: 2.5,
              },
            },
          }}
        >

          <Box
            sx={{
              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "center",
                sm: "center",
              },

              textAlign: {
                xs: "center",
                sm: "left",
              },

              gap: 1.8,
            }}
          >

            <Avatar
              sx={{
                width: {
                  xs: 76,
                  sm: 92,
                },

                height: {
                  xs: 76,
                  sm: 92,
                },

                bgcolor:
                  "#C8E6C9",

                color:
                  "#2E7D32",

                fontSize: {
                  xs: 30,
                  sm: 38,
                },

                fontWeight: 800,
              }}
            >

              {name
                .charAt(0)
                .toUpperCase()}

            </Avatar>


            <Box
              sx={{
                minWidth: 0,

                flex: 1,
              }}
            >

              <Typography
                fontSize={{
                  xs: 21,
                  sm: 25,
                }}
                fontWeight={800}
                sx={{
                  overflowWrap:
                    "anywhere",
                }}
              >
                {name}
              </Typography>


              <Typography
                fontSize={{
                  xs: 12,
                  sm: 13,
                }}
                color="text.secondary"
              >
                {userId}
              </Typography>


              <Stack
                direction="row"
                spacing={0.8}
                justifyContent={{
                  xs: "center",
                  sm: "flex-start",
                }}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  mt: 1,
                }}
              >

                <Chip
                  size="small"
                  label={role}
                  color="success"
                  variant="outlined"
                />


                <Chip
                  size="small"
                  label={
                    isActive
                      ? "Active"
                      : "Inactive"
                  }
                  color={
                    isActive
                      ? "success"
                      : "default"
                  }
                />

              </Stack>

            </Box>

          </Box>

        </CardContent>

      </Card>


      {/* =================================================
          STATS
      ================================================= */}

      <Grid
        container
        spacing={{
          xs: 1.3,
          sm: 2,
        }}
        sx={{
          mb: 2,
        }}
      >

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            icon={
              <Person />
            }
            title="Account Role"
            value={role}
            subtitle="Authorized manager"
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            icon={
              <Star />
            }
            title="Selling Points"
            value={
              sellingPoints.toLocaleString(
                "en-IN"
              )
            }
            subtitle="Personal points"
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            icon={
              <Badge />
            }
            title="Lifetime Purchase"
            value={money(
              lifetimePurchase
            )}
            subtitle="Recorded purchase value"
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          md={3}
        >

          <StatCard
            icon={
              <Security />
            }
            title="Account Status"
            value={
              isActive
                ? "Active"
                : "Inactive"
            }
            subtitle="Current account state"
          />

        </Grid>

      </Grid>


      {/* =================================================
          INFORMATION
      ================================================= */}

      <Grid
        container
        spacing={2}
      >

        {/* CONTACT */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            elevation={0}
            sx={{
              height: "100%",

              border:
                "1px solid #E5E7EB",

              borderRadius: 3,
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 1.7,
                  sm: 2.5,
                },
              }}
            >

              <Typography
                fontWeight={800}
                fontSize={{
                  xs: 16,
                  sm: 18,
                }}
              >
                Contact Information
              </Typography>


              <Typography
                fontSize={11}
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  mb: 2,
                }}
              >
                Registered manager contact details.
              </Typography>


              <Stack
                spacing={2}
              >

                <InfoItem
                  icon={
                    <Person
                      fontSize="small"
                    />
                  }
                  label="Full Name"
                  value={name}
                />


                <InfoItem
                  icon={
                    <Phone
                      fontSize="small"
                    />
                  }
                  label="Mobile Number"
                  value={mobile}
                />


                <InfoItem
                  icon={
                    <Email
                      fontSize="small"
                    />
                  }
                  label="Email Address"
                  value={email}
                />

              </Stack>

            </CardContent>

          </Card>

        </Grid>


        {/* ACCOUNT */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Card
            elevation={0}
            sx={{
              height: "100%",

              border:
                "1px solid #E5E7EB",

              borderRadius: 3,
            }}
          >

            <CardContent
              sx={{
                p: {
                  xs: 1.7,
                  sm: 2.5,
                },
              }}
            >

              <Typography
                fontWeight={800}
                fontSize={{
                  xs: 16,
                  sm: 18,
                }}
              >
                Account Information
              </Typography>


              <Typography
                fontSize={11}
                color="text.secondary"
                sx={{
                  mt: 0.4,
                  mb: 2,
                }}
              >
                Read-only account information.
              </Typography>


              <Stack
                spacing={2}
              >

                <InfoItem
                  icon={
                    <Badge
                      fontSize="small"
                    />
                  }
                  label="Manager ID"
                  value={userId}
                />


                <InfoItem
                  icon={
                    <AccountTree
                      fontSize="small"
                    />
                  }
                  label="Referral Code"
                  value={referralCode}
                />


                <InfoItem
                  icon={
                    <CalendarMonth
                      fontSize="small"
                    />
                  }
                  label="Joined On"
                  value={
                    formatDate(
                      profile.createdAt
                    )
                  }
                />

              </Stack>

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =================================================
          READ ONLY NOTICE
      ================================================= */}

      <Alert
        severity="info"
        sx={{
          mt: 2,

          borderRadius: 2,

          fontSize: {
            xs: 11,
            sm: 13,
          },
        }}
      >
        Manager profile access is read-only.
        Personal account information cannot be edited
        from the manager panel.
      </Alert>

    </Box>

  );

};


export default Profile;