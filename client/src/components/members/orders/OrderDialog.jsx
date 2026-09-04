import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
} from "@mui/material";

import {
  ShoppingBag,
  CurrencyRupee,
  CalendarMonth,
  CreditCard,
  LocalShipping,
} from "@mui/icons-material";


const OrderDialog = ({
  open,
  onClose,
  order,
}) => {

  if (!order) return null;


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


  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 0,
          boxShadow: "none",
          border: "1px solid #E0E0E0",
          margin: {
            xs: 1,
            sm: 2,
          },
          width: {
            xs: "calc(100% - 16px)",
            sm: "calc(100% - 32px)",
          },
        },
      }}
    >

      {/* =================================================
          TITLE
      ================================================= */}

      <DialogTitle
        sx={{
          px: {
            xs: 1.25,
            sm: 1.75,
            md: 2,
          },

          py: {
            xs: 1,
            sm: 1.25,
          },

          fontSize: {
            xs: "15px",
            sm: "17px",
          },

          fontWeight: 800,

          borderBottom:
            "1px solid #E0E0E0",
        }}
      >
        Order Details
      </DialogTitle>


      {/* =================================================
          CONTENT
      ================================================= */}

      <DialogContent
        sx={{
          px: {
            xs: 1.25,
            sm: 1.75,
            md: 2,
          },

          py: {
            xs: 1.25,
            sm: 1.5,
          },

          "&:last-child": {
            pb: {
              xs: 1.25,
              sm: 1.5,
            },
          },

          overflowX: "hidden",
        }}
      >

        {/* =================================================
            ORDER HEADER
        ================================================= */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={{
            xs: 1.25,
            sm: 1.5,
          }}
          flexWrap="wrap"
          gap={1}
        >

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >

            <Typography
              sx={{
                fontSize: {
                  xs: "14px",
                  sm: "17px",
                },

                lineHeight: 1.25,

                fontWeight: 800,

                wordBreak:
                  "break-word",
              }}
            >
              {order.orderNumber}
            </Typography>


            <Typography
              sx={{
                mt: 0.25,

                color:
                  "text.secondary",

                fontSize: {
                  xs: "9px",
                  sm: "11px",
                },
              }}
            >
              Order Information
            </Typography>

          </Box>


          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            sx={{
              height: {
                xs: 21,
                sm: 24,
              },

              borderRadius: 0,

              fontSize: {
                xs: "8px",
                sm: "10px",
              },

              fontWeight: 700,

              flexShrink: 0,
            }}
          />

        </Stack>


        <Divider sx={{ mb: { xs: 1.25, sm: 1.5 } }} />


        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 0.75,
            sm: 1,
          }}
        >

          {/* ORDER NUMBER */}

          <Grid item xs={6} sm={6}>

            <Box
              sx={{
                height: "100%",

                p: {
                  xs: 0.9,
                  sm: 1.1,
                },

                border:
                  "1px solid #E0E0E0",

                boxSizing:
                  "border-box",
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 0.75,
                  sm: 1,
                }}
                alignItems="flex-start"
              >

                <ShoppingBag
                  color="success"
                  sx={{
                    fontSize: {
                      xs: 17,
                      sm: 20,
                    },

                    flexShrink: 0,
                  }}
                />

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      lineHeight: 1.3,
                    }}
                  >
                    Order Number
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,

                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                      },

                      fontWeight: 700,

                      wordBreak:
                        "break-word",
                    }}
                  >
                    {order.orderNumber}
                  </Typography>

                </Box>

              </Stack>

            </Box>

          </Grid>


          {/* TOTAL AMOUNT */}

          <Grid item xs={6} sm={6}>

            <Box
              sx={{
                height: "100%",

                p: {
                  xs: 0.9,
                  sm: 1.1,
                },

                border:
                  "1px solid #E0E0E0",

                boxSizing:
                  "border-box",
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 0.75,
                  sm: 1,
                }}
                alignItems="flex-start"
              >

                <CurrencyRupee
                  color="success"
                  sx={{
                    fontSize: {
                      xs: 17,
                      sm: 20,
                    },

                    flexShrink: 0,
                  }}
                />

                <Box>

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      lineHeight: 1.3,
                    }}
                  >
                    Total Amount
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,

                      fontSize: {
                        xs: "11px",
                        sm: "13px",
                      },

                      fontWeight: 800,

                      color:
                        "success.main",
                    }}
                  >
                    ₹{order.finalAmount}
                  </Typography>

                </Box>

              </Stack>

            </Box>

          </Grid>


          {/* PAYMENT STATUS */}

          <Grid item xs={6} sm={6}>

            <Box
              sx={{
                height: "100%",

                p: {
                  xs: 0.9,
                  sm: 1.1,
                },

                border:
                  "1px solid #E0E0E0",

                boxSizing:
                  "border-box",
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 0.75,
                  sm: 1,
                }}
                alignItems="flex-start"
              >

                <CreditCard
                  color="success"
                  sx={{
                    fontSize: {
                      xs: 17,
                      sm: 20,
                    },

                    flexShrink: 0,
                  }}
                />

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      lineHeight: 1.3,

                      mb: 0.4,
                    }}
                  >
                    Payment Status
                  </Typography>

                  <Chip
                    label={
                      order.paymentStatus
                    }

                    color={
                      order.paymentStatus ===
                      "PAID"
                        ? "success"
                        : "warning"
                    }

                    size="small"

                    sx={{
                      height: {
                        xs: 19,
                        sm: 22,
                      },

                      borderRadius: 0,

                      fontSize: {
                        xs: "7px",
                        sm: "9px",
                      },

                      fontWeight: 700,
                    }}
                  />

                </Box>

              </Stack>

            </Box>

          </Grid>


          {/* ORDER STATUS */}

          <Grid item xs={6} sm={6}>

            <Box
              sx={{
                height: "100%",

                p: {
                  xs: 0.9,
                  sm: 1.1,
                },

                border:
                  "1px solid #E0E0E0",

                boxSizing:
                  "border-box",
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 0.75,
                  sm: 1,
                }}
                alignItems="flex-start"
              >

                <LocalShipping
                  color="success"
                  sx={{
                    fontSize: {
                      xs: 17,
                      sm: 20,
                    },

                    flexShrink: 0,
                  }}
                />

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      lineHeight: 1.3,

                      mb: 0.4,
                    }}
                  >
                    Order Status
                  </Typography>

                  <Chip
                    label={
                      order.status
                    }

                    color={
                      getStatusColor(
                        order.status
                      )
                    }

                    size="small"

                    sx={{
                      height: {
                        xs: 19,
                        sm: 22,
                      },

                      borderRadius: 0,

                      fontSize: {
                        xs: "7px",
                        sm: "9px",
                      },

                      fontWeight: 700,
                    }}
                  />

                </Box>

              </Stack>

            </Box>

          </Grid>


          {/* ORDER DATE */}

          <Grid item xs={6} sm={6}>

            <Box
              sx={{
                height: "100%",

                p: {
                  xs: 0.9,
                  sm: 1.1,
                },

                border:
                  "1px solid #E0E0E0",

                boxSizing:
                  "border-box",
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 0.75,
                  sm: 1,
                }}
                alignItems="flex-start"
              >

                <CalendarMonth
                  color="success"
                  sx={{
                    fontSize: {
                      xs: 17,
                      sm: 20,
                    },

                    flexShrink: 0,
                  }}
                />

                <Box>

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      lineHeight: 1.3,
                    }}
                  >
                    Order Date
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,

                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                      },

                      fontWeight: 700,
                    }}
                  >
                    {
                      order.placedAt
                        ? new Date(
                            order.placedAt
                          ).toLocaleDateString()
                        : "-"
                    }
                  </Typography>

                </Box>

              </Stack>

            </Box>

          </Grid>


          {/* SELLING POINTS */}

          <Grid item xs={6} sm={6}>

            <Box
              sx={{
                height: "100%",

                p: {
                  xs: 0.9,
                  sm: 1.1,
                },

                border:
                  "1px solid #E0E0E0",

                boxSizing:
                  "border-box",
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 0.75,
                  sm: 1,
                }}
                alignItems="flex-start"
              >

                <CurrencyRupee
                  color="success"
                  sx={{
                    fontSize: {
                      xs: 17,
                      sm: 20,
                    },

                    flexShrink: 0,
                  }}
                />

                <Box>

                  <Typography
                    sx={{
                      color:
                        "text.secondary",

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      lineHeight: 1.3,
                    }}
                  >
                    Selling Points Earned
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.25,

                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                      },

                      fontWeight: 700,
                    }}
                  >
                    {order.sellingPoints || 0} SP
                  </Typography>

                </Box>

              </Stack>

            </Box>

          </Grid>

        </Grid>


        {/* =================================================
            PRODUCTS
        ================================================= */}

        {order.items?.length > 0 && (
          <>
            <Divider
              sx={{
                my: {
                  xs: 1.5,
                  sm: 2,
                },
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "15px",
                },

                fontWeight: 800,

                mb: {
                  xs: 0.75,
                  sm: 1,
                },
              }}
            >
              Products
            </Typography>


            {order.items.map(
              (item, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: {
                      xs: 0.75,
                      sm: 1,
                    },

                    p: {
                      xs: 0.9,
                      sm: 1.1,
                    },

                    bgcolor: "#F8F9FA",

                    border:
                      "1px solid #E0E0E0",

                    borderRadius: 0,

                    boxSizing:
                      "border-box",
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                      },

                      fontWeight: 700,

                      lineHeight: 1.35,

                      wordBreak:
                        "break-word",
                    }}
                  >
                    {item.productName}
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

                      lineHeight: 1.35,
                    }}
                  >
                    Quantity : {item.quantity}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 0.2,

                      fontSize: {
                        xs: "8px",
                        sm: "10px",
                      },

                      color:
                        "text.secondary",

                      lineHeight: 1.35,
                    }}
                  >
                    Price : ₹{item.price}
                  </Typography>


                  <Typography
                    sx={{
                      mt: 0.3,

                      fontSize: {
                        xs: "9px",
                        sm: "11px",
                      },

                      color:
                        "success.main",

                      fontWeight: 800,

                      lineHeight: 1.35,
                    }}
                  >
                    Total : ₹{item.total}
                  </Typography>

                </Box>
              )
            )}

          </>
        )}

      </DialogContent>

    </Dialog>

  );
};


export default OrderDialog;