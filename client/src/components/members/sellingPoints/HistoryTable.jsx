import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  ShoppingBag,
  Stars,
  CardMembership,
  WorkspacePremium,
} from "@mui/icons-material";

/* =====================================================
   HELPERS
===================================================== */

const numberValue = (value) => {
  return Number(value || 0);
};

const money = (value) => {
  return `₹${numberValue(value).toLocaleString(
    "en-IN"
  )}`;
};

const formatDate = (value) => {
  if (!value) {
    return "--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =====================================================
   TRANSACTION TITLE
===================================================== */

const getTransactionTitle = (
  transactionType
) => {
  switch (transactionType) {
    case "MEMBERSHIP_PAYMENT":
      return "Membership Payment";

    case "MEMBERSHIP_ACTIVATED":
      return "Membership Activated";

    case "SUPERVISOR":
      return "Supervisor Achievement";

    case "SUPERVISOR_REWARD":
      return "Supervisor Reward";

    case "ORDER_PURCHASE":
      return "Product Purchase";

    default:
      return "Selling Point Transaction";
  }
};

/* =====================================================
   TRANSACTION ICON
===================================================== */

const getTransactionIcon = (
  transactionType
) => {
  switch (transactionType) {
    case "MEMBERSHIP_PAYMENT":
    case "MEMBERSHIP_ACTIVATED":
      return (
        <CardMembership
          sx={{
            fontSize: 17,
            color: "#2E7D32",
          }}
        />
      );

    case "SUPERVISOR":
    case "SUPERVISOR_REWARD":
      return (
        <WorkspacePremium
          sx={{
            fontSize: 17,
            color: "#2E7D32",
          }}
        />
      );

    default:
      return (
        <ShoppingBag
          sx={{
            fontSize: 17,
            color: "#2E7D32",
          }}
        />
      );
  }
};

/* =====================================================
   DETAIL
===================================================== */

const Detail = ({
  label,
  value,
  valueColor = "#292929",
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: "8px",
            sm: "9px",
          },

          lineHeight: 1.2,

          color: "#757575",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.25,

          fontSize: {
            xs: "11px",
            sm: "12px",
          },

          lineHeight: 1.25,

          fontWeight: 700,

          color: valueColor,

          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

/* =====================================================
   MEMBERSHIP ACTIVATION
===================================================== */

const MembershipActivatedCard = ({
  item,
}) => {
  const date =
    item?.createdAt ||
    item?.date ||
    item?.updatedAt;

  return (
    <Box
      sx={{
        width: "100%",

        border: "1px solid #C8E6C9",

        backgroundColor: "#F1F8F2",

        p: {
          xs: 1,
          sm: 1.15,
        },

        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 29,

              height: 29,

              minWidth: 29,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              border:
                "1px solid #A5D6A7",

              backgroundColor:
                "#E8F5E9",
            }}
          >
            <CardMembership
              sx={{
                fontSize: 17,
                color: "#2E7D32",
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "11px",
                  sm: "12px",
                },

                fontWeight: 700,
              }}
            >
              Membership Activated
            </Typography>

            <Typography
              sx={{
                mt: 0.2,

                fontSize: {
                  xs: "8px",
                  sm: "9px",
                },

                color: "#757575",
              }}
            >
              {formatDate(date)}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 0.9,

          pt: 0.8,

          borderTop:
            "1px solid #C8E6C9",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "9px",
              sm: "10px",
            },

            fontWeight: 600,

            color: "#2E7D32",
          }}
        >
          ✓ Membership activated successfully
        </Typography>
      </Box>
    </Box>
  );
};

/* =====================================================
   HISTORY TABLE
===================================================== */

const HistoryTable = ({
  history = [],
}) => {
  /* ===================================================
     EMPTY
  =================================================== */

  if (
    !Array.isArray(history) ||
    history.length === 0
  ) {
    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",

          borderRadius:
            "0 !important",

          border:
            "1px solid #2E7D32",

          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{
            p: 1.25,

            "&:last-child": {
              pb: 1.25,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
              },

              fontWeight: 700,
            }}
          >
            Selling Point History
          </Typography>

          <Box
            sx={{
              py: 3,

              textAlign: "center",
            }}
          >
            <Stars
              sx={{
                fontSize: 35,

                color: "#A5D6A7",

                mb: 0.5,
              }}
            />

            <Typography
              sx={{
                fontSize: "11px",

                fontWeight: 600,
              }}
            >
              No Selling Points Yet
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                fontSize: "9px",

                color: "#757575",
              }}
            >
              Purchase products to earn Selling Points.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  /* ===================================================
     HISTORY
  =================================================== */

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",

        borderRadius:
          "0 !important",

        border:
          "1px solid #2E7D32",

        boxShadow: "none",

        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 1,
            sm: 1.25,
          },

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.25,
            },
          },
        }}
      >
        {/* HEADER */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
              },

              fontWeight: 700,
            }}
          >
            Selling Point History
          </Typography>

          <Chip
            label={`${history.length} Records`}
            size="small"
            sx={{
              height: 21,

              borderRadius: 0,

              fontSize: "8px",

              backgroundColor:
                "#E8F5E9",

              color: "#2E7D32",

              fontWeight: 700,

              "& .MuiChip-label": {
                px: 0.65,
              },
            }}
          />
        </Stack>

        {/* TRANSACTIONS */}

        <Stack spacing={0.9}>
          {history.map(
            (item, index) => {
              const transactionType =
                item?.transactionType ||
                "ORDER_PURCHASE";

              /* =========================================
                 MEMBERSHIP ACTIVATED
              ========================================= */

              if (
                transactionType ===
                "MEMBERSHIP_ACTIVATED"
              ) {
                return (
                  <MembershipActivatedCard
                    key={
                      item?._id ||
                      `membership-${index}`
                    }
                    item={item}
                  />
                );
              }

              /* =========================================
                 BASIC DATA
              ========================================= */

              const pointsEarned =
                numberValue(
                  item?.pointsEarned ??
                    item?.points ??
                    item?.sellingPoints
                );

              const orderNumber =
                item?.order?.orderNumber ||
                item?.orderNumber ||
                "--";

              const date =
                item?.createdAt ||
                item?.date ||
                item?.updatedAt;

              /* =========================================
                 ORDER DATA

                 IMPORTANT:
                 Backend values are preferred.
                 Frontend does NOT create a new SP
                 calculation.
              ========================================= */

              const order =
                item?.order || {};

              const productAmount =
                numberValue(
                  order?.subtotal ??
                    item?.productAmount ??
                    item?.subtotal ??
                    item?.purchaseAmount
                );

              const discount =
                numberValue(
                  order?.discount ??
                    item?.discount
                );

              const deliveryCharge =
                numberValue(
                  order?.deliveryCharge ??
                    item?.deliveryCharge
                );

              /*
               * THIS IS THE IMPORTANT VALUE.
               *
               * Backend stored SP eligible amount
               * is the source of truth.
               */

              const eligibleAmount =
                numberValue(
                  item?.eligibleAmount ??
                    item?.calculationEligibleAmount ??
                    item?.spEligibleAmount ??
                    order?.spEligibleAmount
                );

              const previousCarry =
                numberValue(
                  item?.previousPendingAmount ??
                    item?.previousCarryForward ??
                    item?.spPreviousCarryForward
                );

              const calculationTotal =
                numberValue(
                  item?.totalAmount ??
                    item?.calculationTotal ??
                    item?.spCalculationTotal ??
                    (
                      eligibleAmount +
                      previousCarry
                    )
                );

              const completedBlocks =
                numberValue(
                  item?.completedBlocks ??
                    item?.spCompletedBlocks
                );

              const remainingCarry =
                numberValue(
                  item?.pendingAmount ??
                    item?.calculationRemainingCarry ??
                    item?.remainingCarryForward ??
                    item?.spCarryForward
                );

              const pointsBefore =
                numberValue(
                  item?.sellingPointsBefore
                );

              const pointsAfter =
                item?.sellingPointsAfter !==
                undefined
                  ? numberValue(
                      item?.sellingPointsAfter
                    )
                  : pointsBefore +
                    pointsEarned;

              /* =========================================
                 PRODUCT PURCHASE CARD
              ========================================= */

              return (
                <Box
                  key={
                    item?._id ||
                    `transaction-${index}`
                  }
                  sx={{
                    width: "100%",

                    border:
                      "1px solid #2E7D32",

                    backgroundColor:
                      "#FFFFFF",

                    p: {
                      xs: 1,
                      sm: 1.15,
                    },

                    boxSizing:
                      "border-box",
                  }}
                >
                  {/* ===================================
                      HEADER
                  =================================== */}

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 29,

                          height: 29,

                          minWidth: 29,

                          display: "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          border:
                            "1px solid #A5D6A7",

                          backgroundColor:
                            "#E8F5E9",
                        }}
                      >
                        {getTransactionIcon(
                          transactionType
                        )}
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "11px",
                              sm: "12px",
                            },

                            fontWeight: 700,

                            lineHeight: 1.2,
                          }}
                        >
                          {getTransactionTitle(
                            transactionType
                          )}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.2,

                            fontSize: {
                              xs: "8px",
                              sm: "9px",
                            },

                            color: "#757575",
                          }}
                        >
                          {orderNumber} •{" "}
                          {formatDate(date)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography
                      sx={{
                        fontSize: {
                          xs: "12px",
                          sm: "14px",
                        },

                        fontWeight: 800,

                        color: "#2E7D32",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      +{pointsEarned} SP
                    </Typography>
                  </Stack>

                  <Divider
                    sx={{
                      my: 0.9,
                    }}
                  />

                  {/* ===================================
                      PURCHASE BREAKDOWN
                  =================================== */}

                  <Typography
                    sx={{
                      mb: 0.7,

                      fontSize: {
                        xs: "9px",
                        sm: "10px",
                      },

                      fontWeight: 700,

                      color: "#292929",
                    }}
                  >
                    Purchase Breakdown
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs:
                          "repeat(2, minmax(0, 1fr))",

                        sm:
                          "repeat(4, minmax(0, 1fr))",
                      },

                      gap: {
                        xs: 0.9,
                        sm: 1,
                      },
                    }}
                  >
                    <Detail
                      label="Product Amount"
                      value={money(
                        productAmount
                      )}
                    />

                    <Detail
                      label="Discount"
                      value={`-${money(
                        discount
                      )}`}
                      valueColor="#D32F2F"
                    />

                    <Detail
                      label="Delivery Charge"
                      value={money(
                        deliveryCharge
                      )}
                    />

                    <Detail
                      label="SP Eligible Amount"
                      value={money(
                        eligibleAmount
                      )}
                      valueColor="#2E7D32"
                    />
                  </Box>

                  <Divider
                    sx={{
                      my: 0.9,
                    }}
                  />

                  {/* ===================================
                      SP CALCULATION
                  =================================== */}

                  <Typography
                    sx={{
                      mb: 0.7,

                      fontSize: {
                        xs: "9px",
                        sm: "10px",
                      },

                      fontWeight: 700,

                      color: "#292929",
                    }}
                  >
                    Selling Point Calculation
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs:
                          "repeat(2, minmax(0, 1fr))",

                        sm:
                          "repeat(5, minmax(0, 1fr))",
                      },

                      gap: {
                        xs: 0.9,
                        sm: 1,
                      },
                    }}
                  >
                    <Detail
                      label="Previous Carry"
                      value={money(
                        previousCarry
                      )}
                      valueColor="#EF6C00"
                    />

                    <Detail
                      label="SP Eligible"
                      value={money(
                        eligibleAmount
                      )}
                      valueColor="#2E7D32"
                    />

                    <Detail
                      label="Calculation Total"
                      value={money(
                        calculationTotal
                      )}
                    />

                    <Detail
                      label="₹100 Blocks"
                      value={
                        completedBlocks
                      }
                    />

                    <Detail
                      label="SP Earned"
                      value={`${pointsEarned} SP`}
                      valueColor="#2E7D32"
                    />
                  </Box>

                  {/* ===================================
                      FORMULA
                  =================================== */}

                  <Box
                    sx={{
                      mt: 0.9,

                      px: 0.6,

                      py: 0.55,

                      backgroundColor:
                        "#F7FAF7",

                      border:
                        "1px solid #E0E0E0",

                      display: "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      flexWrap: "wrap",

                      gap: 0.45,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "9px",

                        fontWeight: 700,

                        color: "#EF6C00",
                      }}
                    >
                      {money(
                        previousCarry
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: "#757575",
                      }}
                    >
                      +
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9px",

                        fontWeight: 700,

                        color: "#2E7D32",
                      }}
                    >
                      {money(
                        eligibleAmount
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: "#757575",
                      }}
                    >
                      =
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "10px",

                        fontWeight: 800,

                        color: "#292929",
                      }}
                    >
                      {money(
                        calculationTotal
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: "#757575",
                      }}
                    >
                      →
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9px",

                        fontWeight: 700,
                      }}
                    >
                      {completedBlocks} × ₹100
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: "#757575",
                      }}
                    >
                      →
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "10px",

                        fontWeight: 800,

                        color: "#2E7D32",
                      }}
                    >
                      +{pointsEarned} SP
                    </Typography>
                  </Box>

                  <Divider
                    sx={{
                      my: 0.9,
                    }}
                  />

                  {/* ===================================
                      SP BEFORE / AFTER
                  =================================== */}

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",

                      gap: 1,
                    }}
                  >
                    <Detail
                      label="SP Before"
                      value={`${pointsBefore} SP`}
                    />

                    <Detail
                      label="SP Earned"
                      value={`+${pointsEarned} SP`}
                      valueColor="#2E7D32"
                    />

                    <Detail
                      label="SP After"
                      value={`${pointsAfter} SP`}
                      valueColor="#2E7D32"
                    />
                  </Box>

                  <Divider
                    sx={{
                      my: 0.9,
                    }}
                  />

                  {/* ===================================
                      REMAINING CARRY
                  =================================== */}

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",

                      gap: 1,
                    }}
                  >
                    <Detail
                      label="Remaining Carry Forward"
                      value={money(
                        remainingCarry
                      )}
                      valueColor="#EF6C00"
                    />

                    <Detail
                      label="Transaction Type"
                      value={
                        transactionType
                      }
                    />
                  </Box>

                  {/* ===================================
                      EXPLANATION
                  =================================== */}

                  <Typography
                    sx={{
                      mt: 0.9,

                      fontSize: {
                        xs: "8px",
                        sm: "9px",
                      },

                      lineHeight: 1.35,

                      color: "#757575",
                    }}
                  >
                    SP is calculated from the product
                    amount after discount and delivery
                    charge. Every complete ₹100 earns
                    2 SP. The unused amount continues
                    as carry forward.
                  </Typography>
                </Box>
              );
            }
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HistoryTable;