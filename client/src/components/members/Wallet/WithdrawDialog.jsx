import { useState } from "react";

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

import WithdrawDialog from "./WithdrawDialog";

const WithdrawCard = ({ wallet = {} }) => {

  const [open, setOpen] = useState(false);

  const balance = wallet?.balance || 0;

  const handleWithdraw = async (data) => {

    try {

      console.log("Withdraw Request :", data);

      /*
      await requestWithdraw(data);

      toast.success(
        "Withdrawal request submitted successfully."
      );

      */

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <>

      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 4,
          transition: ".3s",

          "&:hover": {
            boxShadow: 8,
          },
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
              disabled={balance <= 0}
              onClick={() => setOpen(true)}
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

          <Divider
            sx={{
              my: 3,
            }}
          />

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
            • Minimum withdrawal amount is ₹500.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
          >
            • Withdrawal amount must not exceed your wallet balance.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
          >
            • Requests will be verified by the admin before approval.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            • After approval, the amount will be transferred to your registered bank account.
          </Typography>

        </CardContent>

      </Card>

      <WithdrawDialog
        open={open}
        onClose={() => setOpen(false)}
        wallet={wallet}
        onSubmit={handleWithdraw}
      />

    </>

  );

};

export default WithdrawCard;