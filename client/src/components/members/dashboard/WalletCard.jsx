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
      elevation={2}
      onClick={() => navigate("/member/wallet")}
      sx={{
        mt: 3,
        borderRadius: 4,
        cursor: "pointer",
        transition: "0.3s",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              color="text.secondary"
              variant="body2"
            >
              Wallet Balance
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
            >
              ₹{wallet?.balance || 0}
            </Typography>

            <Typography
              variant="body2"
              color="success.main"
              mt={1}
            >
              Available Balance
            </Typography>

          </Box>

          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              bgcolor: "#E8F5E9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <AccountBalanceWallet
              sx={{
                color: "#2E7D32",
                fontSize: 40,
              }}
            />

          </Box>

        </Stack>

        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            color="success.main"
            fontWeight="bold"
          >
            View Wallet
          </Typography>

          <ArrowForwardIos
            sx={{
              color: "#2E7D32",
              fontSize: 16,
            }}
          />

        </Box>

      </CardContent>

    </Card>

  );

};

export default WalletCard;