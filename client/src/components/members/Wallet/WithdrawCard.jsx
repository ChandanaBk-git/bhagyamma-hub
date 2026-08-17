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

import { useState } from "react";

import WithdrawDialog from "./WithdrawDialog";

import { requestWithdraw } from "../../../services/withdraw.service";

const WithdrawCard = ({
  wallet = {},
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);

  const balance = Number(
    wallet?.balance || 0
  );

  const handleWithdraw = async (data) => {
    const amount = Number(data?.amount);

    if (!amount || amount <= 0) {
      throw new Error(
        "Invalid withdrawal amount."
      );
    }

    // REAL BACKEND REQUEST
    const response = await requestWithdraw({
      amount,
    });

    console.log(
      "WITHDRAW REQUEST CREATED:",
      response
    );

    // Refresh wallet after successful request
    if (onSuccess) {
      await onSuccess();
    }

    return response;
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",

          mb: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          borderRadius: {
            xs: 3,
            sm: 4,
          },

          border: "1px solid #E8F5E9",

          boxShadow:
            "0 6px 20px rgba(0,0,0,0.07)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 1.75,
              sm: 2.5,
              md: 3,
            },

            "&:last-child": {
              pb: {
                xs: 1.75,
                sm: 2.5,
                md: 3,
              },
            },
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
            spacing={2.5}
          >
            {/* BALANCE */}

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                minWidth: 0,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 54,
                    sm: 64,
                  },

                  height: {
                    xs: 54,
                    sm: 64,
                  },

                  minWidth: {
                    xs: 54,
                    sm: 64,
                  },

                  bgcolor: "#E8F5E9",
                  color: "#2E7D32",

                  borderRadius: "50%",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  "& svg": {
                    fontSize: {
                      xs: 30,
                      sm: 36,
                    },
                  },
                }}
              >
                <AccountBalanceWallet />
              </Box>

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "1rem",
                      sm: "1.2rem",
                    },
                  }}
                >
                  Withdraw Funds
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.9rem",
                    },
                  }}
                >
                  Available Balance
                </Typography>

                <Typography
                  color="success.main"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "1.3rem",
                      sm: "1.55rem",
                    },
                  }}
                >
                  ₹
                  {balance.toLocaleString(
                    "en-IN"
                  )}
                </Typography>
              </Box>
            </Stack>

            {/* BUTTON */}

            <Button
              fullWidth={false}
              variant="contained"
              color="success"
              startIcon={<ArrowCircleUp />}
              disabled={balance < 500}
              onClick={() => setOpen(true)}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },

                minHeight: 48,

                px: {
                  xs: 2,
                  sm: 3,
                },

                borderRadius: 2.5,

                fontWeight: 700,

                whiteSpace: "nowrap",
              }}
            >
              Withdraw Request
            </Button>
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          <Typography
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            Withdrawal Guidelines
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.75 }}
          >
            • Minimum withdrawal amount is
            ₹500.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.75 }}
          >
            • Amount cannot exceed your
            available wallet balance.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            • Your request will be recorded
            and sent to Bhagyamma Hub through
            WhatsApp for verification.
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