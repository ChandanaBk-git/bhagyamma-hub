import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  WorkspacePremium,
  LocalOffer,
} from "@mui/icons-material";

const SupervisorProgress = ({ summary }) => {

  const points =
    summary?.sellingPoints || 0;

  const target = 500;

  const progress =
    Math.min((points / target) * 100, 100);

  const remaining =
    Math.max(target - points, 0);

  const isSupervisor =
    summary?.currentRank === "SUPERVISOR";

  return (

    <Card
      elevation={2}
      sx={{
        mt: 3,
        borderRadius: 4,
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Supervisor Progress
          </Typography>

          <WorkspacePremium
            sx={{
              color: "#F9A825",
            }}
          />

        </Stack>

        <Typography
          mt={3}
          color="text.secondary"
        >
          Selling Points
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {points} / {target}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mt: 2,
            height: 12,
            borderRadius: 10,
          }}
        />

        <Box mt={2}>

          <Typography
            color="text.secondary"
          >
            {isSupervisor
              ? "Congratulations! You are a Supervisor."
              : `${remaining} Selling Points remaining to become Supervisor.`}
          </Typography>

        </Box>

        <Box mt={3}>

          <Chip
            color={
              isSupervisor
                ? "success"
                : "warning"
            }
            icon={<LocalOffer />}
            label={
              isSupervisor
                ? "50% Discount Activated"
                : "Unlock 50% Product Discount"
            }
          />

        </Box>

      </CardContent>

    </Card>

  );

};

export default SupervisorProgress;