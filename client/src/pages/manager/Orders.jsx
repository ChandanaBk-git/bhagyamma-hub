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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  getManagerOrders,
} from "../../services/manager.service";


/* =====================================================
   SAFE VALUE HELPERS
===================================================== */

const safeText = (
  value,
  fallback = "-"
) => {

  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (
    typeof value === "boolean"
  ) {
    return value
      ? "Yes"
      : "No";
  }

  /*
  =====================================================
  IMPORTANT

  React cannot render an object directly.

  If backend sends:

  status: {
    name: "PAID"
  }

  or

  member: {
    name: "..."
  }

  this safely extracts a useful value.
  =====================================================
  */

  if (
    typeof value === "object"
  ) {

    return (
      value.name ??
      value.label ??
      value.title ??
      value.status ??
      value.value ??
      value.userId ??
      value.mobile ??
      value.email ??
      value._id ??
      value.id ??
      fallback
    ).toString();

  }

  return fallback;

};


/* =====================================================
   STATUS VALUE
===================================================== */

const getStatusValue = (
  value,
  fallback = "PENDING"
) => {

  const result =
    safeText(
      value,
      fallback
    );

  return String(
    result
  ).trim();

};


/* =====================================================
   MEMBER NAME
===================================================== */

const getMemberName = (
  order
) => {

  if (
    typeof order?.member ===
    "string"
  ) {
    return order.member;
  }

  if (
    typeof order?.user ===
    "string"
  ) {
    return order.user;
  }

  return (
    safeText(
      order?.member?.name,
      ""
    ) ||

    safeText(
      order?.user?.name,
      ""
    ) ||

    safeText(
      order?.memberName,
      ""
    ) ||

    safeText(
      order?.customer?.name,
      ""
    ) ||

    "Unknown Member"
  );

};


/* =====================================================
   MEMBER ID
===================================================== */

const getMemberId = (
  order
) => {

  return (
    safeText(
      order?.member?.userId,
      ""
    ) ||

    safeText(
      order?.member?.memberId,
      ""
    ) ||

    safeText(
      order?.user?.userId,
      ""
    ) ||

    safeText(
      order?.user?.memberId,
      ""
    ) ||

    safeText(
      order?.userId,
      ""
    ) ||

    safeText(
      order?.memberId,
      ""
    ) ||

    "-"
  );

};


/* =====================================================
   ORDER NUMBER
===================================================== */

const getOrderNumber = (
  order
) => {

  return (
    safeText(
      order?.orderNumber,
      ""
    ) ||

    safeText(
      order?.orderId,
      ""
    ) ||

    safeText(
      order?._id,
      ""
    ) ||

    "-"
  );

};


/* =====================================================
   MONEY
===================================================== */

const money = (
  value
) => {

  const amount =
    Number(
      value || 0
    );

  return `₹${amount.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;

};


/* =====================================================
   NUMBER
===================================================== */

const number = (
  value
) => {

  return Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  );

};


/* =====================================================
   DATE
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
      month: "short",
      year: "numeric",
    }
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
          "1px solid #2E7D32",

        borderRadius: 0,
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

            gap: 1,
          }}
        >

          <Box
            sx={{
              width: {
                xs: 32,
                sm: 36,
              },

              height: {
                xs: 40,
                sm: 46,
              },

              flexShrink: 0,

              borderRadius: 0,

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
                xs: 17,
                sm: 20,
              }}
              fontWeight={800}
              sx={{
                overflowWrap:
                  "anywhere",
              }}
            >
              {safeText(value)}
            </Typography>


            {subtitle && (

              <Typography
                fontSize={10.5}
                color="text.secondary"
                sx={{
                  overflowWrap:
                    "anywhere",
                }}
              >
                {safeText(subtitle)}
              </Typography>

            )}

          </Box>

        </Box>

      </CardContent>

    </Card>

  );

};


/* =====================================================
   STATUS CHIP
===================================================== */

const StatusChip = ({
  value,
  type,
}) => {

  const rawStatus =
    getStatusValue(
      value,
      "PENDING"
    );

  const status =
    rawStatus.toUpperCase();


  let color =
    "warning";


  if (
    status === "PAID" ||
    status === "DELIVERED" ||
    status === "COMPLETED" ||
    status === "APPROVED" ||
    status === "CONFIRMED" ||
    status === "SUCCESS" ||
    status === "SUCCESSFUL"
  ) {

    color =
      "success";

  }


  if (
    status === "CANCELLED" ||
    status === "FAILED" ||
    status === "REJECTED"
  ) {

    color =
      "error";

  }


  return (

    <Chip
      size="small"

      label={
        rawStatus
      }

      color={
        color
      }

      variant={
        type === "payment"
          ? "outlined"
          : "filled"
      }

      sx={{
        maxWidth: "100%",

        fontSize: {
          xs: 10,
          sm: 11,
        },

        "& .MuiChip-label": {
          overflow: "hidden",

          textOverflow:
            "ellipsis",

          whiteSpace:
            "nowrap",
        },
      }}
    />

  );

};


/* =====================================================
   MOBILE ORDER CARD
===================================================== */

const OrderCard = ({
  order,
}) => {

  const orderNumber =
    getOrderNumber(
      order
    );

  const memberName =
    getMemberName(
      order
    );

  const memberId =
    getMemberId(
      order
    );

  const paymentStatus =
    getStatusValue(
      order?.paymentStatus,
      "PENDING"
    );

  const orderStatus =
    getStatusValue(
      order?.status,
      "PENDING"
    );


  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",

        border:
          "1px solid #2E7D32",

        borderRadius: 0,
      }}
    >

      <CardContent
        sx={{
          p: 1.2,

          "&:last-child": {
            pb: 1.7,
          },
        }}
      >

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",

            alignItems: "flex-start",

            justifyContent:
              "space-between",

            gap: 1,

            mb: 1,
          }}
        >

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 0.8,

              minWidth: 0,

              flex: 1,
            }}
          >

            <Avatar
              sx={{
                width: 32,

                height: 32,

                flexShrink: 0,

                bgcolor:
                  "#E8F5E9",

                color:
                  "#2E7D32",
              }}
            >
              <ShoppingBagIcon
                fontSize="small"
              />
            </Avatar>


            <Box
              sx={{
                minWidth: 0,
              }}
            >

              <Typography
                fontWeight={800}
                fontSize={14}
                sx={{
                  overflowWrap:
                    "anywhere",
                }}
              >
                {orderNumber}
              </Typography>


              <Typography
                fontSize={11}
                color="text.secondary"
              >
                {formatDate(
                  order?.createdAt
                )}
              </Typography>

            </Box>

          </Box>


          <StatusChip
            value={
              orderStatus
            }
          />

        </Box>


        {/* MEMBER */}

        <Box
          sx={{
            p: 1.2,

            bgcolor:
              "#F8FAFC",

            borderRadius: 0,

            mb: 1.2,
          }}
        >

          <Typography
            fontSize={10}
            color="text.secondary"
          >
            Member
          </Typography>


          <Typography
            fontSize={13}
            fontWeight={700}
            sx={{
              overflowWrap:
                "anywhere",
            }}
          >
            {memberName}
          </Typography>


          <Typography
            fontSize={10.5}
            color="text.secondary"
            sx={{
              overflowWrap:
                "anywhere",
            }}
          >
            {memberId}
          </Typography>

        </Box>


        {/* VALUES */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",

            gap: 1,
          }}
        >

          {/* AMOUNT */}

          <Box
            sx={{
              p: 1.1,

              borderRadius: 0,

              bgcolor: "#F8FAFC",

              minWidth: 0,
            }}
          >

            <Typography
              fontSize={10}
              color="text.secondary"
            >
              Amount
            </Typography>


            <Typography
              fontSize={15}
              fontWeight={800}
              sx={{
                overflowWrap:
                  "anywhere",
              }}
            >
              {money(
                order?.finalAmount
              )}
            </Typography>

          </Box>


          {/* SELLING POINTS */}

          <Box
            sx={{
              p: 1.1,

              borderRadius: 0,

              bgcolor: "#F8FAFC",

              minWidth: 0,
            }}
          >

            <Typography
              fontSize={10}
              color="text.secondary"
            >
              Selling Points
            </Typography>


            <Typography
              fontSize={15}
              fontWeight={800}
            >
              {number(
                order?.sellingPoints
              )}
            </Typography>

          </Box>


          {/* PAYMENT */}

          <Box
            sx={{
              gridColumn:
                "1 / -1",

              display: "flex",

              alignItems: "center",

              justifyContent:
                "space-between",

              gap: 1,

              p: 1.1,

              borderRadius: 0,

              bgcolor: "#F8FAFC",

              minWidth: 0,
            }}
          >

            <Typography
              fontSize={11}
              color="text.secondary"
            >
              Payment
            </Typography>


            <StatusChip
              value={
                paymentStatus
              }
              type="payment"
            />

          </Box>


          {/* TOTAL / COMMISSION */}

          <Box
            sx={{
              p: 1.1,

              borderRadius: 0,

              bgcolor: "#F8FAFC",

              minWidth: 0,
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
              color="success.main"
            >
              {money(
                order?.commission ??
                order?.commissionAmount ??
                0
              )}
            </Typography>

          </Box>


          {/* ORDER STATUS */}

          <Box
            sx={{
              p: 1.1,

              borderRadius: 0,

              bgcolor: "#F8FAFC",

              display: "flex",

              flexDirection: "column",

              alignItems: "flex-start",

              justifyContent:
                "center",

              gap: 0.5,

              minWidth: 0,
            }}
          >

            <Typography
              fontSize={10}
              color="text.secondary"
            >
              Status
            </Typography>


            <StatusChip
              value={
                orderStatus
              }
            />

          </Box>

        </Box>

      </CardContent>

    </Card>

  );

};


/* =====================================================
   DESKTOP ORDER ROW
===================================================== */

const DesktopOrderRow = ({
  order,
}) => {

  const orderNumber =
    getOrderNumber(
      order
    );

  const memberName =
    getMemberName(
      order
    );

  const memberId =
    getMemberId(
      order
    );

  const paymentStatus =
    getStatusValue(
      order?.paymentStatus,
      "PENDING"
    );

  const orderStatus =
    getStatusValue(
      order?.status,
      "PENDING"
    );


  return (

    <Box
      sx={{
        display: "grid",

        gridTemplateColumns:
          "1.2fr 1.5fr 1fr 1fr 1fr 1fr 1fr",

        gap: 1,

        alignItems: "center",

        px: 1.5,

        py: 1,

        border:
          "1px solid #2E7D32",

        borderRadius: 0,

        mb: 1,

        minWidth: 900,

        boxSizing:
          "border-box",
      }}
    >

      {/* ORDER */}

      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Typography
          fontSize={12}
          fontWeight={800}
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {orderNumber}
        </Typography>


        <Typography
          fontSize={10}
          color="text.secondary"
        >
          {formatDate(
            order?.createdAt
          )}
        </Typography>

      </Box>


      {/* MEMBER */}

      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Typography
          fontSize={12}
          fontWeight={700}
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {memberName}
        </Typography>


        <Typography
          fontSize={10}
          color="text.secondary"
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {memberId}
        </Typography>

      </Box>


      {/* AMOUNT */}

      <Typography
        fontSize={12}
        fontWeight={800}
      >
        {money(
          order?.finalAmount
        )}
      </Typography>


      {/* SELLING POINTS */}

      <Typography
        fontSize={12}
        fontWeight={700}
      >
        {number(
          order?.sellingPoints
        )}
      </Typography>


      {/* PAYMENT */}

      <StatusChip
        value={
          paymentStatus
        }
        type="payment"
      />


      {/* ORDER STATUS */}

      <StatusChip
        value={
          orderStatus
        }
      />


      {/* DATE */}

      <Typography
        fontSize={11}
        color="text.secondary"
      >
        {formatDate(
          order?.createdAt
        )}
      </Typography>

    </Box>

  );

};


/* =====================================================
   PAGE
===================================================== */

const Orders = () => {

  const navigate =
    useNavigate();


  const [
    orders,
    setOrders,
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
    paymentFilter,
    setPaymentFilter,
  ] = useState("ALL");


  const [
    orderFilter,
    setOrderFilter,
  ] = useState("ALL");


  /* ===================================================
     LOAD ORDERS
  =================================================== */

  const loadOrders =
    async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await getManagerOrders();


        console.log(
          "MANAGER ORDERS RESPONSE:",
          response
        );


        /*
        =================================================
        SUPPORT BOTH:

        response.data

        AND:

        response.data.data

        =================================================
        */

        const result =
          response?.data?.data ??
          response?.data ??
          response;


        /*
        =================================================
        API MAY RETURN:

        []

        OR:

        {
          orders: []
        }

        =================================================
        */

        let orderList = [];


        if (
          Array.isArray(
            result
          )
        ) {

          orderList =
            result;

        } else if (
          Array.isArray(
            result?.orders
          )
        ) {

          orderList =
            result.orders;

        } else if (
          Array.isArray(
            result?.data
          )
        ) {

          orderList =
            result.data;

        }


        /*
        ================================================
        SAFETY

        Never allow null/object values to
        become an order row.
        ================================================
        */

        setOrders(
          orderList.filter(
            (
              order
            ) =>
              order &&
              typeof order ===
                "object"
          )
        );

      } catch (
        err
      ) {

        console.error(
          "Manager orders error:",
          err
        );


        setError(
          err?.response
            ?.data
            ?.message ||
          err?.message ||
          "Unable to load manager orders."
        );

        setOrders([]);

      } finally {

        setLoading(false);

      }

    };


  useEffect(
    () => {

      loadOrders();

    },
    []
  );


  /* ===================================================
     FILTER
  =================================================== */

  const filteredOrders =
    useMemo(
      () => {

        const searchValue =
          search
            .trim()
            .toLowerCase();


        return orders.filter(
          (
            order
          ) => {

            const orderNumber =
              getOrderNumber(
                order
              ).toLowerCase();


            const memberName =
              getMemberName(
                order
              ).toLowerCase();


            const memberId =
              getMemberId(
                order
              ).toLowerCase();


            const matchesSearch =
              !searchValue ||
              orderNumber.includes(
                searchValue
              ) ||
              memberName.includes(
                searchValue
              ) ||
              memberId.includes(
                searchValue
              );


            const paymentStatus =
              getStatusValue(
                order?.paymentStatus,
                ""
              ).toUpperCase();


            const status =
              getStatusValue(
                order?.status,
                ""
              ).toUpperCase();


            const matchesPayment =
              paymentFilter ===
                "ALL" ||

              (
                paymentFilter ===
                  "PAID" &&
                paymentStatus ===
                  "PAID"
              ) ||

              (
                paymentFilter ===
                  "PENDING" &&
                paymentStatus !==
                  "PAID"
              );


            const matchesOrder =
              orderFilter ===
                "ALL" ||
              status ===
                orderFilter;


            return (
              matchesSearch &&
              matchesPayment &&
              matchesOrder
            );

          }
        );

      },
      [
        orders,
        search,
        paymentFilter,
        orderFilter,
      ]
    );


  /* ===================================================
     SUMMARY
  =================================================== */

  const totalOrders =
    orders.length;


  const paidOrders =
    orders.filter(
      (
        order
      ) =>
        getStatusValue(
          order?.paymentStatus,
          ""
        ).toUpperCase() ===
        "PAID"
    ).length;


  const pendingOrders =
    totalOrders -
    paidOrders;


  const totalSales =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        Number(
          order?.finalAmount ||
          order?.totalAmount ||
          order?.amount ||
          0
        ),
      0
    );


  const totalSellingPoints =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        Number(
          order?.sellingPoints ||
          0
        ),
      0
    );


  const totalCommission =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        Number(
          order?.commission ??
          order?.commissionAmount ??
          0
        ),
      0
    );


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (

      <Box
        sx={{
          minHeight:
            "60vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >

        <CircularProgress
          color="success"
        />

      </Box>

    );

  }


  return (

    <Box
      sx={{
        width: "100%",

        maxWidth: 1600,

        mx: "auto",

        minWidth: 0,

        overflowX: "hidden",

        boxSizing:
          "border-box",
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

          gap: 1,

          mb: 1,
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
                xs: 20,
                sm: 24,
                md: 27,
              },

              fontWeight: 800,

              lineHeight: 1.2,
            }}
          >
            Orders
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
            View orders placed by your managed members.
          </Typography>

        </Box>


        <Button
          variant="outlined"
          color="success"
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            navigate(
              "/manager/dashboard"
            )
          }
          sx={{
            minHeight: 36,

            borderRadius: 0,

            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          Dashboard
        </Button>

      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 1,

            borderRadius: 0,
          }}

          action={

            <Button
              color="inherit"
              size="small"
              onClick={
                loadOrders
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs:
              "repeat(1, minmax(0, 1fr))",

            sm:
              "repeat(2, minmax(0, 1fr))",

            lg:
              "repeat(4, minmax(0, 1fr))",
          },

          gap: {
            xs: 1.3,
            sm: 2,
          },

          mb: 1,
        }}
      >

        <SummaryCard
          title="Total Orders"
          value={
            number(
              totalOrders
            )
          }
          subtitle="Managed member orders"
          icon={
            <ShoppingBagIcon />
          }
        />


        <SummaryCard
          title="Paid Orders"
          value={
            number(
              paidOrders
            )
          }
          subtitle="Successfully paid"
          icon={
            <CheckCircleIcon />
          }
        />


        <SummaryCard
          title="Pending Payment"
          value={
            number(
              pendingOrders
            )
          }
          subtitle="Payment not completed"
          color="#F59E0B"
          icon={
            <PendingIcon />
          }
        />


        <SummaryCard
          title="Total Sales"
          value={
            money(
              totalSales
            )
          }
          subtitle={`${number(
            totalSellingPoints
          )} selling points`}
          icon={
            <TrendingUpIcon />
          }
        />

      </Box>


      {/* =================================================
          COMMISSION SUMMARY
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          mb: 1,

          border:
            "1px solid #2E7D32",

          borderRadius: 0,
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

          <Typography
            fontSize={{
              xs: 15,
              sm: 17,
            }}
            fontWeight={800}
          >
            Commission Overview
          </Typography>


          <Typography
            fontSize={{
              xs: 11,
              sm: 12,
            }}
            color="text.secondary"
            sx={{
              mt: 0.3,
              mb: 1,
            }}
          >
            Commission generated from managed member orders.
          </Typography>


          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs:
                  "1fr 1fr",

                sm:
                  "repeat(3, minmax(0, 1fr))",
              },

              gap: 1,
            }}
          >

            <Box
              sx={{
                p: 1,

                bgcolor:
                  "#F0FDF4",

                borderRadius: 0,

                minWidth: 0,
              }}
            >

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                Total Commission
              </Typography>


              <Typography
                fontSize={{
                  xs: 15,
                  sm: 18,
                }}
                fontWeight={800}
                color="success.main"
              >
                {money(
                  totalCommission
                )}
              </Typography>

            </Box>


            <Box
              sx={{
                p: 1,

                bgcolor:
                  "#F8FAFC",

                borderRadius: 0,

                minWidth: 0,
              }}
            >

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                Orders
              </Typography>


              <Typography
                fontSize={{
                  xs: 15,
                  sm: 18,
                }}
                fontWeight={800}
              >
                {number(
                  totalOrders
                )}
              </Typography>

            </Box>


            <Box
              sx={{
                p: 1,

                bgcolor:
                  "#EFF6FF",

                borderRadius: 0,

                minWidth: 0,

                gridColumn: {
                  xs:
                    "1 / -1",

                  sm:
                    "auto",
                },
              }}
            >

              <Typography
                fontSize={10}
                color="text.secondary"
              >
                Total Sales
              </Typography>


              <Typography
                fontSize={{
                  xs: 15,
                  sm: 18,
                }}
                fontWeight={800}
                color="primary.main"
              >
                {money(
                  totalSales
                )}
              </Typography>

            </Box>

          </Box>

        </CardContent>

      </Card>


      {/* =================================================
          FILTERS
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border:
            "1px solid #2E7D32",

          borderRadius: 0,

          mb: 1,
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
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs:
                  "1fr",

                sm:
                  "repeat(2, minmax(0, 1fr))",

                md:
                  "2fr 1fr 1fr",
              },

              gap: 1,
            }}
          >

            {/* SEARCH */}

            <TextField
              fullWidth
              size="small"
              placeholder="Search order, member name or ID..."
              value={
                search
              }
              onChange={(
                event
              ) =>
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


            {/* PAYMENT */}

            <FormControl
              fullWidth
              size="small"
            >

              <InputLabel>
                Payment
              </InputLabel>

              <Select
                value={
                  paymentFilter
                }
                label="Payment"
                onChange={(
                  event
                ) =>
                  setPaymentFilter(
                    event.target.value
                  )
                }
              >

                <MenuItem
                  value="ALL"
                >
                  All Payments
                </MenuItem>

                <MenuItem
                  value="PAID"
                >
                  Paid
                </MenuItem>

                <MenuItem
                  value="PENDING"
                >
                  Pending
                </MenuItem>

              </Select>

            </FormControl>


            {/* ORDER STATUS */}

            <FormControl
              fullWidth
              size="small"
            >

              <InputLabel>
                Order Status
              </InputLabel>

              <Select
                value={
                  orderFilter
                }
                label="Order Status"
                onChange={(
                  event
                ) =>
                  setOrderFilter(
                    event.target.value
                  )
                }
              >

                <MenuItem
                  value="ALL"
                >
                  All Status
                </MenuItem>

                <MenuItem
                  value="PENDING"
                >
                  Pending
                </MenuItem>

                <MenuItem
                  value="CONFIRMED"
                >
                  Confirmed
                </MenuItem>

                <MenuItem
                  value="PROCESSING"
                >
                  Processing
                </MenuItem>

                <MenuItem
                  value="SHIPPED"
                >
                  Shipped
                </MenuItem>

                <MenuItem
                  value="DELIVERED"
                >
                  Delivered
                </MenuItem>

                <MenuItem
                  value="COMPLETED"
                >
                  Completed
                </MenuItem>

                <MenuItem
                  value="CANCELLED"
                >
                  Cancelled
                </MenuItem>

              </Select>

            </FormControl>

          </Box>

        </CardContent>

      </Card>


      {/* =================================================
          ORDER TITLE
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          gap: 1,

          mb: 1.2,
        }}
      >

        <Typography
          fontSize={{
            xs: 17,
            sm: 19,
          }}
          fontWeight={800}
        >
          Order List
        </Typography>


        <Typography
          fontSize={12}
          color="text.secondary"
        >
          {filteredOrders.length}{" "}
          result
          {filteredOrders.length !==
          1
            ? "s"
            : ""}
        </Typography>

      </Box>


      {/* =================================================
          EMPTY
      ================================================= */}

      {filteredOrders.length ===
      0 ? (

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #2E7D32",

            borderRadius: 0,
          }}
        >

          <CardContent
            sx={{
              py: 2.5,

              textAlign:
                "center",
            }}
          >

            <ShoppingBagIcon
              sx={{
                fontSize: 44,

                color:
                  "text.disabled",

                mb: 1,
              }}
            />


            <Typography
              fontWeight={800}
            >
              No orders found
            </Typography>


            <Typography
              fontSize={12}
              color="text.secondary"
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

              width: "100%",

              overflowX: "auto",

              pb: 1,

              "&::-webkit-scrollbar": {
                height: 6,
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  "#CBD5E1",

                borderRadius: 0,
              },
            }}
          >

            {/* HEADER */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns:
                  "1.2fr 1.5fr 1fr 1fr 1fr 1fr 1fr",

                gap: 1,

                px: 1.5,

                py: 0.8,

                bgcolor:
                  "#F8FAFC",

                border:
                  "1px solid #2E7D32",

                borderRadius: 0,

                mb: 1,

                minWidth: 900,
              }}
            >

              <Typography
                fontSize={11}
              >
                Order
              </Typography>

              <Typography
                fontSize={11}
              >
                Member
              </Typography>

              <Typography
                fontSize={11}
              >
                Amount
              </Typography>

              <Typography
                fontSize={11}
              >
                Selling Points
              </Typography>

              <Typography
                fontSize={11}
              >
                Payment
              </Typography>

              <Typography
                fontSize={11}
              >
                Status
              </Typography>

              <Typography
                fontSize={11}
              >
                Date
              </Typography>

            </Box>


            {filteredOrders.map(
              (
                order,
                index
              ) => (

                <DesktopOrderRow
                  key={
                    safeText(
                      order?._id,
                      `order-${index}`
                    )
                  }
                  order={
                    order
                  }
                />

              )
            )}

          </Box>


          {/* =================================================
              MOBILE / TABLET
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: "grid",
                md: "none",
              },

              gridTemplateColumns: {
                xs:
                  "minmax(0, 1fr)",

                sm:
                  "repeat(2, minmax(0, 1fr))",
              },

              gap: 1,

              width: "100%",
            }}
          >

            {filteredOrders.map(
              (
                order,
                index
              ) => (

                <OrderCard
                  key={
                    safeText(
                      order?._id,
                      `order-${index}`
                    )
                  }
                  order={
                    order
                  }
                />

              )
            )}

          </Box>

        </>

      )}


      {/* =================================================
          READ ONLY
      ================================================= */}

      <Alert
        severity="info"
        sx={{
          mt: 1,

          borderRadius: 0,

          fontSize: {
            xs: 11,
            sm: 13,
          },
        }}
      >
        Manager access is read-only. Orders can be viewed
        but cannot be edited, cancelled or modified from
        this panel.
      </Alert>

    </Box>

  );

};


export default Orders;