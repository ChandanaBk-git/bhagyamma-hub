import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
} from "@mui/material";

import {
  AccountBalanceWallet,
  ArrowForwardIos,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const WalletCard = ({ wallet }) => {

  const navigate = useNavigate();


  return (

    <Card
      elevation={0}
      onClick={() => navigate("/member/wallet")}
      sx={{
        width: "100%",

        mt: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        boxShadow: "none",

        backgroundColor: "#FFFFFF",

        cursor: "pointer",

        transition: "0.2s",

        "&:hover": {
          borderColor: "#2E7D32",
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

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >

          {/* WALLET INFORMATION */}

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
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "20px",
                  sm: "23px",
                  md: "27px",
                },

                lineHeight: 1.15,

                mt: "3px",

                color: "#292929",
              }}
            >
              ₹{wallet?.balance || 0}
            </Typography>


            <Typography
              color="success.main"
              sx={{
                fontSize: {
                  xs: "9px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.2,

                mt: "4px",
              }}
            >
              Available Balance
            </Typography>

          </Box>


          {/* WALLET ICON */}

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

              borderRadius: 0,

              bgcolor: "#E8F5E9",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              flexShrink: 0,
            }}
          >

            <AccountBalanceWallet
              sx={{
                color: "#2E7D32",

                fontSize: {
                  xs: 21,
                  sm: 25,
                  md: 29,
                },
              }}
            />

          </Box>

        </Stack>


        {/* VIEW WALLET */}

        <Box
          mt={{
            xs: 1,
            sm: 1.5,
          }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            color="success.main"
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "10px",
                sm: "11px",
                md: "12px",
              },

              lineHeight: 1.2,
            }}
          >
            View Wallet
          </Typography>


          <ArrowForwardIos
            sx={{
              color: "#2E7D32",

              fontSize: {
                xs: 11,
                sm: 12,
                md: 14,
              },
            }}
          />

        </Box>

      </CardContent>

    </Card>

  );

};


export default WalletCard;