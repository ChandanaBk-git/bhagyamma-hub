import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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

/* =====================================================
   SUMMARY ITEM
===================================================== */

const SummaryItem = ({
  title,
  value,
  icon,
  iconColor,
  iconBg,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",

        minHeight: {
          xs: 70,
          sm: 78,
        },

        boxSizing: "border-box",

        p: {
          xs: 0.9,
          sm: 1.1,
        },

        borderRadius: 0,

        border: `1px solid ${iconColor}`,

        borderLeft: `3px solid ${iconColor}`,

        backgroundColor: "#FFFFFF",

        display: "flex",

        alignItems: "center",

        gap: {
          xs: 0.75,
          sm: 0.9,
        },

        boxShadow: "none",

        overflow: "hidden",
      }}
    >
      {/* ICON */}

      <Box
        sx={{
          width: {
            xs: 28,
            sm: 32,
          },

          height: {
            xs: 28,
            sm: 32,
          },

          minWidth: {
            xs: 28,
            sm: 32,
          },

          backgroundColor: iconBg,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          flexShrink: 0,

          borderRadius: 0,

          "& svg": {
            fontSize: {
              xs: 16,
              sm: 18,
            },

            color: iconColor,
          },
        }}
      >
        {icon}
      </Box>

      {/* TEXT */}

      <Box
        sx={{
          minWidth: 0,

          flex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "8px",
              sm: "9px",
            },

            lineHeight: 1.2,

            color: "#616161",

            fontWeight: 500,

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,

            fontSize: {
              xs: "14px",
              sm: "16px",
            },

            lineHeight: 1.15,

            color: "#292929",

            fontWeight: 700,

            overflow: "hidden",

            textOverflow: "ellipsis",

            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

/* =====================================================
   CALCULATION ITEM
===================================================== */

const CalculationItem = ({
  label,
  value,
  color = "#292929",
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
            sm: "13px",
          },

          lineHeight: 1.2,

          fontWeight: 700,

          color,

          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

/* =====================================================
   SUMMARY CARD
===================================================== */

const SummaryCard = ({
  summary = {},
  latestTransaction = null,
}) => {
  const {
    sellingPoints = 0,
    lifetimePurchase = 0,
    isSupervisor = false,
    remainingTarget = 0,
    pendingPurchaseAmount = 0,
  } = summary;

  /* ===================================================
     LATEST TRANSACTION
  =================================================== */

  const transaction =
    latestTransaction || null;

  /*
   * Backend is the source of truth.
   *
   * We use stored transaction values first.
   * We do NOT recalculate SP differently here.
   */

  const previousCarry = numberValue(
    transaction?.previousPendingAmount ??
      transaction?.previousCarryForward ??
      transaction?.spPreviousCarryForward
  );

  const eligibleAmount = numberValue(
    transaction?.eligibleAmount ??
      transaction?.calculationEligibleAmount ??
      transaction?.spEligibleAmount
  );

  const calculationTotal = numberValue(
    transaction?.totalAmount ??
      transaction?.calculationTotal ??
      transaction?.spCalculationTotal
  );

  const completedBlocks = numberValue(
    transaction?.completedBlocks ??
      transaction?.spCompletedBlocks
  );

  const pointsEarned = numberValue(
    transaction?.pointsEarned ??
      transaction?.points ??
      transaction?.sellingPoints
  );

  const remainingCarry = numberValue(
    transaction?.pendingAmount ??
      transaction?.calculationRemainingCarry ??
      transaction?.remainingCarryForward ??
      transaction?.spCarryForward ??
      pendingPurchaseAmount
  );

  const pointsBefore = numberValue(
    transaction?.sellingPointsBefore
  );

  const pointsAfter =
    transaction?.sellingPointsAfter !==
    undefined
      ? numberValue(
          transaction?.sellingPointsAfter
        )
      : pointsBefore + pointsEarned;

  /* ===================================================
     SUMMARY CARDS
  =================================================== */

  const cards = [
    {
      title: "Selling Points",

      value: sellingPoints,

      icon: <StarIcon />,

      iconColor: "#2E7D32",

      iconBg: "#E8F5E9",
    },

    {
      title: "Carry Forward",

      value: money(
        pendingPurchaseAmount
      ),

      icon: <TrendingUpIcon />,

      iconColor: "#EF6C00",

      iconBg: "#FFF3E8",
    },

    {
      title: "Lifetime Purchase",

      value: money(
        lifetimePurchase
      ),

      icon: <ShoppingCartIcon />,

      iconColor: "#1976D2",

      iconBg: "#EAF2FF",
    },

    {
      title: "Supervisor",

      value: isSupervisor
        ? "YES"
        : "NO",

      icon: <EmojiEventsIcon />,

      iconColor: "#7B1FA2",

      iconBg: "#F5E8FA",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",

        mb: 1.25,
      }}
    >
      {/* =================================================
          SIMPLE SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",

            sm: "repeat(4, minmax(0, 1fr))",
          },

          gap: {
            xs: 0.8,
            sm: 1,
          },

          width: "100%",
        }}
      >
        {cards.map((card) => (
          <SummaryItem
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconColor={card.iconColor}
            iconBg={card.iconBg}
          />
        ))}
      </Box>

      {/* =================================================
          LATEST CALCULATION
      ================================================= */}

      {transaction && (
        <Paper
          elevation={0}
          sx={{
            width: "100%",

            mt: 1,

            p: {
              xs: 1,
              sm: 1.15,
            },

            boxSizing: "border-box",

            borderRadius: 0,

            border: "1px solid #2E7D32",

            backgroundColor: "#FFFFFF",

            boxShadow: "none",
          }}
        >
          {/* HEADER */}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "13px",
                  },

                  fontWeight: 700,

                  color: "#292929",

                  lineHeight: 1.2,
                }}
              >
                Latest SP Calculation
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
                Carry-forward calculation
              </Typography>
            </Box>

            <Typography
              sx={{
                px: 0.65,

                py: 0.3,

                fontSize: {
                  xs: "8px",
                  sm: "9px",
                },

                fontWeight: 700,

                color: "#2E7D32",

                backgroundColor: "#E8F5E9",

                border: "1px solid #A5D6A7",

                whiteSpace: "nowrap",
              }}
            >
              ₹100 = 2 SP
            </Typography>
          </Stack>

          <Divider
            sx={{
              my: 0.9,
            }}
          />

          {/* CALCULATION VALUES */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",

                sm: "repeat(5, minmax(0, 1fr))",
              },

              gap: {
                xs: 0.9,
                sm: 1,
              },
            }}
          >
            <CalculationItem
              label="Previous Carry"
              value={money(previousCarry)}
              color="#EF6C00"
            />

            <CalculationItem
              label="SP Eligible Amount"
              value={money(eligibleAmount)}
              color="#2E7D32"
            />

            <CalculationItem
              label="Calculation Total"
              value={money(calculationTotal)}
            />

            <CalculationItem
              label="₹100 Blocks"
              value={completedBlocks}
            />

            <CalculationItem
              label="SP Earned"
              value={`+${pointsEarned} SP`}
              color="#2E7D32"
            />
          </Box>

          <Divider
            sx={{
              my: 0.9,
            }}
          />

          {/* FORMULA */}

          <Box
            sx={{
              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              flexWrap: "wrap",

              gap: 0.5,

              py: 0.55,

              px: 0.5,

              backgroundColor: "#F7FAF7",

              border: "1px solid #E0E0E0",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                },

                fontWeight: 700,

                color: "#EF6C00",
              }}
            >
              {money(previousCarry)}
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
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                },

                fontWeight: 700,

                color: "#2E7D32",
              }}
            >
              {money(eligibleAmount)}
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
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },

                fontWeight: 800,

                color: "#292929",
              }}
            >
              {money(calculationTotal)}
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
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                },

                fontWeight: 700,

                color: "#292929",
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
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },

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

          {/* FINAL RESULT */}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",

              gap: 1,
            }}
          >
            <CalculationItem
              label="Remaining Carry"
              value={money(remainingCarry)}
              color="#EF6C00"
            />

            <CalculationItem
              label="SP Before"
              value={`${pointsBefore} SP`}
            />

            <CalculationItem
              label="SP After"
              value={`${pointsAfter} SP`}
              color="#2E7D32"
            />
          </Box>

          {/* EXPLANATION */}

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
            Previous carry is added to the SP
            eligible amount. Every complete ₹100
            earns 2 SP. The unused amount remains
            as carry forward for the next purchase.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SummaryCard;