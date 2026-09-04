import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  ShoppingBag,
  Visibility,
} from "@mui/icons-material";

import { useState } from "react";

import OrderDialog from "./OrderDialog";


const OrdersTable = ({ orders = [] }) => {

  const [selectedOrder, setSelectedOrder] =
    useState(null);


  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!orders.length) {
    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",

          borderRadius: 0,

          border:
            "1px solid #E0E0E0",

          boxShadow: "none",

          boxSizing: "border-box",
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
          <Box
            py={{
              xs: 4,
              sm: 5,
            }}
            textAlign="center"
          >
            <ShoppingBag
              sx={{
                fontSize: {
                  xs: 40,
                  sm: 50,
                },

                color: "#BDBDBD",
              }}
            />

            <Typography
              sx={{
                mt: 1,

                fontSize: {
                  xs: "13px",
                  sm: "15px",
                },

                fontWeight: 800,
              }}
            >
              No Orders Yet
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                fontSize: {
                  xs: "9px",
                  sm: "11px",
                },

                color: "text.secondary",
              }}
            >
              Purchase products to see your orders here.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }


  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (status) => {

    switch (status) {

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "error";

      case "SHIPPED":
        return "info";

      case "CONFIRMED":
        return "primary";

      default:
        return "warning";
    }
  };


  // =====================================================
  // ORDERS
  // =====================================================

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: "100%",

          borderRadius: 0,

          border:
            "1px solid #E0E0E0",

          boxShadow: "none",

          boxSizing: "border-box",

          overflow: "hidden",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },

            "&:last-child": {
              pb: {
                xs: 1,
                sm: 1.5,
                md: 2,
              },
            },
          }}
        >

          {/* =============================================
              HEADER
          ============================================== */}

          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              fontWeight: 800,

              mb: {
                xs: 1,
                sm: 1.25,
              },

              lineHeight: 1.25,
            }}
          >
            Order History
          </Typography>


          {/* =============================================
              ORDER LIST
          ============================================== */}

          {orders.map((order) => (

            <Box
              key={order._id}
              sx={{
                mb: 0.75,

                p: {
                  xs: 1,
                  sm: 1.25,
                },

                border:
                  "1px solid #E0E0E0",

                borderRadius: 0,

                boxSizing: "border-box",

                transition:
                  "border-color 0.2s ease",

                "&:hover": {
                  borderColor:
                    "#2E7D32",
                },

                "&:last-child": {
                  mb: 0,
                },
              }}
            >

              <Stack
                direction={{
                  xs: "row",
                  sm: "row",
                }}
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >

                {/* =======================================
                    ORDER INFORMATION
                ======================================== */}

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                        md: "13px",
                      },

                      fontWeight: 800,

                      lineHeight: 1.3,

                      overflow: "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {order.orderNumber}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 0.3,

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      color:
                        "text.secondary",

                      lineHeight: 1.4,
                    }}
                  >
                    Amount : ₹
                    {order.finalAmount}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 0.15,

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      color:
                        "text.secondary",

                      lineHeight: 1.4,
                    }}
                  >
                    Payment :{" "}
                    {order.paymentStatus}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 0.15,

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      color:
                        "text.secondary",

                      lineHeight: 1.4,
                    }}
                  >
                    Date :{" "}
                    {
                      new Date(
                        order.placedAt
                      ).toLocaleDateString()
                    }
                  </Typography>

                </Box>


                {/* =======================================
                    STATUS + ACTION
                ======================================== */}

                <Stack
                  spacing={{
                    xs: 0.5,
                    sm: 0.75,
                  }}
                  alignItems="flex-end"
                  flexShrink={0}
                >

                  <Chip
                    label={order.status}
                    color={
                      getStatusColor(
                        order.status
                      )
                    }
                    sx={{
                      height: {
                        xs: 20,
                        sm: 23,
                      },

                      borderRadius: 0,

                      fontSize: {
                        xs: "7px",
                        sm: "9px",
                      },

                      fontWeight: 700,
                    }}
                  />


                  <Button
                    variant="contained"
                    color="success"

                    startIcon={
                      <Visibility
                        sx={{
                          fontSize: {
                            xs: 13,
                            sm: 16,
                          },
                        }}
                      />
                    }

                    onClick={() =>
                      setSelectedOrder(
                        order
                      )
                    }

                    sx={{
                      minHeight: {
                        xs: 27,
                        sm: 31,
                      },

                      px: {
                        xs: 0.8,
                        sm: 1.2,
                      },

                      py: 0.2,

                      borderRadius: 0,

                      textTransform:
                        "none",

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      fontWeight: 700,

                      lineHeight: 1.2,

                      boxShadow: "none",

                      whiteSpace:
                        "nowrap",

                      "&:hover": {
                        boxShadow: "none",
                      },

                      "& .MuiButton-startIcon": {
                        marginRight: {
                          xs: 0.3,
                          sm: 0.5,
                        },
                      },
                    }}
                  >
                    View Details
                  </Button>

                </Stack>

              </Stack>


              {/* =========================================
                  DIVIDER
              ========================================== */}

              <Divider
                sx={{
                  mt: {
                    xs: 0.75,
                    sm: 1,
                  },
                }}
              />

            </Box>

          ))}

        </CardContent>
      </Card>


      {/* =================================================
          ORDER DIALOG
      ================================================= */}

      <OrderDialog
        open={Boolean(selectedOrder)}

        order={selectedOrder}

        onClose={() =>
          setSelectedOrder(null)
        }
      />
    </>
  );
};


export default OrdersTable;