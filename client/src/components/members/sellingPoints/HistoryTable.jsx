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

const money = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN")}`;
};

const numberValue = (value) => {
  return Number(value || 0);
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

const getTransactionTitle = (transactionType) => {
  switch (transactionType) {
    case "MEMBERSHIP_PAYMENT":
      return "Membership Payment";

    case "MEMBERSHIP_ACTIVATED":
      return "Membership Activated";

    case "SUPERVISOR":
      return "Supervisor Promotion";

    case "SUPERVISOR_REWARD":
      return "Supervisor Reward";

    case "ORDER_PURCHASE":
    default:
      return "Product Purchase";
  }
};

const getTransactionIcon = (transactionType) => {
  switch (transactionType) {
    case "MEMBERSHIP_PAYMENT":
    case "MEMBERSHIP_ACTIVATED":
      return (
        <CardMembership
          sx={{
            fontSize: 18,
            color: "#2E7D32",
          }}
        />
      );

    case "SUPERVISOR":
    case "SUPERVISOR_REWARD":
      return (
        <WorkspacePremium
          sx={{
            fontSize: 18,
            color: "#2E7D32",
          }}
        />
      );

    default:
      return (
        <ShoppingBag
          sx={{
            fontSize: 18,
            color: "#2E7D32",
          }}
        />
      );
  }
};

/* =====================================================
   DETAIL COMPONENT
===================================================== */

const Detail = ({ label, value }) => {
  return (
    <Box
      sx={{
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: {
            xs: "0.62rem",
            sm: "0.68rem",
          },

          color: "text.secondary",

          lineHeight: 1.2,

          mb: 0.2,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: {
            xs: "0.72rem",
            sm: "0.78rem",
          },

          fontWeight: 600,

          color: "#292929",

          lineHeight: 1.25,

          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

/* =====================================================
   MEMBERSHIP ACTIVATION CARD
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

        boxSizing: "border-box",

        p: {
          xs: 1,
          sm: 1.25,
        },
      }}
    >
      {/* ================================================
          TOP ROW
      ================================================= */}

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
              width: 30,

              height: 30,

              minWidth: 30,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              border: "1px solid #A5D6A7",

              backgroundColor: "#E8F5E9",
            }}
          >
            <CardMembership
              sx={{
                fontSize: 18,

                color: "#2E7D32",
              }}
            />
          </Box>

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "0.73rem",
                  sm: "0.8rem",
                },

                lineHeight: 1.2,
              }}
            >
              Membership Activated
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.2,

                fontSize: {
                  xs: "0.6rem",
                  sm: "0.67rem",
                },

                lineHeight: 1.2,
              }}
            >
              {formatDate(date)}
            </Typography>
          </Box>
        </Stack>

        {/* <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "0.85rem",
              sm: "0.95rem",
            },

            color: "#2E7D32",

            whiteSpace: "nowrap",
          }}
        >
          +0 SP
        </Typography> */}
      </Stack>

      {/* ================================================
          ACTIVATION MESSAGE
      ================================================= */}

      <Box
        sx={{
          mt: 1,

          borderTop: "1px solid #C8E6C9",

          pt: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "0.72rem",
              sm: "0.78rem",
            },

            fontWeight: 600,

            color: "#2E7D32",

            lineHeight: 1.4,
          }}
        >
          ✓ Membership activated successfully
        </Typography>

        {/* <Typography
          sx={{
            mt: 0.25,

            fontSize: {
              xs: "0.65rem",
              sm: "0.7rem",
            },

            color: "text.secondary",

            lineHeight: 1.4,
          }}
        >
          After reaching 40 Selling Points.
        </Typography> */}
      </Box>
    </Box>
  );
};

/* =====================================================
   HISTORY TABLE
===================================================== */

const HistoryTable = ({ history = [] }) => {
  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (
    !Array.isArray(history) ||
    history.length === 0
  ) {
    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",

          borderRadius: "0 !important",

          border: "1px solid #2E7D32",

          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1.25,
              sm: 1.5,
            },

            "&:last-child": {
              pb: {
                xs: 1.25,
                sm: 1.5,
              },
            },
          }}
        >
          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
            }}
          >
            Selling Point History
          </Typography>

          <Box
            sx={{
              py: {
                xs: 3,
                sm: 4,
              },

              textAlign: "center",
            }}
          >
            <Stars
              sx={{
                fontSize: {
                  xs: 35,
                  sm: 42,
                },

                color: "#A5D6A7",

                mb: 0.75,
              }}
            />

            <Typography
              fontWeight={600}
              sx={{
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.85rem",
                },
              }}
            >
              No Selling Points Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.35,

                fontSize: {
                  xs: "0.68rem",
                  sm: "0.75rem",
                },
              }}
            >
              Purchase products to earn Selling Points.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  /* =====================================================
     HISTORY CARD
  ===================================================== */

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",

        borderRadius: "0 !important",

        border: "1px solid #2E7D32",

        boxShadow: "none",

        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 1,
            sm: 1.25,
            md: 1.5,
          },

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            mb: {
              xs: 1,
              sm: 1.25,
            },
          }}
        >
          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
            }}
          >
            Selling Point History
          </Typography>

          <Chip
            label={`${history.length} Records`}
            size="small"
            sx={{
              height: 23,

              borderRadius: 0,

              fontSize: {
                xs: "0.62rem",
                sm: "0.68rem",
              },

              backgroundColor: "#E8F5E9",

              color: "#2E7D32",

              fontWeight: 600,
            }}
          />
        </Stack>

        {/* =================================================
            TRANSACTIONS
        ================================================= */}

        <Stack spacing={1}>
          {history.map((item, index) => {
            const transactionType =
              item?.transactionType ||
              "ORDER_PURCHASE";

            /*
             * Membership activation is displayed
             * separately and does NOT show the
             * purchase calculation again.
             */

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

            /* =============================================
               PRODUCT / OTHER TRANSACTION DATA
            ============================================= */

            const pointsEarned =
              numberValue(
                item?.pointsEarned ??
                  item?.points
              );

            const purchaseAmount =
              numberValue(
                item?.purchaseAmount
              );

            const previousPending =
              numberValue(
                item?.previousPendingAmount
              );

            const totalAmount =
              numberValue(
                item?.totalAmount ??
                  item?.calculationTotal
              );

            const completedBlocks =
              numberValue(
                item?.completedBlocks
              );

            const eligibleAmount =
              numberValue(
                item?.eligibleAmount ??
                  item?.calculationEligibleAmount ??
                  item?.spEligibleAmount
              );

            const pendingAmount =
              numberValue(
                item?.pendingAmount ??
                  item?.calculationRemainingCarry ??
                  item?.spCarryForward
              );

            const previousSP =
              numberValue(
                item?.sellingPointsBefore
              );

            const afterSP =
              numberValue(
                item?.sellingPointsAfter
              );

            const lifetimePurchase =
              numberValue(
                item?.lifetimePurchase
              );

            const deliveryCharge =
              numberValue(
                item?.deliveryCharge
              );

            const orderNumber =
              item?.order?.orderNumber ||
              item?.orderNumber ||
              item?.orderId ||
              "--";

            const title =
              getTransactionTitle(
                transactionType
              );

            const date =
              item?.createdAt ||
              item?.date ||
              item?.updatedAt;

            const transactionId =
              item?._id ||
              `transaction-${index}`;

            /* =============================================
               PRODUCT PURCHASE CARD
            ============================================= */

            return (
              <Box
                key={transactionId}
                sx={{
                  width: "100%",

                  border:
                    "1px solid #E0E0E0",

                  borderRadius:
                    "0 !important",

                  backgroundColor:
                    "#FFFFFF",

                  boxSizing:
                    "border-box",

                  p: {
                    xs: 1,
                    sm: 1.25,
                  },
                }}
              >
                {/* ======================================
                    TOP ROW
                ====================================== */}

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
                        width: 30,

                        height: 30,

                        minWidth: 30,

                        display:
                          "flex",

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
                        fontWeight={700}
                        sx={{
                          fontSize: {
                            xs: "0.73rem",
                            sm: "0.8rem",
                          },

                          lineHeight: 1.2,

                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",

                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {title}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          mt: 0.2,

                          fontSize: {
                            xs: "0.6rem",
                            sm: "0.67rem",
                          },

                          lineHeight: 1.2,
                        }}
                      >
                        {formatDate(date)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "0.85rem",
                        sm: "0.95rem",
                      },

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
                    my: 1,
                  }}
                />

                {/* ======================================
                    BASIC ORDER INFORMATION
                ====================================== */}

                <Box
                  sx={{
                    display:
                      "grid",

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
                    label="Order"
                    value={orderNumber}
                  />

                  <Detail
                    label="Purchase Amount"
                    value={money(
                      purchaseAmount
                    )}
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
                  />
                </Box>

                <Divider
                  sx={{
                    my: 1,
                  }}
                />

                {/* ======================================
                    SELLING POINT CALCULATION
                ====================================== */}

                <Typography
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "0.7rem",
                      sm: "0.75rem",
                    },

                    color: "#292929",

                    mb: 0.75,
                  }}
                >
                  Selling Point Calculation
                </Typography>

                <Box
                  sx={{
                    display:
                      "grid",

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
                      previousPending
                    )}
                  />

                  <Detail
                    label="Calculation Total"
                    value={money(
                      totalAmount
                    )}
                  />

                  <Detail
                    label="₹100 Blocks"
                    value={
                      completedBlocks
                    }
                  />

                  <Detail
                    label="Points Earned"
                    value={`${pointsEarned} SP`}
                  />

                  <Detail
                    label="Remaining Carry"
                    value={money(
                      pendingAmount
                    )}
                  />
                </Box>

                <Divider
                  sx={{
                    my: 1,
                  }}
                />

                {/* ======================================
                    SP BALANCE
                ====================================== */}

                <Box
                  sx={{
                    display:
                      "grid",

                    gridTemplateColumns: {
                      xs:
                        "repeat(3, minmax(0, 1fr))",

                      sm:
                        "repeat(3, minmax(0, 1fr))",
                    },

                    gap: 1,
                  }}
                >
                  <Detail
                    label="SP Before"
                    value={`${previousSP} SP`}
                  />

                  <Detail
                    label="SP Earned"
                    value={`+${pointsEarned} SP`}
                  />

                  <Detail
                    label="SP After"
                    value={`${afterSP} SP`}
                  />
                </Box>

                <Divider
                  sx={{
                    my: 1,
                  }}
                />

                {/* ======================================
                    LIFETIME PURCHASE
                ====================================== */}

                <Box
                  sx={{
                    display:
                      "grid",

                    gridTemplateColumns: {
                      xs:
                        "repeat(2, minmax(0, 1fr))",

                      sm:
                        "repeat(2, minmax(0, 1fr))",
                    },

                    gap: 1,
                  }}
                >
                  <Detail
                    label="Lifetime Purchase"
                    value={money(
                      lifetimePurchase
                    )}
                  />

                  <Detail
                    label="Transaction Type"
                    value={
                      transactionType
                    }
                  />
                </Box>

                {/* ======================================
                    REMARKS
                ====================================== */}

                {item?.remarks && (
                  <Box
                    sx={{
                      mt: 1,
                    }}
                  >
                    <Detail
                      label="Remarks"
                      value={
                        item.remarks
                      }
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HistoryTable;