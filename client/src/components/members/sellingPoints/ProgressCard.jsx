import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Stack,
  Chip,
} from "@mui/material";

import {
  EmojiEvents,
  TrendingUp,
} from "@mui/icons-material";

const ProgressCard = ({
  summary = {},
}) => {
  // =====================================================
  // SUPERVISOR TARGET
  // =====================================================

  const target = 500;

  // =====================================================
  // SELLING POINTS ACHIEVED
  // =====================================================

  const achieved = Number(
    summary?.sellingPoints || 0
  );

  // =====================================================
  // REMAINING SP
  // =====================================================

  const remaining = Math.max(
    target - achieved,
    0
  );

  // =====================================================
  // PROGRESS %
  // =====================================================

  const percentage = Math.min(
    (achieved / target) * 100,
    100
  );

  const supervisorAchieved =
    achieved >= target;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,

        borderRadius: 0,

        border:
          "1px solid #2E7D32",

        boxShadow: "none",

        background:
          "#FFFFFF",

        transition:
          "border-color 0.2s ease",

        "&:hover": {
          transform: "none",
          boxShadow: "none",
          borderColor:
            "#2E7D32",
        },
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 1,
            sm: 1.5,
          },

          "&:last-child": {
            pb: {
              xs: 1,
              sm: 1.5,
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
          spacing={1}
          mb={1}
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
                  xs: "13px",
                  sm: "16px",
                },

                lineHeight: 1.2,

                fontWeight: 700,

                color:
                  "#1F2937",
              }}
            >
              Supervisor Progress
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                fontSize: {
                  xs: "8px",
                  sm: "10px",
                },

                lineHeight: 1.3,

                color:
                  "text.secondary",
              }}
            >
              Earn 500 Selling Points to become
              a Supervisor
            </Typography>
          </Box>

          <Chip
            icon={
              <EmojiEvents
                sx={{
                  fontSize:
                    "13px !important",
                }}
              />
            }
            label={`${percentage.toFixed(0)}%`}
            size="small"
            color={
              supervisorAchieved
                ? "success"
                : "warning"
            }
            sx={{
              height: 22,

              borderRadius: 0,

              fontSize:
                "8px",

              fontWeight: 700,

              flexShrink: 0,

              "& .MuiChip-label": {
                px: 0.6,
              },
            }}
          />
        </Stack>

        {/* =================================================
            PROGRESS BAR
        ================================================= */}

        <LinearProgress
          variant="determinate"
          value={percentage}
          color={
            supervisorAchieved
              ? "success"
              : "primary"
          }
          sx={{
            height: 6,

            borderRadius: 0,

            mb: 1.2,

            backgroundColor:
              "#E5E7EB",
          }}
        />

        {/* =================================================
            STATS
        ================================================= */}

        <Stack
          direction="row"
          spacing={{
            xs: 0.6,
            sm: 1,
          }}
        >
          {/* TARGET */}

          <Box
            sx={{
              flex: 1,

              minWidth: 0,

              p: {
                xs: 0.7,
                sm: 1,
              },

              border:
                "1px solid #E5E7EB",

              borderLeft:
                "3px solid #1565C0",

              background:
                "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "7px",
                  sm: "9px",
                },

                lineHeight: 1.2,

                color:
                  "text.secondary",
              }}
            >
              Target
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                fontSize: {
                  xs: "12px",
                  sm: "15px",
                },

                lineHeight: 1.1,

                fontWeight: 700,

                color:
                  "#1F2937",
              }}
            >
              {target} SP
            </Typography>
          </Box>

          {/* ACHIEVED */}

          <Box
            sx={{
              flex: 1,

              minWidth: 0,

              p: {
                xs: 0.7,
                sm: 1,
              },

              border:
                "1px solid #E5E7EB",

              borderLeft:
                "3px solid #2E7D32",

              background:
                "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "7px",
                  sm: "9px",
                },

                lineHeight: 1.2,

                color:
                  "text.secondary",
              }}
            >
              Achieved
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                fontSize: {
                  xs: "12px",
                  sm: "15px",
                },

                lineHeight: 1.1,

                fontWeight: 700,

                color:
                  "success.main",
              }}
            >
              {achieved} SP
            </Typography>
          </Box>

          {/* REMAINING */}

          <Box
            sx={{
              flex: 1,

              minWidth: 0,

              p: {
                xs: 0.7,
                sm: 1,
              },

              border:
                "1px solid #E5E7EB",

              borderLeft:
                `3px solid ${
                  remaining === 0
                    ? "#2E7D32"
                    : "#DC2626"
                }`,

              background:
                "#FFFFFF",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "7px",
                  sm: "9px",
                },

                lineHeight: 1.2,

                color:
                  "text.secondary",
              }}
            >
              Remaining
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                fontSize: {
                  xs: "12px",
                  sm: "15px",
                },

                lineHeight: 1.1,

                fontWeight: 700,

                color:
                  remaining === 0
                    ? "success.main"
                    : "error.main",
              }}
            >
              {remaining} SP
            </Typography>
          </Box>
        </Stack>

        {/* =================================================
            BOTTOM STATUS
        ================================================= */}

        <Box
          mt={1}
          display="flex"
          justifyContent="center"
        >
          <Chip
            icon={
              <TrendingUp
                sx={{
                  fontSize:
                    "13px !important",
                }}
              />
            }
            color={
              supervisorAchieved
                ? "success"
                : "primary"
            }
            label={
              supervisorAchieved
                ? "Supervisor Achieved"
                : `${remaining} SP Remaining`
            }
            size="small"
            sx={{
              height: 22,

              borderRadius: 0,

              fontSize:
                "8px",

              fontWeight: 700,

              "& .MuiChip-label": {
                px: 0.7,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;