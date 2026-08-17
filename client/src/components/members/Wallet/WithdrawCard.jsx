import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Divider,
} from "@mui/material";

import {
  AccountBalanceWallet,
  ArrowCircleUp,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const WithdrawCard = ({ wallet = {} }) => {

  const navigate = useNavigate();

  const balance = wallet.balance || 0;

  return (

    <Card
      elevation={2}
      sx={{
        mb: 3,
        borderRadius: 4,
      }}
    >

      <CardContent>

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >

            <Box
              sx={{
                width: 70,
                height: 70,
                bgcolor: "#E8F5E9",
                color: "#2E7D32",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              <AccountBalanceWallet
                sx={{
                  fontSize: 40,
                }}
              />

            </Box>

            <Box>

              <Typography
                variant="h5"
                fontWeight="bold"
              >
                Withdraw Funds
              </Typography>

              <Typography
                color="text.secondary"
              >
                Available Balance
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
                fontWeight="bold"
              >
                ₹
                {Number(balance).toLocaleString("en-IN")}
              </Typography>

            </Box>

          </Stack>

          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<ArrowCircleUp />}
            onClick={() =>
              navigate("/member/withdraw")
            }
            disabled={balance <= 0}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 3,
              fontWeight: "bold",
            }}
          >
            Withdraw Request
          </Button>

        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
        >
          Withdrawal Guidelines
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
        >
          • Withdrawal requests are processed after verification.
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
        >
          • Ensure your bank account details are correct before submitting.
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          • Once approved, the amount will be transferred to your registered bank account.
        </Typography>

      </CardContent>

    </Card>

  );

};

export default WithdrawCard;