import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import StarsIcon from "@mui/icons-material/Stars";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { useEffect, useState } from "react";

import API from "../../api";

const SellingPoints = () => {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD SELLING POINTS
  // =====================================================

  useEffect(() => {
    loadSellingPoints();
  }, []);

  const loadSellingPoints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/manager/selling-points"
      );

      console.log(
        "MANAGER SELLING POINT RESPONSE:",
        response
      );

      const result =
        response?.data?.data ||
        response?.data ||
        {};

      console.log(
        "MANAGER SELLING POINT DATA:",
        result
      );

      setData(result);
    } catch (err) {
      console.error(
        "MANAGER SELLING POINT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load Selling Points."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#F5F7FA",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          bgcolor: "#F5F7FA",
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          Selling Points
        </Typography>

        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // =====================================================
  // SUMMARY DATA
  // =====================================================

  const sellingPoints = Number(
    data?.sellingPoints || 0
  );

  const target = Number(
    data?.target || 500
  );

  const lifetimePurchase = Number(
    data?.lifetimePurchase || 0
  );

  const pendingAmount = Number(
    data?.pendingPurchaseAmount || 0
  );

  const remaining = Number(
    data?.remaining ??
      Math.max(
        target - sellingPoints,
        0
      )
  );

  const progress = Math.min(
    Number(
      data?.progress ??
        (sellingPoints / target) * 100
    ),
    100
  );

  const transactions = Array.isArray(
    data?.transactions
  )
    ? data.transactions
    : [];

  const membershipStatus =
    data?.membershipStatus ||
    "Pending";

  const isSupervisor = Boolean(
    data?.isSupervisor
  );

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
    } catch {
      return "-";
    }
  };

  // =====================================================
  // TRANSACTION TITLE
  // =====================================================

  const getTransactionTitle = (
    transaction
  ) => {
    switch (
      transaction?.transactionType
    ) {
      case "MEMBERSHIP_PAYMENT":
        return "Membership Payment";

      case "ORDER_PURCHASE":
        return "Product Purchase";

      case "MEMBERSHIP_ACTIVATED":
        return "Membership Activated";

      case "SUPERVISOR":
        return "Supervisor Achievement";

      default:
        return "Selling Point Transaction";
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: "#F5F7FA",

        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Typography
        component="h1"
        fontWeight={800}
        sx={{
          fontSize: {
            xs: "1.5rem",
            sm: "1.9rem",
            md: "2.3rem",
          },

          color: "#292929",

          mb: 1.5,
        }}
      >
        Selling Points
      </Typography>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },

          gap: 1,
        }}
      >
        {/* CURRENT SELLING POINTS */}

        <Box
          sx={{
            bgcolor: "#FFFFFF",

            borderRadius: 0,

            p: 1.5,

            border: "1px solid #2E7D32",

            boxShadow: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",
            }}
          >
            <Typography
              color="text.secondary"
            >
              Current Selling Points
            </Typography>

            <StarsIcon
              sx={{
                color: "#F9A825",
              }}
            />
          </Box>

          <Typography
            variant="h3"
            fontWeight={800}
            color="success.main"
            mt={1}
          >
            {sellingPoints}
          </Typography>
        </Box>

        {/* CARRY FORWARD */}

        <Box
          sx={{
            bgcolor: "#FFFFFF",

            borderRadius: 0,

            p: 1.5,

            border: "1px solid #2E7D32",

            boxShadow: "none",
          }}
        >
          <Typography
            color="text.secondary"
          >
            Carry Forward
          </Typography>

          <Typography
            variant="h4"
            fontWeight={800}
            mt={1}
            color="warning.main"
          >
            ₹{pendingAmount}
          </Typography>
        </Box>

        {/* MEMBERSHIP */}

        <Box
          sx={{
            bgcolor: "#FFFFFF",

            borderRadius: 0,

            p: 1.5,

            border: "1px solid #2E7D32",

            boxShadow: "none",
          }}
        >
          <Typography
            color="text.secondary"
          >
            Membership
          </Typography>

          <Typography
            variant="h5"
            fontWeight={800}
            mt={1}
            color="success.main"
          >
            {membershipStatus}
          </Typography>
        </Box>
      </Box>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <Box
        sx={{
          bgcolor: "#FFFFFF",

          borderRadius: 0,

          p: {
            xs: 1.25,
            sm: 1.5,
          },

          mt: 1.5,

          border: "1px solid #2E7D32",

          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            mb: 1,

            flexWrap: "wrap",

            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={800}
          >
            Selling Point Progress
          </Typography>

          <Typography
            fontWeight={800}
            color="success.main"
          >
            {sellingPoints} / {target} SP
          </Typography>
        </Box>

        <Box
          sx={{
            height: 12,

            bgcolor: "#E5E7EB",

            borderRadius: 10,

            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,

              height: "100%",

              bgcolor: "#2E7D32",

              borderRadius: 10,

              transition:
                "width 0.5s ease",
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 1,

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            flexWrap: "wrap",

            gap: 1,
          }}
        >
          <Typography
            color="warning.main"
            fontWeight={700}
          >
            {remaining > 0
              ? `${remaining} SP Remaining`
              : "Supervisor Achieved"}
          </Typography>

          {isSupervisor && (
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 0.5,

                color: "success.main",
              }}
            >
              <WorkspacePremiumIcon />

              <Typography
                fontWeight={800}
              >
                Supervisor
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* =================================================
          HISTORY
      ================================================= */}

      <Box
        sx={{
          bgcolor: "#FFFFFF",

          borderRadius: 0,

          mt: 1.5,

          p: {
            xs: 1,
            sm: 1.5,
            md: 1.5,
          },

          border: "1px solid #2E7D32",

          boxShadow: "none",
        }}
      >
        {/* HISTORY HEADER */}

        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            mb: 1,

            flexWrap: "wrap",

            gap: 1,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={800}
          >
            Selling Point History
          </Typography>

          <Box
            sx={{
              bgcolor: "#E8F5E9",

              color: "#2E7D32",

              px: 1.5,

              py: 0.6,

              borderRadius: 3,

              fontSize: 13,

              fontWeight: 800,
            }}
          >
            {transactions.length} Records
          </Box>
        </Box>

        {/* =================================================
            NO TRANSACTIONS
        ================================================= */}

        {transactions.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              borderRadius: 2,
            }}
          >
            No Selling Point transactions
            found.
          </Alert>
        ) : (
          <Box
            sx={{
              display: "flex",

              flexDirection:
                "column",

              gap: 1,
            }}
          >
            {transactions.map(
              (
                transaction,
                index
              ) => {
                // =================================================
                // POINTS
                // =================================================

                const points = Number(
                  transaction
                    ?.pointsEarned ||
                    transaction
                      ?.sellingPoints ||
                    0
                );

                // =================================================
                // DELIVERY CHARGE
                //
                // First try populated order.
                // Then transaction itself.
                // =================================================

                const deliveryCharge =
                  Number(
                    transaction?.order
                      ?.deliveryCharge ??
                      transaction
                        ?.deliveryCharge ??
                      0
                  );

                // =================================================
                // ACTUAL ORDER TOTAL
                //
                // IMPORTANT:
                //
                // transaction.purchaseAmount
                // can be ₹489 because backend
                // stores SP eligible amount.
                //
                // The actual customer-paid amount
                // is order.finalAmount = ₹539.
                // =================================================

                const actualPurchaseAmount =
                  Number(
                    transaction?.order
                      ?.finalAmount ??
                      transaction
                        ?.finalAmount ??
                      (
                        Number(
                          transaction
                            ?.purchaseAmount ||
                            0
                        ) +
                        deliveryCharge
                      )
                  );

                // =================================================
                // SP ELIGIBLE AMOUNT
                //
                // ₹539 - ₹50 = ₹489
                //
                // Delivery charge is NEVER included
                // in SP calculation.
                // =================================================

                const spEligibleAmount =
                  Math.max(
                    0,

                    actualPurchaseAmount -
                      deliveryCharge
                  );

                // =================================================
                // PREVIOUS CARRY FORWARD
                // =================================================

                const previousCarry =
                  Number(
                    transaction
                      ?.previousPendingAmount ??
                      transaction
                        ?.previousCarryForward ??
                      0
                  );

                // =================================================
                // TOTAL FOR SP CALCULATION
                // =================================================

                const totalForCalculation =
                  spEligibleAmount +
                  previousCarry;

                // =================================================
                // COMPLETE ₹100 BLOCKS
                // =================================================

                const completeBlocks =
                  Math.floor(
                    totalForCalculation /
                      100
                  );

                // =================================================
                // SP RATE
                // =================================================

                const spRate =
                  "₹100 = 2 SP";

                // =================================================
                // REMAINING CARRY FORWARD
                //
                // If backend already provides
                // pendingAmount, use it.
                // Otherwise calculate it.
                // =================================================

                const remainingCarryForward =
                  Number(
                    transaction
                      ?.pendingAmount ??
                      transaction
                        ?.remainingCarryForward ??
                      (
                        totalForCalculation %
                        100
                      )
                  );

                // =================================================
                // BEFORE / AFTER
                // =================================================

                const sellingPointsBefore =
                  Number(
                    transaction
                      ?.sellingPointsBefore ??
                      0
                  );

                const sellingPointsAfter =
                  Number(
                    transaction
                      ?.sellingPointsAfter ??
                      (
                        sellingPointsBefore +
                        points
                      )
                  );

                return (
                  <Box
                    key={
                      transaction?._id ||
                      index
                    }
                    sx={{
                      border:
                        "1px solid #2E7D32",

                      borderRadius: 0,

                      p: {
                        xs: 1,
                        sm: 1.25,
                      },

                      bgcolor: "#FAFAFA",
                    }}
                  >
                    {/* =========================================
                        TRANSACTION HEADER
                    ========================================= */}

                    <Box
                      sx={{
                        display: "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "flex-start",

                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          fontWeight={800}
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1.2rem",
                            },
                          }}
                        >
                          {getTransactionTitle(
                            transaction
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {transaction?.order
                            ?.orderNumber ||
                            transaction
                              ?.orderNumber ||
                            "Order --"}
                        </Typography>
                      </Box>

                      <Typography
                        fontWeight={900}
                        color="success.main"
                        sx={{
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        +{points} SP
                      </Typography>
                    </Box>

                    {/* =========================================
                        ORDER SP CALCULATION
                    ========================================= */}

                    {transaction?.transactionType ===
                      "ORDER_PURCHASE" && (
                      <Box
                        sx={{
                          mt: 2,

                          p: {
                            xs: 1.25,
                            sm: 1.5,
                          },

                          borderRadius: 0,

                          border: "1px solid #2E7D32",

                          bgcolor: "#F1F8F3",
                        }}
                      >
                        <Typography
                          fontWeight={800}
                          mb={2}
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1.15rem",
                            },
                          }}
                        >
                          SP Calculation
                        </Typography>

                        {/* =================================
                            PURCHASE AMOUNT
                        ================================= */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent:
                              "space-between",

                            mb: 0.75,

                            gap: 1,
                          }}
                        >
                          <Typography>
                            Purchase Amount
                          </Typography>

                          <Typography
                            fontWeight={700}
                          >
                            ₹
                            {
                              actualPurchaseAmount
                            }
                          </Typography>
                        </Box>

                        {/* =================================
                            DELIVERY CHARGE
                        ================================= */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent:
                              "space-between",

                            mb: 0.75,

                            gap: 1,
                          }}
                        >
                          <Typography>
                            Delivery Charge
                          </Typography>

                          <Typography
                            fontWeight={700}
                          >
                            ₹
                            {
                              deliveryCharge
                            }
                          </Typography>
                        </Box>

                        {/* =================================
                            SP ELIGIBLE AMOUNT
                        ================================= */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent:
                              "space-between",

                            mb: 0.75,

                            gap: 1,
                          }}
                        >
                          <Typography
                            fontWeight={800}
                          >
                            SP Eligible Amount
                          </Typography>

                          <Typography
                            fontWeight={900}
                            color="success.main"
                          >
                            ₹
                            {
                              spEligibleAmount
                            }
                          </Typography>
                        </Box>

                        {/* =================================
                            DIVIDER
                        ================================= */}

                        <Box
                          sx={{
                            borderTop:
                              "1px solid #D7E5DA",

                            mb: 1.5,
                          }}
                        />

                        {/* =================================
                            SP RATE
                        ================================= */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent:
                              "space-between",

                            mb: 0.75,

                            gap: 1,
                          }}
                        >
                          <Typography>
                            SP Rate
                          </Typography>

                          <Typography
                            fontWeight={700}
                          >
                            {spRate}
                          </Typography>
                        </Box>

                        {/* =================================
                            SP EARNED
                        ================================= */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent:
                              "space-between",

                            mb: 0.75,

                            gap: 1,
                          }}
                        >
                          <Typography>
                            Selling Points Earned
                          </Typography>

                          <Typography
                            fontWeight={900}
                            color="success.main"
                          >
                            {points} SP
                          </Typography>
                        </Box>

                        {/* =================================
                            CARRY FORWARD
                        ================================= */}

                        <Box
                          sx={{
                            display: "flex",

                            justifyContent:
                              "space-between",

                            gap: 2,
                          }}
                        >
                          <Typography>
                            Remaining Carry Forward
                          </Typography>

                          <Typography
                            fontWeight={900}
                            color="warning.main"
                          >
                            ₹
                            {
                              remainingCarryForward
                            }
                          </Typography>
                        </Box>

                        {/* =================================
                            NOTE
                        ================================= */}

                        <Box
                          sx={{
                            mt: 2,

                            pt: 1.5,

                            borderTop:
                              "1px solid #D7E5DA",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Note: Delivery
                            charge ₹
                            {
                              deliveryCharge
                            }{" "}
                            excluded from SP
                            calculation.
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* =========================================
                        MEMBERSHIP PAYMENT
                    ========================================= */}

                    {transaction?.transactionType ===
                      "MEMBERSHIP_PAYMENT" && (
                      <Box
                        sx={{
                          mt: 2,

                          p: 1.25,

                          borderRadius: 0,

                          border: "1px solid #2E7D32",

                          bgcolor: "#F1F8F3",
                        }}
                      >
                        <Typography
                          fontWeight={800}
                        >
                          ₹2,000 Membership
                          Payment
                        </Typography>

                        <Typography
                          color="text.secondary"
                          mt={0.5}
                        >
                          40 Selling Points
                          awarded
                        </Typography>
                      </Box>
                    )}

                    {/* =========================================
                        BALANCE + DATE
                    ========================================= */}

                    <Box
                      sx={{
                        mt: 2,

                        display: "flex",

                        justifyContent:
                          "space-between",

                        flexWrap: "wrap",

                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        SP Balance:{" "}
                        {
                          sellingPointsBefore
                        }{" "}
                        →{" "}
                        {
                          sellingPointsAfter
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Date:{" "}
                        {formatDate(
                          transaction?.createdAt
                        )}
                      </Typography>
                    </Box>

                    {/* =========================================
                        REMARKS
                    ========================================= */}

                    {transaction?.remarks && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={1}
                      >
                        {
                          transaction.remarks
                        }
                      </Typography>
                    )}
                  </Box>
                );
              }
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SellingPoints;