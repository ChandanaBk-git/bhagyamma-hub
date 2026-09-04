import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";

import {
  Stars,
  ArrowForwardIos,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const SellingPointCard = ({ summary }) => {

  const navigate = useNavigate();

  const points =
    summary?.sellingPoints || 0;

  const target = 500;

  const progress =
    Math.min((points / target) * 100, 100);


  return (

    <Card
      elevation={0}
      onClick={() =>
        navigate("/member/selling-points")
      }
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

        cursor: "pointer",

        boxSizing: "border-box",

        "&:hover": {
          backgroundColor: "#FAFAFA",
        },
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
            MAIN CONTENT
        ========================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >

          {/* POINTS */}

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                  md: "12px",
                },

                lineHeight: 1.2,
              }}
            >
              Selling Points
            </Typography>


            <Typography
              fontWeight={700}
              sx={{
                mt: {
                  xs: "3px",
                  sm: "4px",
                },

                color: "#292929",

                fontSize: {
                  xs: "22px",
                  sm: "25px",
                  md: "28px",
                },

                lineHeight: 1.05,
              }}
            >
              {points}
            </Typography>

          </Box>


          {/* ICON */}

          <Box
            sx={{
              width: {
                xs: 36,
                sm: 42,
                md: 48,
              },

              height: {
                xs: 36,
                sm: 42,
                md: 48,
              },

              minWidth: {
                xs: 36,
                sm: 42,
                md: 48,
              },

              bgcolor: "#FFF8E1",

              borderRadius: 0,

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              flexShrink: 0,
            }}
          >

            <Stars
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 23,
                  md: 26,
                },

                color: "#F9A825",
              }}
            />

          </Box>

        </Stack>


        {/* ==========================================
            PROGRESS
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

          <Box
            sx={{
              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              mb: "3px",
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
              {points} / {target} SP
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "8px",
                  sm: "9px",
                },

                lineHeight: 1.2,
              }}
            >
              {Math.round(progress)}%
            </Typography>

          </Box>


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
            BOTTOM
        ========================================== */}

        <Box
          mt={{
            xs: "7px",
            sm: "9px",
          }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >

          <Typography
            color="warning.main"
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "9px",
                sm: "10px",
                md: "11px",
              },

              lineHeight: 1.2,

              whiteSpace: "nowrap",

              overflow: "hidden",

              textOverflow: "ellipsis",
            }}
          >
            {target - points > 0
              ? `${target - points} SP Remaining`
              : "Supervisor Achieved"}
          </Typography>


          <ArrowForwardIos
            sx={{
              color: "#F9A825",

              fontSize: {
                xs: 10,
                sm: 11,
                md: 12,
              },

              flexShrink: 0,
            }}
          />

        </Box>

      </CardContent>

    </Card>

  );

};


export default SellingPointCard;