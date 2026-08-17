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

const ProgressCard = ({ summary = {} }) => {
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
      elevation={2}
      sx={{
        mb: 3,
        borderRadius: 4,
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
          mb={3}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
            >
              Supervisor Progress
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Earn 500 Selling Points to become
              a Supervisor
            </Typography>
          </Box>

          <Chip
            icon={<EmojiEvents />}
            label={`${percentage.toFixed(0)}%`}
            color={
              supervisorAchieved
                ? "success"
                : "warning"
            }
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
            height: 12,
            borderRadius: 6,
            mb: 3,
          }}
        />

        {/* =================================================
            STATS
        ================================================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={3}
        >
          {/* TARGET */}

          <Box flex={1}>
            <Typography
              color="text.secondary"
            >
              Target
            </Typography>

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              {target} SP
            </Typography>
          </Box>

          {/* ACHIEVED */}

          <Box flex={1}>
            <Typography
              color="text.secondary"
            >
              Achieved
            </Typography>

            <Typography
              variant="h6"
              color="success.main"
              fontWeight="bold"
            >
              {achieved} SP
            </Typography>
          </Box>

          {/* REMAINING */}

          <Box flex={1}>
            <Typography
              color="text.secondary"
            >
              Remaining
            </Typography>

            <Typography
              variant="h6"
              color={
                remaining === 0
                  ? "success.main"
                  : "error.main"
              }
              fontWeight="bold"
            >
              {remaining} SP
            </Typography>
          </Box>
        </Stack>

        {/* =================================================
            BOTTOM STATUS
        ================================================= */}

        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          <Chip
            icon={<TrendingUp />}
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
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;