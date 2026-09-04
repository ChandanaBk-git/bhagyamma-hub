import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

import {
  getMembers,
} from "../../services/manager.service";


/* =====================================================
   MEMBER CARD
===================================================== */

const MemberCard = ({
  member,
  onView,
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        border:
          "1px solid #D9DEE3",

        borderRadius:
          "0 !important",

        backgroundColor:
          "#FFFFFF",

        boxShadow:
          "0 2px 7px rgba(0,0,0,0.04)",

        overflow:
          "hidden",

        boxSizing:
          "border-box",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: 1.4,
            sm: 1.7,
          },

          "&:last-child": {
            pb: {
              xs: 1.4,
              sm: 1.7,
            },
          },
        }}
      >

        {/* =================================================
            MEMBER HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: 1,

            minWidth: 0,
          }}
        >

          {/* LEFT SIDE */}

          <Box
            sx={{
              display: "flex",

              alignItems:
                "center",

              gap: 1,

              minWidth: 0,

              flex: 1,
            }}
          >

            {/* AVATAR */}

            <Avatar
              sx={{
                width: 40,
                height: 40,

                minWidth: 40,

                bgcolor:
                  "#E8F5E9",

                color:
                  "#2E7D32",

                fontSize: 15,

                fontWeight: 800,
              }}
            >
              {(
                member.name ||
                "M"
              )
                .charAt(0)
                .toUpperCase()}
            </Avatar>


            {/* MEMBER DETAILS */}

            <Box
              sx={{
                minWidth: 0,

                flex: 1,
              }}
            >

              {/* NAME */}

              <Typography
                fontWeight={700}
                sx={{
                  fontSize: {
                    xs: 12.5,
                    sm: 13.5,
                  },

                  lineHeight:
                    1.25,

                  color:
                    "#252525",

                  overflowWrap:
                    "anywhere",
                }}
              >
                {member.name || "-"}
              </Typography>


              {/* USER ID */}

              <Typography
                sx={{
                  mt: 0.2,

                  fontSize: {
                    xs: 9.5,
                    sm: 10.5,
                  },

                  color:
                    "#757575",

                  lineHeight:
                    1.3,
                }}
              >
                {member.userId || "-"}
              </Typography>


              {/* MOBILE */}

              <Typography
                sx={{
                  fontSize: {
                    xs: 9.5,
                    sm: 10.5,
                  },

                  color:
                    "#757575",

                  lineHeight:
                    1.3,
                }}
              >
                {member.mobile || "-"}
              </Typography>

            </Box>

          </Box>


          {/* ACTIVE STATUS */}

          <Box
            sx={{
              flexShrink: 0,

              border:
                "1px solid #A5D6A7",

              color:
                "#2E7D32",

              backgroundColor:
                "#FFFFFF",

              px: 0.9,

              py: 0.35,

              fontSize: 9.5,

              fontWeight: 700,

              whiteSpace:
                "nowrap",
            }}
          >
            {member.isActive
              ? "Active"
              : "Inactive"}
          </Box>

        </Box>


        {/* =================================================
            PAYMENT STATUS
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            gap: 0.7,

            mt: 1,

            mb: 1,
          }}
        >

          <Box
            sx={{
              border:
                "1px solid #FFB74D",

              color:
                "#EF6C00",

              px: 0.9,

              py: 0.35,

              fontSize: 9.5,

              backgroundColor:
                "#FFFFFF",
            }}
          >
            {member.paymentStatus ||
              "Pending"}
          </Box>


          <Box
            sx={{
              border:
                "1px solid #A5D6A7",

              color:
                "#2E7D32",

              px: 0.9,

              py: 0.35,

              fontSize: 9.5,

              backgroundColor:
                "#FFFFFF",
            }}
          >
            Paid
          </Box>

        </Box>


        {/* =================================================
            VIEW DETAILS
        ================================================= */}

        <Button
          fullWidth
          variant="contained"
          color="success"
          startIcon={
            <VisibilityIcon
              sx={{
                fontSize:
                  "18px !important",
              }}
            />
          }
          onClick={onView}
          sx={{
            mt: 0.5,

            minHeight: 38,

            height: 38,

            borderRadius:
              "0 !important",

            textTransform:
              "none",

            fontSize: {
              xs: 12,
              sm: 13,
            },

            fontWeight: 700,

            boxShadow:
              "none",

            "&:hover": {
              boxShadow:
                "none",
            },
          }}
        >
          View Details
        </Button>

      </CardContent>

    </Card>
  );
};


/* =====================================================
   SUMMARY CARD
===================================================== */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "#2E7D32",
}) => {

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",

        height: "100%",

        border:
          "1px solid #D9DEE3",

        borderRadius:
          "0 !important",

        backgroundColor:
          "#FFFFFF",

        boxShadow:
          "0 2px 7px rgba(0,0,0,0.04)",
      }}
    >

      <CardContent
        sx={{
          p: 1.4,

          "&:last-child": {
            pb: 1.4,
          },
        }}
      >

        <Box
          sx={{
            display: "flex",

            alignItems:
              "center",

            gap: 1,
          }}
        >

          <Box
            sx={{
              width: 40,

              height: 40,

              minWidth: 40,

              borderRadius:
                "50%",

              bgcolor:
                `${color}12`,

              color,

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",
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
              sx={{
                fontSize: 10.5,

                color:
                  "#6B7280",

                lineHeight:
                  1.2,
              }}
            >
              {title}
            </Typography>


            <Typography
              sx={{
                fontSize: 20,

                fontWeight: 800,

                lineHeight:
                  1.2,

                mt: 0.2,
              }}
            >
              {value}
            </Typography>


            {subtitle && (
              <Typography
                sx={{
                  fontSize: 9.5,

                  color:
                    "#757575",

                  mt: 0.2,
                }}
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
   MEMBERS PAGE
===================================================== */

const Members = () => {

  const navigate =
    useNavigate();


  const [
    members,
    setMembers,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    status,
    setStatus,
  ] = useState("ALL");


  /* ===================================================
     LOAD MEMBERS
  =================================================== */

  useEffect(() => {

    loadMembers();

  }, []);


  const loadMembers =
    async () => {

      try {

        setLoading(true);

        setError("");

        const response =
          await getMembers();

        console.log(
          "MEMBERS RESPONSE:",
          response
        );


        let result = [];


        if (
          Array.isArray(response)
        ) {

          result =
            response;

        }

        else if (
          Array.isArray(
            response?.data
          )
        ) {

          result =
            response.data;

        }

        else if (
          Array.isArray(
            response?.data?.members
          )
        ) {

          result =
            response.data.members;

        }

        else if (
          Array.isArray(
            response?.members
          )
        ) {

          result =
            response.members;

        }


        setMembers(
          result
        );


      } catch (err) {

        console.error(
          "MEMBERS LOAD ERROR:",
          err
        );

        setError(
          err?.response?.data?.message ||
          "Unable to load members."
        );

      } finally {

        setLoading(false);

      }

    };


  /* ===================================================
     FILTER MEMBERS
  =================================================== */

  const filteredMembers =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();


      return members.filter(
        (member) => {

          const matchesSearch =
            !value ||

            String(
              member.name || ""
            )
              .toLowerCase()
              .includes(value) ||

            String(
              member.userId || ""
            )
              .toLowerCase()
              .includes(value) ||

            String(
              member.mobile || ""
            )
              .toLowerCase()
              .includes(value);


          let matchesStatus =
            true;


          if (
            status ===
            "ACTIVE"
          ) {

            matchesStatus =
              member.isActive === true;

          }


          if (
            status ===
            "INACTIVE"
          ) {

            matchesStatus =
              member.isActive !== true;

          }


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      members,
      search,
      status,
    ]);


  /* ===================================================
     COUNTS
  =================================================== */

  const totalMembers =
    members.length;


  const activeMembers =
    members.filter(
      (member) =>
        member.isActive === true
    ).length;


  const inactiveMembers =
    members.filter(
      (member) =>
        member.isActive !== true
    ).length;


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (
      <Box
        sx={{
          width: "100%",

          minHeight:
            "60vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          bgcolor:
            "#F5F7FA",

          borderRadius:
            "0 !important",
        }}
      >

        <CircularProgress
          color="success"
          size={28}
        />

      </Box>
    );

  }


  /* ===================================================
     PAGE
  =================================================== */

  return (
    <Box
      sx={{
        width: "100%",

        maxWidth: "100%",

        minWidth: 0,

        margin: 0,

        padding: 0,

        bgcolor:
          "#F5F7FA",

        overflowX:
          "hidden",

        boxSizing:
          "border-box",

        borderRadius:
          "0 !important",

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
          CONTENT
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          maxWidth: {
            xs: "100%",
            md: 1500,
          },

          margin: {
            xs: 0,
            md: "0 auto",
          },

          padding: {
            xs: "8px 8px 20px",
            sm: "12px 14px 24px",
            md: "18px 8px 28px",
          },

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
        }}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <Typography
          component="h1"
          sx={{
            margin: 0,

            fontSize: {
              xs: 20,
              sm: 25,
              md: 29,
            },

            lineHeight:
              1.25,

            fontWeight: 800,

            color:
              "#202124",

            mb: {
              xs: 0.4,
              sm: 0.7,
              md: 1,
            },
          }}
        >
          Members
        </Typography>


        <Typography
          sx={{
            fontSize: {
              xs: 11,
              sm: 13,
            },

            color:
              "#6B7280",

            lineHeight:
              1.4,

            mb: {
              xs: 1.2,
              sm: 1.5,
            },
          }}
        >
          View members assigned to you.
        </Typography>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,

              borderRadius:
                "0 !important",
            }}
          >
            {error}
          </Alert>
        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.3,
          }}
          sx={{
            width: "100%",

            margin: 0,

            mb: {
              xs: 1.5,
              sm: 2,
            },
          }}
        >

          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >

            <SummaryCard
              title="Total Members"
              value={
                totalMembers
              }
              subtitle="All members"
              icon={
                <PeopleIcon />
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >

            <SummaryCard
              title="Active Members"
              value={
                activeMembers
              }
              subtitle="Currently active"
              icon={
                <CheckCircleIcon />
              }
            />

          </Grid>


          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >

            <SummaryCard
              title="Inactive Members"
              value={
                inactiveMembers
              }
              subtitle="Currently inactive"
              color="#F59E0B"
              icon={
                <PendingIcon />
              }
            />

          </Grid>

        </Grid>


        {/* =================================================
            SEARCH
        ================================================= */}

        <TextField
          fullWidth
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search by name, User ID or mobile"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
              >
                <SearchIcon
                  sx={{
                    fontSize: 19,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1,

            "& .MuiOutlinedInput-root":
              {
                borderRadius:
                  "0 !important",

                backgroundColor:
                  "#FFFFFF",

                fontSize: {
                  xs: 12,
                  sm: 13,
                },
              },
          }}
        />


        {/* =================================================
            STATUS FILTER
        ================================================= */}

        <FormControl
          fullWidth
          size="small"
          sx={{
            mb: 1.5,
          }}
        >

          <InputLabel>
            Status
          </InputLabel>

          <Select
            value={status}
            label="Status"
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            sx={{
              borderRadius:
                "0 !important",

              backgroundColor:
                "#FFFFFF",

              fontSize: {
                xs: 12,
                sm: 13,
              },
            }}
          >

            <MenuItem value="ALL">
              All Status
            </MenuItem>

            <MenuItem value="ACTIVE">
              Active
            </MenuItem>

            <MenuItem value="INACTIVE">
              Inactive
            </MenuItem>

          </Select>

        </FormControl>


        {/* =================================================
            LIST HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            mb: 1,
          }}
        >

          <Typography
            sx={{
              fontSize: {
                xs: 17,
                sm: 20,
              },

              fontWeight: 800,
            }}
          >
            Member List
          </Typography>


          <Typography
            sx={{
              fontSize: {
                xs: 10,
                sm: 12,
              },

              color:
                "text.secondary",
            }}
          >
            {filteredMembers.length} results
          </Typography>

        </Box>


        {/* =================================================
            MOBILE MEMBER CARDS
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.3,
          }}
          sx={{
            width: "100%",

            margin: 0,
          }}
        >

          {filteredMembers.map(
            (
              member,
              index
            ) => (

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
                key={
                  member._id ||
                  member.id ||
                  index
                }
                sx={{
                  minWidth: 0,
                }}
              >

                <MemberCard
                  member={member}
                  onView={() =>
                    navigate(
                      `/manager/members/${
                        member._id ||
                        member.id
                      }/details`
                    )
                  }
                />

              </Grid>

            )
          )}

        </Grid>


        {/* =================================================
            EMPTY
        ================================================= */}

        {filteredMembers.length === 0 && (

          <Box
            sx={{
              width: "100%",

              py: 5,

              textAlign:
                "center",

              backgroundColor:
                "#FFFFFF",

              border:
                "1px solid #D9DEE3",

              borderRadius:
                "0 !important",
            }}
          >

            <Typography
              fontWeight={700}
            >
              No members found
            </Typography>

          </Box>

        )}


        {/* =================================================
            READ ONLY
        ================================================= */}

        <Alert
          severity="info"
          sx={{
            mt: 1.5,

            borderRadius:
              "0 !important",

            fontSize: {
              xs: 10.5,
              sm: 12,
            },

            py: {
              xs: 0.5,
              sm: 0.8,
            },
          }}
        >
          Manager access is read-only. Member records
          cannot be edited from this panel.
        </Alert>

      </Box>

    </Box>
  );
};


export default Members;