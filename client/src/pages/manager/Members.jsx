import {
  useEffect,
  useMemo,
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
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StarIcon from "@mui/icons-material/Star";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import {
  getMembers,
} from "../../services/manager.service";


/* =====================================================
   HELPERS
===================================================== */

const money = (value) => {

  const amount =
    Number(value || 0);

  return `₹${amount.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;

};


const number = (value) => {

  return Number(
    value || 0
  ).toLocaleString(
    "en-IN"
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
          "1px solid #E5E7EB",

        borderRadius: 3,
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: 1.7,
            sm: 2,
          },

          "&:last-child": {
            pb: {
              xs: 1.7,
              sm: 2,
            },
          },
        }}
      >

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1.3,
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
                `${color}12`,

              color,

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
                xs: 11,
                sm: 12,
              }}
              color="text.secondary"
            >
              {title}
            </Typography>


            <Typography
              fontSize={{
                xs: 20,
                sm: 23,
              }}
              fontWeight={800}
            >
              {value}
            </Typography>


            {subtitle && (

              <Typography
                fontSize={10.5}
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
   MEMBER CARD
===================================================== */

const MemberCard = ({
  member,
  onView,
}) => {

  const wallet =
    member.wallet || {};

  const commission =
    member.commission || {};

  const orders =
    member.orders || {};


  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",

        border:
          "1px solid #E5E7EB",

        borderRadius: 3,

        overflow: "hidden",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: 1.7,
            sm: 2,
          },

          "&:last-child": {
            pb: {
              xs: 1.7,
              sm: 2,
            },
          },
        }}
      >

        {/* MEMBER */}

        <Box
          sx={{
            display: "flex",

            alignItems: "flex-start",

            justifyContent:
              "space-between",

            gap: 1,

            mb: 1.7,
          }}
        >

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1.2,

              minWidth: 0,
            }}
          >

            <Avatar
              sx={{
                width: 44,

                height: 44,

                flexShrink: 0,

                bgcolor:
                  "#E8F5E9",

                color:
                  "#2E7D32",

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


            <Box
              sx={{
                minWidth: 0,
              }}
            >

              <Typography
                fontWeight={800}
                fontSize={15}
                sx={{
                  overflowWrap:
                    "anywhere",
                }}
              >
                {member.name ||
                  "-"}
              </Typography>


              <Typography
                fontSize={11}
                color="text.secondary"
              >
                {member.userId ||
                  "-"}
              </Typography>


              <Typography
                fontSize={11}
                color="text.secondary"
              >
                {member.mobile ||
                  "-"}
              </Typography>

            </Box>

          </Box>


          <Chip
            size="small"
            label={
              member.isActive
                ? "Active"
                : "Inactive"
            }
            color={
              member.isActive
                ? "success"
                : "error"
            }
          />

        </Box>


        {/* STATUS */}

        <Stack
          direction="row"
          spacing={0.7}
          flexWrap="wrap"
          useFlexGap
          sx={{
            mb: 1.5,
          }}
        >

          <Chip
            size="small"
            variant="outlined"
            label={
              member.kycStatus ||
              "KYC Pending"
            }
            color={
              String(
                member.kycStatus ||
                ""
              ).toUpperCase() ===
              "VERIFIED"
                ? "success"
                : "warning"
            }
          />


          <Chip
            size="small"
            variant="outlined"
            label={
              member.paymentStatus ||
              "Payment Pending"
            }
            color={
              String(
                member.paymentStatus ||
                ""
              ).toUpperCase() ===
              "PAID"
                ? "success"
                : "warning"
            }
          />

        </Stack>


        {/* FINANCIAL DATA */}

        <Grid
          container
          spacing={1}
        >

          <Grid
            item
            xs={6}
          >

            <Box
              sx={{
                p: 1.1,

                bgcolor: "#F8FAFC",

                borderRadius: 2,
              }}
            >

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                Wallet
              </Typography>

              <Typography
                fontSize={14}
                fontWeight={800}
              >
                {money(
                  wallet.balance
                )}
              </Typography>

            </Box>

          </Grid>


          <Grid
            item
            xs={6}
          >

            <Box
              sx={{
                p: 1.1,

                bgcolor: "#F8FAFC",

                borderRadius: 2,
              }}
            >

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                Selling Points
              </Typography>

              <Typography
                fontSize={14}
                fontWeight={800}
              >
                {number(
                  member.sellingPoints
                )}
              </Typography>

            </Box>

          </Grid>


          <Grid
            item
            xs={6}
          >

            <Box
              sx={{
                p: 1.1,

                bgcolor: "#F8FAFC",

                borderRadius: 2,
              }}
            >

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                Commission
              </Typography>

              <Typography
                fontSize={14}
                fontWeight={800}
              >
                {money(
                  commission.total
                )}
              </Typography>

            </Box>

          </Grid>


          <Grid
            item
            xs={6}
          >

            <Box
              sx={{
                p: 1.1,

                bgcolor: "#F8FAFC",

                borderRadius: 2,
              }}
            >

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                Orders
              </Typography>

              <Typography
                fontSize={14}
                fontWeight={800}
              >
                {number(
                  orders.count
                )}
              </Typography>

            </Box>

          </Grid>

        </Grid>


        {/* ACTION */}

        <Button
          fullWidth
          variant="contained"
          color="success"
          startIcon={
            <VisibilityIcon />
          }
          onClick={onView}
          sx={{
            mt: 1.5,

            minHeight: 42,

            borderRadius: 2,
          }}
        >
          View Details
        </Button>

      </CardContent>

    </Card>

  );

};


/* =====================================================
   DESKTOP MEMBER ROW
===================================================== */

const DesktopMemberRow = ({
  member,
  onView,
}) => {

  const wallet =
    member.wallet || {};

  const commission =
    member.commission || {};

  const orders =
    member.orders || {};


  return (

    <Card
      elevation={0}
      sx={{
        display: {
          xs: "none",
          md: "block",
        },

        border:
          "1px solid #E5E7EB",

        borderRadius: 2,

        mb: 1,
      }}
    >

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns:
            "1.5fr 1fr 1fr 1fr 1fr 1fr 110px",

          alignItems: "center",

          gap: 1,

          px: 1.5,

          py: 1.4,
        }}
      >

        <Box
          sx={{
            minWidth: 0,
          }}
        >

          <Typography
            fontWeight={700}
            fontSize={13}
            sx={{
              overflowWrap:
                "anywhere",
            }}
          >
            {member.name ||
              "-"}
          </Typography>

          <Typography
            fontSize={10}
            color="text.secondary"
          >
            {member.userId ||
              "-"}
          </Typography>

        </Box>


        <Typography
          fontSize={12}
        >
          {member.mobile ||
            "-"}
        </Typography>


        <Typography
          fontSize={12}
          fontWeight={700}
        >
          {money(
            wallet.balance
          )}
        </Typography>


        <Typography
          fontSize={12}
          fontWeight={700}
        >
          {number(
            member.sellingPoints
          )}
        </Typography>


        <Typography
          fontSize={12}
          fontWeight={700}
        >
          {money(
            commission.total
          )}
        </Typography>


        <Box>

          <Typography
            fontSize={12}
            fontWeight={700}
          >
            {number(
              orders.count
            )}
          </Typography>

          <Typography
            fontSize={10}
            color="text.secondary"
          >
            {money(
              orders.salesValue
            )}
          </Typography>

        </Box>


        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={onView}
          sx={{
            borderRadius: 1.5,

            minHeight: 36,

            whiteSpace: "nowrap",
          }}
        >
          View
        </Button>

      </Box>

    </Card>

  );

};


/* =====================================================
   PAGE
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


  useEffect(
    () => {

      loadMembers();

    },
    []
  );


  const loadMembers =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getMembers();


        const result =
          response?.data ||
          response;


        setMembers(
          Array.isArray(result)
            ? result
            : []
        );

      } catch (err) {

        console.error(
          "Manager members error:",
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
     FILTER
  =================================================== */

  const filteredMembers =
    useMemo(
      () => {

        const searchValue =
          search
            .trim()
            .toLowerCase();


        return members.filter(
          (member) => {

            const matchesSearch =
              !searchValue ||
              String(
                member.name || ""
              )
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              String(
                member.userId || ""
              )
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              String(
                member.mobile || ""
              )
                .toLowerCase()
                .includes(
                  searchValue
                );


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


            if (
              status ===
              "KYC_PENDING"
            ) {

              matchesStatus =
                String(
                  member.kycStatus ||
                  ""
                ).toUpperCase() !==
                "VERIFIED";

            }


            if (
              status ===
              "PAYMENT_PENDING"
            ) {

              matchesStatus =
                String(
                  member.paymentStatus ||
                  ""
                ).toUpperCase() !==
                "PAID";

            }


            return (
              matchesSearch &&
              matchesStatus
            );

          }
        );

      },
      [
        members,
        search,
        status,
      ]
    );


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


  const pendingKyc =
    members.filter(
      (member) =>
        String(
          member.kycStatus ||
          ""
        ).toUpperCase() !==
        "VERIFIED"
    ).length;


  const pendingPayment =
    members.filter(
      (member) =>
        String(
          member.paymentStatus ||
          ""
        ).toUpperCase() !==
        "PAID"
    ).length;


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
     PAGE
  =================================================== */

  return (

    <Box
      sx={{
        width: "100%",

        maxWidth: 1600,

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
          mb: 2,
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
          Members
        </Typography>


        <Typography
          sx={{
            mt: 0.4,

            fontSize: {
              xs: 12,
              sm: 13,
            },

            color: "text.secondary",
          }}
        >
          View members assigned to you and their
          business performance.
        </Typography>

      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
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
          lg={3}
        >

          <SummaryCard
            title="Total Members"
            value={number(totalMembers)}
            subtitle="Managed members"
            icon={
              <PeopleIcon />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          lg={3}
        >

          <SummaryCard
            title="Active Members"
            value={number(activeMembers)}
            subtitle="Currently active"
            icon={
              <CheckCircleIcon />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          lg={3}
        >

          <SummaryCard
            title="Pending KYC"
            value={number(pendingKyc)}
            subtitle="Needs verification"
            color="#F59E0B"
            icon={
              <PendingIcon />
            }
          />

        </Grid>


        <Grid
          item
          xs={12}
          sm={6}
          lg={3}
        >

          <SummaryCard
            title="Pending Payment"
            value={number(pendingPayment)}
            subtitle="Payment pending"
            color="#F59E0B"
            icon={
              <PaymentsIcon />
            }
          />

        </Grid>

      </Grid>


      {/* =================================================
          SEARCH + FILTER
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
              xs: 1.5,
              sm: 2,
            },

            "&:last-child": {
              pb: {
                xs: 1.5,
                sm: 2,
              },
            },
          }}
        >

          <Grid
            container
            spacing={1.2}
          >

            <Grid
              item
              xs={12}
              md={8}
            >

              <TextField
                fullWidth
                size="small"
                placeholder="Search name, ID, mobile..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                    >
                      <SearchIcon
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                }}
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <FormControl
                fullWidth
                size="small"
              >

                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  value={status}
                  label="Status"
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
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

                  <MenuItem value="KYC_PENDING">
                    KYC Pending
                  </MenuItem>

                  <MenuItem value="PAYMENT_PENDING">
                    Payment Pending
                  </MenuItem>

                </Select>

              </FormControl>

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          RESULT COUNT
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          mb: 1.3,

          gap: 1,
        }}
      >

        <Typography
          fontWeight={800}
          fontSize={{
            xs: 17,
            sm: 19,
          }}
        >
          Member List
        </Typography>


        <Typography
          fontSize={12}
          color="text.secondary"
        >
          {filteredMembers.length} result
          {filteredMembers.length !== 1
            ? "s"
            : ""}
        </Typography>

      </Box>


      {/* =================================================
          EMPTY
      ================================================= */}

      {filteredMembers.length === 0 ? (

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",

            borderRadius: 3,
          }}
        >

          <CardContent
            sx={{
              py: 5,

              textAlign: "center",
            }}
          >

            <PeopleIcon
              sx={{
                fontSize: 42,

                color:
                  "text.disabled",

                mb: 1,
              }}
            />


            <Typography
              fontWeight={800}
            >
              No members found
            </Typography>


            <Typography
              fontSize={12}
              color="text.secondary"
              sx={{
                mt: 0.4,
              }}
            >
              Try changing your search or filters.
            </Typography>

          </CardContent>

        </Card>

      ) : (

        <>
          {/* =================================================
              DESKTOP
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },

              overflowX: "auto",

              pb: 1,
            }}
          >

            {/* HEADER */}

            <Card
              elevation={0}
              sx={{
                border:
                  "1px solid #E5E7EB",

                borderRadius: 2,

                mb: 1,

                bgcolor: "#F8FAFC",
              }}
            >

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns:
                    "1.5fr 1fr 1fr 1fr 1fr 1fr 110px",

                  gap: 1,

                  px: 1.5,

                  py: 1.2,
                }}
              >

                <Typography fontSize={11}>
                  Member
                </Typography>

                <Typography fontSize={11}>
                  Mobile
                </Typography>

                <Typography fontSize={11}>
                  Wallet
                </Typography>

                <Typography fontSize={11}>
                  Selling Points
                </Typography>

                <Typography fontSize={11}>
                  Commission
                </Typography>

                <Typography fontSize={11}>
                  Orders
                </Typography>

                <Typography fontSize={11}>
                  Action
                </Typography>

              </Box>

            </Card>


            {filteredMembers.map(
              (
                member,
                index
              ) => (

                <DesktopMemberRow
                  key={
                    member._id ||
                    member.id ||
                    index
                  }
                  member={member}
                  onView={() =>
                    navigate(
                      `/manager/members/${member._id || member.id}/details`
                    )
                  }
                />

              )
            )}

          </Box>


          {/* =================================================
              MOBILE + TABLET
          ================================================= */}

          <Grid
            container
            spacing={1.5}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
            }}
          >

            {filteredMembers.map(
              (
                member,
                index
              ) => (

                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={
                    member._id ||
                    member.id ||
                    index
                  }
                >

                  <MemberCard
                    member={member}
                    onView={() =>
                      navigate(
                        `/manager/members/${member._id || member.id}/details`
                      )
                    }
                  />

                </Grid>

              )
            )}

          </Grid>

        </>

      )}


      {/* =================================================
          READ ONLY
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
        Manager access is read-only. Member records
        cannot be edited from this panel.
      </Alert>

    </Box>

  );

};


export default Members;