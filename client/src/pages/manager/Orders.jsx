import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import {
  getManagerOrders,
} from "../../services/manager.service";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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

  const isGuest =
    String(
      order?.orderType ||
      ""
    ).toUpperCase() ===
    "GUEST";

  return (
    // Guest orders store the customer directly on the Order.
    safeText(
      order?.customerName,
      ""
    ) ||

    safeText(
      order?.deliveryDetails?.name,
      ""
    ) ||

    // Member orders use the populated userId.
    safeText(
      order?.userId?.name,
      ""
    ) ||

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

    (isGuest
      ? "Guest Customer"
      : "Not Available")
  );

};


/* =====================================================
   MEMBER ID
===================================================== */

const getMemberId = (
  order
) => {

  const isGuest =
    String(
      order?.orderType ||
      ""
    ).toUpperCase() ===
    "GUEST";

  if (isGuest) {
    return "GUEST";
  }

  return (
    safeText(
      order?.userId?.userId,
      ""
    ) ||

    safeText(
      order?.userId?.memberId,
      ""
    ) ||

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
      order?.memberId,
      ""
    ) ||

    safeText(
      order?.userId,
      ""
    ) ||

    "-"
  );

};

/* =====================================================
   MEMBER CONTACT DETAILS
===================================================== */

const getMemberEmail = (
  order
) => {

  return (
    safeText(
      order?.customerEmail,
      ""
    ) ||

    safeText(
      order?.userId?.email,
      ""
    ) ||

    safeText(
      order?.member?.email,
      ""
    ) ||

    safeText(
      order?.user?.email,
      ""
    ) ||

    safeText(
      order?.customer?.email,
      ""
    ) ||

    "-"
  );

};

const getMemberMobile = (
  order
) => {

  return (
    safeText(
      order?.customerMobile,
      ""
    ) ||

    safeText(
      order?.deliveryDetails?.mobile,
      ""
    ) ||

    safeText(
      order?.userId?.mobile,
      ""
    ) ||

    safeText(
      order?.member?.mobile,
      ""
    ) ||

    safeText(
      order?.user?.mobile,
      ""
    ) ||

    safeText(
      order?.customer?.mobile,
      ""
    ) ||

    safeText(
      order?.customer?.phone,
      ""
    ) ||

    "-"
  );

};


/* =====================================================
   PACKAGING HELPERS
===================================================== */

const getPackaging = (order) => {
  return (
    order?.packaging ||
    order?.packagingAssignment ||
    {}
  );
};

const getPackagingTeam = (order) => {
  const packaging = getPackaging(order);

  return (
    safeText(packaging?.teamName, "") ||
    safeText(packaging?.name, "") ||
    safeText(packaging?.loginId, "") ||
    "Unassigned"
  );
};

const getPackagingStatus = (order) => {
  const packaging = getPackaging(order);

  return getStatusValue(
    packaging?.status,
    "UNASSIGNED"
  );
};

const getOrderItemCount = (order) => {
  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  return items.reduce(
    (total, item) =>
      total +
      Number(
        item?.quantity ||
        item?.qty ||
        1
      ),
    0
  );
};

const getOrderItems = (order) => {
  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  return items;
};

const getItemName = (item) => {
  return (
    safeText(
      item?.productName,
      ""
    ) ||
    safeText(
      item?.productId?.productName,
      ""
    ) ||
    safeText(
      item?.productId?.name,
      ""
    ) ||
    safeText(
      item?.name,
      ""
    ) ||
    "Product"
  );
};

const getItemQuantity = (item) => {
  const quantity =
    Number(
      item?.quantity ??
      item?.qty ??
      1
    );

  return Number.isFinite(quantity)
    ? quantity
    : 1;
};

const getPackagingBranch = (order) => {
  const packaging = getPackaging(order);

  return (
    safeText(
      packaging?.branchName,
      ""
    ) || "-"
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
  status === "SUCCESSFUL" ||
  status === "PACKED" ||
  status === "READY_FOR_DISPATCH" ||
  status === "DISPATCHED"
) {
  color = "success";
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

  const [itemsOpen, setItemsOpen] =
    useState(false);

  const orderItems =
    getOrderItems(order);

  const orderNumber =
    getOrderNumber(order);

  const memberName =
    getMemberName(order);

  const memberId =
    getMemberId(order);

  const memberMobile =
    getMemberMobile(order);

  const memberEmail =
    getMemberEmail(order);

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

  const packagingTeam =
    getPackagingTeam(order);

  const packagingStatus =
    getPackagingStatus(order);

  const itemCount =
    getOrderItemCount(order);

  const branch =
    getPackagingBranch(order);

  const rowSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "38% 62%",
      sm: "34% 66%",
    },
    minWidth: 0,
    borderBottom: "1px solid #E2E8F0",
  };

  const labelSx = {
    px: {
      xs: 1,
      sm: 1.25,
    },
    py: {
      xs: 0.65,
      sm: 0.8,
    },
    fontSize: {
      xs: 9.5,
      sm: 10.5,
    },
    color: "#475569",
    backgroundColor: "#F1F5F9",
    borderRight: "1px solid #E2E8F0",
    lineHeight: 1.25,
  };

  const valueSx = {
    px: {
      xs: 1,
      sm: 1.25,
    },
    py: {
      xs: 0.65,
      sm: 0.8,
    },
    fontSize: {
      xs: 10.5,
      sm: 11.5,
    },
    color: "#172033",
    fontWeight: 600,
    minWidth: 0,
    overflowWrap: "anywhere",
    lineHeight: 1.3,
    backgroundColor: "#FFFFFF",
  };

  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",
        minWidth: 0,
        border: "1px solid #CBD5E1",
        borderRadius: 1.2,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >

      {/* ORDER HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: {
            xs: 1,
            sm: 1.25,
          },
          py: {
            xs: 0.85,
            sm: 1,
          },
          borderBottom: "1px solid #CBD5E1",
          minWidth: 0,
        }}
      >

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >

          <Typography
            fontSize={{
              xs: 11.5,
              sm: 13,
            }}
            fontWeight={800}
            sx={{
              overflowWrap: "anywhere",
              lineHeight: 1.2,
            }}
          >
            {orderNumber}
          </Typography>

          <Typography
            fontSize={{
              xs: 9,
              sm: 10,
            }}
            color="text.secondary"
          >
            {formatDate(order?.createdAt)}
          </Typography>

        </Box>

        <StatusChip
          value={orderStatus}
        />

      </Box>


      {/* DETAILS TABLE */}

      <Box
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >

        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            {String(
              order?.orderType ||
              ""
            ).toUpperCase() === "GUEST"
              ? "Customer"
              : "Member"}
          </Typography>

          <Box sx={valueSx}>
            <Typography
              component="div"
              sx={{
                fontSize: "inherit",
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              {memberName}
            </Typography>

            {memberId !== "-" && (
              <Typography
                component="div"
                sx={{
                  mt: 0.15,
                  fontSize: 9.5,
                  color: "text.secondary",
                  overflowWrap: "anywhere",
                }}
              >
                ID: {memberId}
              </Typography>
            )}
          </Box>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Order Type
          </Typography>

          <Typography sx={valueSx}>
            {String(
              order?.orderType ||
              "MEMBER"
            ).toUpperCase()}
          </Typography>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Mobile
          </Typography>

          <Typography sx={valueSx}>
            {memberMobile}
          </Typography>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Email
          </Typography>

          <Typography sx={valueSx}>
            {memberEmail}
          </Typography>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Items
          </Typography>

          <Box
            sx={{
              ...valueSx,
              py: 0.5,
            }}
          >
            <Button
              type="button"
              onClick={() =>
                setItemsOpen(
                  (previous) =>
                    !previous
                )
              }
              endIcon={
                itemsOpen ? (
                  <ExpandLessIcon
                    sx={{
                      fontSize:
                        17,
                    }}
                  />
                ) : (
                  <ExpandMoreIcon
                    sx={{
                      fontSize:
                        17,
                    }}
                  />
                )
              }
              sx={{
                p: 0,
                minWidth: 0,
                minHeight: 0,
                justifyContent: "flex-start",
                textTransform: "none",
                color: "#172033",
                fontWeight: 700,
                fontSize: 11,
                lineHeight: 1.2,
                backgroundColor: "transparent !important",
                boxShadow: "none !important",
                border: "none !important",
                borderRadius: 0,
                "&:hover": {
                  backgroundColor: "transparent !important",
                  boxShadow: "none",
                },
                "&:focus": {
                  backgroundColor: "transparent !important",
                  boxShadow: "none",
                },
                "&:active": {
                  backgroundColor: "transparent !important",
                  boxShadow: "none",
                },
              }}
            >
              {number(itemCount)}{" "}
              {itemCount === 1
                ? "item"
                : "items"}
            </Button>

            {itemsOpen && (
              <Box
                sx={{
                  mt: 0.7,
                  p: 0.8,
                  border:
                    "1px solid #E2E8F0",
                  borderRadius: 1,
                  backgroundColor:
                    "#F8FAFC",
                }}
              >
                {orderItems.length ===
                0 ? (
                  <Typography
                    fontSize={9.5}
                    color="text.secondary"
                  >
                    No items found
                  </Typography>
                ) : (
                  orderItems.map(
                    (
                      item,
                      itemIndex
                    ) => (
                      <Box
                        key={
                          item?._id ||
                          `${itemIndex}-${getItemName(
                            item
                          )}`
                        }
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "flex-start",
                          justifyContent:
                            "space-between",
                          gap: 0.8,
                          py: 0.55,
                          borderBottom:
                            itemIndex <
                            orderItems.length -
                              1
                              ? "1px solid #E2E8F0"
                              : "none",
                        }}
                      >
                        <Typography
                          fontSize={9.5}
                          fontWeight={700}
                          sx={{
                            minWidth: 0,
                            overflowWrap:
                              "anywhere",
                            lineHeight:
                              1.3,
                          }}
                        >
                          {getItemName(
                            item
                          )}
                        </Typography>

                        <Typography
                          fontSize={9.5}
                          color="text.secondary"
                          fontWeight={700}
                          sx={{
                            flexShrink: 0,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          Qty:{" "}
                          {getItemQuantity(
                            item
                          )}
                        </Typography>
                      </Box>
                    )
                  )
                )}
              </Box>
            )}
          </Box>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Total
          </Typography>

          <Typography
            sx={{
              ...valueSx,
              fontWeight: 800,
            }}
          >
            {money(
              order?.finalAmount ??
              order?.totalAmount ??
              order?.amount
            )}
          </Typography>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Payment
          </Typography>

          <Box sx={valueSx}>
            <StatusChip
              value={paymentStatus}
              type="payment"
            />
          </Box>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Packaging Team
          </Typography>

          <Box sx={valueSx}>
            <Typography
              component="div"
              sx={{
                fontSize: "inherit",
                fontWeight: 700,
                overflowWrap: "anywhere",
              }}
            >
              {packagingTeam}
            </Typography>

            {branch !== "-" && (
              <Typography
                component="div"
                sx={{
                  mt: 0.15,
                  fontSize: 9.5,
                  color: "text.secondary",
                  overflowWrap: "anywhere",
                }}
              >
                Branch: {branch}
              </Typography>
            )}
          </Box>
        </Box>


        <Box sx={rowSx}>
          <Typography sx={labelSx}>
            Package Status
          </Typography>

          <Box sx={valueSx}>
            <StatusChip
              value={packagingStatus}
            />
          </Box>
        </Box>


        <Box
          sx={{
            ...rowSx,
            borderBottom: "none",
          }}
        >
          <Typography
            sx={{
              ...labelSx,
              borderBottom: "none",
            }}
          >
            Order Status
          </Typography>

          <Box
            sx={{
              ...valueSx,
              borderBottom: "none",
            }}
          >
            <StatusChip
              value={orderStatus}
            />
          </Box>
        </Box>

      </Box>

    </Card>

  );

};


/* =====================================================
   DESKTOP ORDER ROW
===================================================== */


const DesktopOrderRow = ({
  order,
}) => {

  const [itemsOpen, setItemsOpen] =
    useState(false);

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

  const packagingTeam =
    getPackagingTeam(order);

  const packagingStatus =
    getPackagingStatus(order);

  const itemCount =
    getOrderItemCount(order);

  const orderItems =
    getOrderItems(order);

  const branch =
    getPackagingBranch(order);


  return (

    <Box
      sx={{
        display: "grid",

        gridTemplateColumns:
          "1.3fr 1.5fr 1.1fr 0.9fr 0.9fr 1.3fr 1.3fr 1.1fr 0.9fr",

        gap: 1,

        alignItems: "start",

        px: 1.5,

        py: 1,

        border:
          "1px solid #2E7D32",

        borderRadius: 0,

        mb: 1,

        minWidth: 1200,

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


      {/* CUSTOMER / MEMBER */}

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


      {/* ITEMS */}

      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Button
          type="button"
          onClick={() =>
            setItemsOpen(
              (previous) =>
                !previous
            )
          }
          endIcon={
            itemsOpen ? (
              <ExpandLessIcon
                sx={{
                  fontSize: 18,
                }}
              />
            ) : (
              <ExpandMoreIcon
                sx={{
                  fontSize: 18,
                }}
              />
            )
          }
          sx={{
            p: 0,
            minWidth: 0,
            minHeight: 0,
            justifyContent:
              "flex-start",
            textTransform:
              "none",
            color: "#172033",
            fontWeight: 700,
            fontSize: 11,
            lineHeight: 1.2,
            "&:hover": {
              bgcolor:
                "transparent",
            },
          }}
        >
          {number(itemCount)}{" "}
          {itemCount === 1
            ? "item"
            : "items"}
        </Button>


        {itemsOpen && (
          <Box
            sx={{
              mt: 0.8,
              p: 0.8,
              width: "100%",
              boxSizing:
                "border-box",
              border:
                "1px solid #E2E8F0",
              borderRadius: 1,
              backgroundColor:
                "#F8FAFC",
            }}
          >

            {orderItems.length ===
            0 ? (
              <Typography
                fontSize={9.5}
                color="text.secondary"
              >
                No items found
              </Typography>
            ) : (
              orderItems.map(
                (
                  item,
                  itemIndex
                ) => (
                  <Box
                    key={
                      item?._id ||
                      `${itemIndex}-${getItemName(
                        item
                      )}`
                    }
                    sx={{
                      display: "flex",
                      alignItems:
                        "flex-start",
                      justifyContent:
                        "space-between",
                      gap: 0.8,
                      py: 0.6,
                      borderBottom:
                        itemIndex <
                        orderItems.length -
                          1
                          ? "1px solid #E2E8F0"
                          : "none",
                    }}
                  >

                    <Typography
                      fontSize={9.5}
                      fontWeight={700}
                      sx={{
                        minWidth: 0,
                        overflowWrap:
                          "anywhere",
                        lineHeight:
                          1.3,
                      }}
                    >
                      {getItemName(
                        item
                      )}
                    </Typography>


                    <Typography
                      fontSize={9.5}
                      color="text.secondary"
                      fontWeight={700}
                      sx={{
                        flexShrink: 0,
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Qty:{" "}
                      {getItemQuantity(
                        item
                      )}
                    </Typography>

                  </Box>
                )
              )
            )}

          </Box>
        )}

      </Box>


      {/* TOTAL */}

      <Typography
        fontSize={12}
        fontWeight={800}
        sx={{
          pt: 0.4,
        }}
      >
        {money(
          order?.finalAmount
        )}
      </Typography>


      {/* PAYMENT */}

      <StatusChip
        value={
          paymentStatus
        }
        type="payment"
      />


      {/* PACKAGING TEAM */}

      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Typography
          fontSize={11}
          fontWeight={700}
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {packagingTeam}
        </Typography>


        <Typography
          fontSize={9}
          color="text.secondary"
          sx={{
            overflowWrap:
              "anywhere",
          }}
        >
          {branch}
        </Typography>

      </Box>


      {/* PACKAGE STATUS */}

      <StatusChip
        value={
          packagingStatus
        }
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
        sx={{
          pt: 0.4,
        }}
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
  // Manager Orders intentionally shows the complete order list.
  const filteredOrders = orders;



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
        boxSizing: "border-box",
        px: {
          xs: 0.5,
          sm: 1,
          md: 0,
        },
      }}
    >

      {/* =================================================
          ORDERS HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.2,
          width: "100%",
          minWidth: 0,
        }}
      >
        <Typography
          fontSize={{
            xs: 20,
            sm: 24,
          }}
          fontWeight={800}
        >
          Orders
        </Typography>

        <Typography
          fontSize={{
            xs: 11,
            sm: 12,
          }}
          color="text.secondary"
          fontWeight={600}
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          {filteredOrders.length}{" "}
          {filteredOrders.length === 1
            ? "order"
            : "orders"}
        </Typography>
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
                  "1.3fr 1.5fr 1.1fr 0.9fr 0.9fr 1.3fr 1.3fr 1.1fr 0.9fr",

                gap: 1,

                px: 1.5,

                py: 0.8,

                bgcolor:
                  "#F8FAFC",

                border:
                  "1px solid #2E7D32",

                borderRadius: 0,

                mb: 1,

                minWidth: 1200,
              }}
            >

              <Typography fontSize={11} fontWeight={700}>
                Order
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
                Customer
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
                Items
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
                Total
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
                Payment
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
                Packaging Team
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
                Package Status
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
                Order Status
              </Typography>

              <Typography fontSize={11} fontWeight={700}>
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

                md:
                  "repeat(2, minmax(0, 1fr))",
              },

              gap: {
                xs: 0.7,
                sm: 1.1,
              },

              width: "100%",
              minWidth: 0,
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

    </Box>

  );

};


export default Orders;