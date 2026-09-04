import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

import { getDashboard } from "../../services/admin.service";
import { getAdminOrders } from "../../services/order.service";

import DashboardCards from "../../components/dashboard/DashboardCards";


const Dashboard = () => {

  const [dashboard, setDashboard] = useState({
    totalMembers: 0,
    totalProducts: 0,
    totalLayers: 0,
  });

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    placedOrders: 0,
    confirmedOrders: 0,
    packedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* ==========================================================
     FETCH DASHBOARD + ORDERS
  ========================================================== */

  useEffect(() => {
    fetchDashboardData();
  }, []);


  const fetchDashboardData = async () => {

    try {

      setLoading(true);
      setError("");


      /* ======================================================
         DASHBOARD DATA
      ====================================================== */

      const dashboardResponse =
        await getDashboard();

      console.log(
        "ADMIN DASHBOARD:",
        dashboardResponse
      );


      const dashboardData =
        dashboardResponse?.data || {};


      setDashboard({

        totalMembers:
          dashboardData?.totalMembers || 0,

        totalProducts:
          dashboardData?.totalProducts || 0,

        totalLayers:
          dashboardData?.totalLayers || 0,

      });


      /* ======================================================
         ADMIN ORDERS
      ====================================================== */

      const ordersResponse =
        await getAdminOrders();


      console.log(
        "ADMIN ORDERS FOR DASHBOARD:",
        ordersResponse
      );


      /* ======================================================
         NORMALIZE ORDER RESPONSE
      ====================================================== */

      let orders = [];


      if (
        Array.isArray(
          ordersResponse
        )
      ) {

        orders =
          ordersResponse;

      } else if (
        Array.isArray(
          ordersResponse?.orders
        )
      ) {

        orders =
          ordersResponse.orders;

      } else if (
        Array.isArray(
          ordersResponse?.data
        )
      ) {

        orders =
          ordersResponse.data;

      } else if (
        Array.isArray(
          ordersResponse?.data?.orders
        )
      ) {

        orders =
          ordersResponse.data.orders;

      }


      console.log(
        "DASHBOARD ORDERS:",
        orders
      );

      console.log(
        "TOTAL DASHBOARD ORDERS:",
        orders.length
      );


      /* ======================================================
         CALCULATE ORDER STATISTICS
      ====================================================== */

      const totalOrders =
        orders.length;


      const placedOrders =
        orders.filter(
          (order) =>
            String(
              order?.status || ""
            ).toUpperCase() ===
            "PLACED"
        ).length;


      const confirmedOrders =
        orders.filter(
          (order) =>
            String(
              order?.status || ""
            ).toUpperCase() ===
            "CONFIRMED"
        ).length;


      const packedOrders =
        orders.filter(
          (order) =>
            String(
              order?.status || ""
            ).toUpperCase() ===
            "PACKED"
        ).length;


      const shippedOrders =
        orders.filter(
          (order) =>
            String(
              order?.status || ""
            ).toUpperCase() ===
            "SHIPPED"
        ).length;


      const deliveredOrders =
        orders.filter(
          (order) =>
            String(
              order?.status || ""
            ).toUpperCase() ===
            "DELIVERED"
        ).length;


      const cancelledOrders =
        orders.filter(
          (order) =>
            String(
              order?.status || ""
            ).toUpperCase() ===
            "CANCELLED"
        ).length;


      const paidOrders =
        orders.filter(
          (order) =>
            String(
              order?.paymentStatus || ""
            ).toUpperCase() ===
            "PAID"
        ).length;


      const pendingOrders =
        orders.filter(
          (order) =>
            String(
              order?.paymentStatus || ""
            ).toUpperCase() ===
            "PENDING"
        ).length;


      /* ======================================================
         SAVE ORDER STATISTICS
      ====================================================== */

      setOrderStats({

        totalOrders,

        placedOrders,

        confirmedOrders,

        packedOrders,

        shippedOrders,

        deliveredOrders,

        cancelledOrders,

        paidOrders,

        pendingOrders,

      });


    } catch (err) {

      console.error(
        "ADMIN DASHBOARD ERROR:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load dashboard."
      );


    } finally {

      setLoading(false);

    }

  };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {

    return (

      <Box
        sx={{
          width: "100%",

          minHeight: {
            xs: "180px",
            sm: "250px",
            md: "350px",
          },

          display: "flex",

          alignItems: "center",

          justifyContent: "center",
        }}
      >

        <CircularProgress
          size={28}
        />

      </Box>

    );

  }


  /* ==========================================================
     ORDER STATUS BOXES
  ========================================================== */

  const orderStatusItems = [

    {
      title: "Placed",
      value:
        orderStats.placedOrders,
    },

    {
      title: "Confirmed",
      value:
        orderStats.confirmedOrders,
    },

    {
      title: "Packed",
      value:
        orderStats.packedOrders,
    },

    {
      title: "Shipped",
      value:
        orderStats.shippedOrders,
    },

    {
      title: "Delivered",
      value:
        orderStats.deliveredOrders,
    },

    {
      title: "Cancelled",
      value:
        orderStats.cancelledOrders,
    },

  ];


  /* ==========================================================
     MAIN DASHBOARD
  ========================================================== */

  return (

    <Box
      sx={{
        width: "100%",

        maxWidth: "100%",

        minWidth: 0,

        margin: 0,

        padding: {
          xs: "10px 8px 20px",
          sm: "14px 14px 24px",
          md: "20px 0 30px",
        },

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >


      {/* ======================================================
          TITLE
      ====================================================== */}

      <Typography
        component="h1"
        sx={{
          margin: 0,

          marginBottom: {
            xs: "12px",
            sm: "16px",
            md: "20px",
          },

          fontSize: {
            xs: "21px",
            sm: "24px",
            md: "30px",
          },

          lineHeight: {
            xs: "26px",
            sm: "30px",
            md: "36px",
          },

          fontWeight: 700,

          color: "#292929",
        }}
      >
        Admin Dashboard
      </Typography>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <Alert
          severity="error"

          onClose={() =>
            setError("")
          }

          sx={{
            width: "100%",

            marginBottom: "14px",

            borderRadius: "10px",

            fontSize: {
              xs: "12px",
              sm: "13px",
              md: "14px",
            },
          }}
        >
          {error}
        </Alert>

      )}


      {/* ======================================================
          DASHBOARD CARDS
      ====================================================== */}

      <Box
        sx={{
          width: "100%",

          maxWidth: "100%",

          minWidth: 0,

          margin: 0,

          padding: 0,

          boxSizing: "border-box",

          overflowX: "hidden",

          "& > *": {
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          },
        }}
      >

        <DashboardCards
          data={dashboard}
        />

      </Box>


      {/* ======================================================
          ORDER DETAILS
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",

          maxWidth: "100%",

          minWidth: 0,

          marginTop: {
            xs: "14px",
            sm: "18px",
            md: "22px",
          },

          padding: {
            xs: "14px",
            sm: "18px",
            md: "22px",
          },

          boxSizing: "border-box",

          backgroundColor:
            "#FFFFFF",

          border:
            "1px solid #E1E1E1",

          borderRadius: {
            xs: "12px",
            sm: "15px",
            md: "18px",
          },

          overflow: "hidden",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >


        {/* ====================================================
            TITLE
        ==================================================== */}

        <Typography
          sx={{
            margin: 0,

            marginBottom: {
              xs: "12px",
              sm: "15px",
              md: "18px",
            },

            fontSize: {
              xs: "17px",
              sm: "19px",
              md: "21px",
            },

            fontWeight: 700,

            color: "#292929",
          }}
        >
          Order Details
        </Typography>


        {/* ====================================================
            SUMMARY BOXES
        ==================================================== */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.5,
            md: 2,
          }}
        >


          {/* TOTAL ORDERS */}

          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >

            <Box
              sx={{
                padding: {
                  xs: "10px",
                  sm: "12px",
                },

                border:
                  "1px solid #E2E2E2",

                borderRadius:
                  "10px",

                backgroundColor:
                  "#FAFAFA",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },

                  color:
                    "#777777",

                  marginBottom:
                    "4px",
                }}
              >
                Total Orders
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "19px",
                    sm: "21px",
                  },

                  fontWeight: 700,

                  color:
                    "#292929",
                }}
              >
                {
                  orderStats.totalOrders
                }
              </Typography>

            </Box>

          </Grid>


          {/* PAID */}

          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >

            <Box
              sx={{
                padding: {
                  xs: "10px",
                  sm: "12px",
                },

                border:
                  "1px solid #E2E2E2",

                borderRadius:
                  "10px",

                backgroundColor:
                  "#FAFAFA",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },

                  color:
                    "#777777",

                  marginBottom:
                    "4px",
                }}
              >
                Paid Orders
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "19px",
                    sm: "21px",
                  },

                  fontWeight: 700,

                  color:
                    "#2E7D32",
                }}
              >
                {
                  orderStats.paidOrders
                }
              </Typography>

            </Box>

          </Grid>


          {/* PENDING */}

          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >

            <Box
              sx={{
                padding: {
                  xs: "10px",
                  sm: "12px",
                },

                border:
                  "1px solid #E2E2E2",

                borderRadius:
                  "10px",

                backgroundColor:
                  "#FAFAFA",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },

                  color:
                    "#777777",

                  marginBottom:
                    "4px",
                }}
              >
                Pending Orders
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "19px",
                    sm: "21px",
                  },

                  fontWeight: 700,

                  color:
                    "#ED6C02",
                }}
              >
                {
                  orderStats.pendingOrders
                }
              </Typography>

            </Box>

          </Grid>


          {/* DELIVERED */}

          <Grid
            item
            xs={6}
            sm={6}
            md={3}
          >

            <Box
              sx={{
                padding: {
                  xs: "10px",
                  sm: "12px",
                },

                border:
                  "1px solid #E2E2E2",

                borderRadius:
                  "10px",

                backgroundColor:
                  "#FAFAFA",
              }}
            >

              <Typography
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },

                  color:
                    "#777777",

                  marginBottom:
                    "4px",
                }}
              >
                Delivered
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "19px",
                    sm: "21px",
                  },

                  fontWeight: 700,

                  color:
                    "#2E7D32",
                }}
              >
                {
                  orderStats.deliveredOrders
                }
              </Typography>

            </Box>

          </Grid>

        </Grid>


        {/* ====================================================
            ORDER STATUS
        ==================================================== */}

        <Typography
          sx={{
            marginTop: "16px",

            marginBottom: "9px",

            fontSize: {
              xs: "14px",
              sm: "15px",
            },

            fontWeight: 700,

            color:
              "#292929",
          }}
        >
          Order Status
        </Typography>


        <Box
          sx={{
            width: "100%",

            display: "grid",

            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
            },

            gap: {
              xs: "7px",
              sm: "9px",
              md: "10px",
            },
          }}
        >

          {orderStatusItems.map(
            (item) => (

              <Box
                key={item.title}
                sx={{
                  minWidth: 0,

                  padding: {
                    xs: "9px 6px",
                    sm: "10px",
                  },

                  textAlign:
                    "center",

                  border:
                    "1px solid #E2E2E2",

                  borderRadius:
                    "9px",

                  backgroundColor:
                    "#FFFFFF",
                }}
              >

                <Typography
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                    },

                    color:
                      "#777777",

                    whiteSpace:
                      "nowrap",

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",
                  }}
                >
                  {
                    item.title
                  }
                </Typography>

                <Typography
                  sx={{
                    marginTop: "3px",

                    fontSize: {
                      xs: "16px",
                      sm: "18px",
                    },

                    fontWeight: 700,

                    color:
                      "#292929",
                  }}
                >
                  {
                    item.value
                  }
                </Typography>

              </Box>

            )
          )}

        </Box>

      </Paper>

    </Box>

  );

};


export default Dashboard;