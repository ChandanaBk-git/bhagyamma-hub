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
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",

        mt: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        backgroundColor: "#FFFFFF",

        boxShadow: "none",

        overflow: "hidden",

        boxSizing: "border-box",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
          },
        }}
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >

          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              lineHeight: 1.2,

              color: "#292929",
            }}
          >
            Supervisor Progress
          </Typography>


          <WorkspacePremium
            sx={{
              color: "#F9A825",

              fontSize: {
                xs: 19,
                sm: 22,
                md: 25,
              },

              flexShrink: 0,
            }}
          />

        </Stack>


        {/* ==========================================
            SELLING POINTS
        ========================================== */}

        <Box
          sx={{
            mt: {
              xs: "8px",
              sm: "10px",
              md: "12px",
            },
          }}
        >

          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "9px",
                sm: "10px",
                md: "11px",
              },

              lineHeight: 1.2,
            }}
          >
            Selling Points
          </Typography>


          <Typography
            fontWeight={700}
            sx={{
              mt: "3px",

              fontSize: {
                xs: "19px",
                sm: "22px",
                md: "25px",
              },

              lineHeight: 1.1,

              color: "#292929",
            }}
          >
            {points} / {target}
          </Typography>

        </Box>


        {/* ==========================================
            PROGRESS
        ========================================== */}

        <Box
          sx={{
            mt: {
              xs: "7px",
              sm: "9px",
            },
          }}
        >

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: {
                xs: 5,
                sm: 6,
              },

              borderRadius: 0,

              backgroundColor: "#EEEEEE",

              "& .MuiLinearProgress-bar": {
                borderRadius: 0,
              },
            }}
          />

        </Box>


        {/* ==========================================
            MESSAGE
        ========================================== */}

        <Box
          sx={{
            mt: {
              xs: "7px",
              sm: "9px",
            },
          }}
        >

          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "9px",
                sm: "10px",
                md: "11px",
              },

              lineHeight: 1.3,
            }}
          >
            {isSupervisor
              ? "Congratulations! You are a Supervisor."
              : `${remaining} Selling Points remaining to become Supervisor.`}
          </Typography>

        </Box>


        {/* ==========================================
            DISCOUNT CHIP
        ========================================== */}

        <Box
          sx={{
            mt: {
              xs: "7px",
              sm: "9px",
            },
          }}
        >

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
            size="small"
            sx={{
              height: {
                xs: "22px",
                sm: "24px",
              },

              borderRadius: 0,

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 600,

              "& .MuiChip-icon": {
                fontSize: {
                  xs: 13,
                  sm: 15,
                },

                ml: "5px",
              },

              "& .MuiChip-label": {
                px: {
                  xs: "6px",
                  sm: "7px",
                },
              },
            }}
          />

        </Box>

      </CardContent>

    </Card>

  );

};


export default SupervisorProgress;