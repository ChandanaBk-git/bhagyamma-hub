import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  CurrencyRupee,
  ArrowForwardIos,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const CommissionCard = ({
  wallet,
  summary,
}) => {

  const navigate = useNavigate();


  return (

    <Card
      elevation={0}
      onClick={() =>
        navigate("/member/commission")
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

        cursor: "pointer",

        boxShadow: "none",

        overflow: "hidden",

        transition: "background-color 0.2s ease",

        "&:hover": {
          backgroundColor: "#FAFAFA",
        },
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "10px",
            sm: "13px",
            md: "16px",
          },

          "&:last-child": {
            pb: {
              xs: "10px",
              sm: "13px",
              md: "16px",
            },
          },
        }}
      >

        {/* ==========================================
            MAIN COMMISSION
        ========================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >

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
                  xs: "11px",
                  sm: "12px",
                  md: "13px",
                },

                lineHeight: 1.2,
              }}
            >
              Commission
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

                lineHeight: 1.1,

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",
              }}
            >
              ₹
              {Number(
                wallet?.totalCommission || 0
              ).toLocaleString("en-IN")}
            </Typography>

          </Box>


          {/* COMMISSION ICON */}

          <Box
            sx={{
              width: {
                xs: 38,
                sm: 44,
                md: 50,
              },

              height: {
                xs: 38,
                sm: 44,
                md: 50,
              },

              minWidth: {
                xs: 38,
                sm: 44,
                md: 50,
              },

              bgcolor: "#E3F2FD",

              borderRadius: 0,

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              flexShrink: 0,
            }}
          >

            <CurrencyRupee
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 23,
                  md: 26,
                },

                color: "#1976D2",
              }}
            />

          </Box>

        </Stack>


        {/* ==========================================
            DIVIDER
        ========================================== */}

        <Divider
          sx={{
            my: {
              xs: "8px",
              sm: "10px",
              md: "12px",
            },
          }}
        />


        {/* ==========================================
            WALLET / WITHDRAWN
        ========================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >

          <Box
            sx={{
              minWidth: 0,
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
              Wallet Balance
            </Typography>


            <Typography
              fontWeight={600}
              sx={{
                mt: "2px",

                fontSize: {
                  xs: "13px",
                  sm: "14px",
                  md: "15px",
                },

                lineHeight: 1.2,

                whiteSpace: "nowrap",
              }}
            >
              ₹
              {Number(
                wallet?.balance || 0
              ).toLocaleString("en-IN")}
            </Typography>

          </Box>


          <Box
            textAlign="right"
            sx={{
              minWidth: 0,
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
              Withdrawn
            </Typography>


            <Typography
              fontWeight={600}
              sx={{
                mt: "2px",

                fontSize: {
                  xs: "13px",
                  sm: "14px",
                  md: "15px",
                },

                lineHeight: 1.2,

                whiteSpace: "nowrap",
              }}
            >
              ₹
              {Number(
                wallet?.totalWithdrawn || 0
              ).toLocaleString("en-IN")}
            </Typography>

          </Box>

        </Stack>


        {/* ==========================================
            VIEW COMMISSION
        ========================================== */}

        <Box
          mt={{
            xs: "9px",
            sm: "11px",
            md: "13px",
          }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            sx={{
              color: "#1976D2",

              fontWeight: 600,

              fontSize: {
                xs: "10px",
                sm: "11px",
                md: "12px",
              },

              lineHeight: 1.2,
            }}
          >
            View Commission
          </Typography>


          <ArrowForwardIos
            sx={{
              color: "#1976D2",

              fontSize: {
                xs: 11,
                sm: 12,
                md: 13,
              },
            }}
          />

        </Box>

      </CardContent>

    </Card>

  );

};


export default CommissionCard;