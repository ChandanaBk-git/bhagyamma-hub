import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Divider,
} from "@mui/material";

import {
  ShoppingBag,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const RecentOrders = ({ orders = [] }) => {

  const navigate = useNavigate();


  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",

        mt: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        backgroundColor: "#FFFFFF",

        boxShadow: "none",

        overflow: "hidden",

        boxSizing: "border-box",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
          },
        }}
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{
            mb: {
              xs: "7px",
              sm: "9px",
              md: "11px",
            },
          }}
        >

          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              lineHeight: 1.2,

              color: "#292929",
            }}
          >
            Recent Orders
          </Typography>


          <Button
            size="small"
            onClick={() =>
              navigate("/member/orders")
            }
            sx={{
              minWidth: "auto",

              height: {
                xs: "25px",
                sm: "28px",
              },

              px: {
                xs: "6px",
                sm: "8px",
              },

              borderRadius: 0,

              textTransform: "none",

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 600,

              lineHeight: 1,
            }}
          >
            View All
          </Button>

        </Stack>


        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {orders.length === 0 ? (

          <Box
            sx={{
              py: {
                xs: 2,
                sm: 2.5,
              },

              textAlign: "center",
            }}
          >

            <ShoppingBag
              sx={{
                fontSize: {
                  xs: 32,
                  sm: 38,
                },

                color: "#BDBDBD",
              }}
            />

            <Typography
              color="text.secondary"
              sx={{
                mt: {
                  xs: "5px",
                  sm: "7px",
                },

                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },

                lineHeight: 1.2,
              }}
            >
              No Orders Found
            </Typography>

          </Box>

        ) : (

          orders
            .slice(0, 3)
            .map((order) => (

              <Box
                key={order._id}
                sx={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >

                {/* ==================================
                    ORDER ROW
                ================================== */}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    width: "100%",
                    minWidth: 0,
                  }}
                >

                  {/* ORDER DETAILS */}

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >

                    <Typography
                      fontWeight={600}
                      sx={{
                        fontSize: {
                          xs: "11px",
                          sm: "12px",
                          md: "13px",
                        },

                        lineHeight: 1.2,

                        color: "#292929",

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                      }}
                    >
                      {order.orderNumber}
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
                      }}
                    >
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </Typography>

                  </Box>


                  {/* AMOUNT + STATUS */}

                  <Box
                    textAlign="right"
                    sx={{
                      flexShrink: 0,
                    }}
                  >

                    <Typography
                      fontWeight={700}
                      sx={{
                        fontSize: {
                          xs: "13px",
                          sm: "15px",
                          md: "17px",
                        },

                        lineHeight: 1.1,

                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹{order.finalAmount}
                    </Typography>


                    <Chip
                      size="small"
                      label={order.status}
                      color={
                        order.status ===
                        "COMPLETED"
                          ? "success"
                          : order.status ===
                            "PENDING"
                          ? "warning"
                          : "error"
                      }
                      sx={{
                        mt: "3px",

                        height: {
                          xs: "18px",
                          sm: "20px",
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

                </Stack>


                {/* DIVIDER */}

                <Divider
                  sx={{
                    my: {
                      xs: "6px",
                      sm: "8px",
                    },
                  }}
                />

              </Box>

            ))

        )}

      </CardContent>

    </Card>

  );

};


export default RecentOrders;