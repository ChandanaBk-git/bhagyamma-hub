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

  const [open, setOpen] =
    useState(false);

  const balance = Number(
    wallet?.balance || 0
  );


  /* =====================================================
     WITHDRAW REQUEST
  ===================================================== */

  const handleWithdraw = async (data) => {

    const amount =
      Number(data?.amount);

    if (!amount || amount <= 0) {
      throw new Error(
        "Invalid withdrawal amount."
      );
    }

    const response =
      await requestWithdraw({
        amount,
      });

    console.log(
      "WITHDRAW REQUEST CREATED:",
      response
    );

    if (onSuccess) {
      await onSuccess();
    }

    return response;
  };


  return (
    <>
      {/* =================================================
          WITHDRAW CARD
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,

          boxSizing: "border-box",

          margin: 0,

          marginBottom: {
            xs: "10px",
            sm: "14px",
            md: "18px",
          },

          borderRadius:
            "0 !important",

          border:
            "1px solid #E8E8E8",

          borderLeft:
            "3px solid #2E7D32",

          backgroundColor:
            "#FFFFFF",

          boxShadow:
            "0 2px 8px rgba(0,0,0,0.06)",

          overflow: "hidden",
        }}
      >

        <CardContent
          sx={{
            width: "100%",

            boxSizing:
              "border-box",

            padding: {
              xs: "12px",
              sm: "16px",
              md: "20px",
            },

            "&:last-child": {
              paddingBottom: {
                xs: "12px",
                sm: "16px",
                md: "20px",
              },
            },
          }}
        >

          {/* =================================================
              MAIN SECTION
          ================================================= */}

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

            spacing={{
              xs: 1.5,
              sm: 2,
            }}

            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >

            {/* =================================================
                BALANCE
            ================================================= */}

            <Stack
              direction="row"

              spacing={{
                xs: 1,
                sm: 1.5,
              }}

              alignItems="center"

              sx={{
                minWidth: 0,
                width: "100%",
              }}
            >

              {/* ICON */}

              <Box
                sx={{
                  width: {
                    xs: 44,
                    sm: 52,
                    md: 58,
                  },

                  height: {
                    xs: 44,
                    sm: 52,
                    md: 58,
                  },

                  minWidth: {
                    xs: 44,
                    sm: 52,
                    md: 58,
                  },

                  bgcolor:
                    "#E8F5E9",

                  color:
                    "#2E7D32",

                  borderRadius:
                    "50%",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  flexShrink: 0,

                  "& svg": {
                    fontSize: {
                      xs: 23,
                      sm: 28,
                      md: 32,
                    },
                  },
                }}
              >
                <AccountBalanceWallet />
              </Box>


              {/* TEXT */}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  overflow: "hidden",
                }}
              >

                <Typography
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "15px",
                      sm: "17px",
                      md: "19px",
                    },

                    lineHeight: 1.2,

                    whiteSpace:
                      "nowrap",

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",
                  }}
                >
                  Withdraw Funds
                </Typography>


                <Typography
                  color="text.secondary"
                  sx={{
                    marginTop: "3px",

                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                      md: "13px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Available Balance
                </Typography>


                <Typography
                  color="success.main"
                  fontWeight={700}
                  sx={{
                    marginTop: "4px",

                    fontSize: {
                      xs: "19px",
                      sm: "21px",
                      md: "24px",
                    },

                    lineHeight: 1.1,

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  ₹
                  {balance.toLocaleString(
                    "en-IN"
                  )}
                </Typography>

              </Box>

            </Stack>


            {/* =================================================
                WITHDRAW BUTTON
            ================================================= */}

            <Button
              variant="contained"
              color="success"

              startIcon={
                <ArrowCircleUp />
              }

              disabled={
                balance < 500
              }

              onClick={() =>
                setOpen(true)
              }

              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },

                minHeight: {
                  xs: 42,
                  sm: 44,
                },

                px: {
                  xs: 2,
                  sm: 2.5,
                },

                borderRadius:
                  "6px",

                textTransform:
                  "none",

                fontWeight: 700,

                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },

                whiteSpace:
                  "nowrap",

                flexShrink: 0,
              }}
            >
              Withdraw Request
            </Button>

          </Stack>


          {/* =================================================
              DIVIDER
          ================================================= */}

          <Divider
            sx={{
              marginTop: {
                xs: "12px",
                sm: "16px",
              },

              marginBottom: {
                xs: "10px",
                sm: "14px",
              },
            }}
          />


          {/* =================================================
              GUIDELINES
          ================================================= */}

          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "15px",
                md: "16px",
              },

              lineHeight: 1.25,

              marginBottom: {
                xs: "7px",
                sm: "9px",
              },
            }}
          >
            Withdrawal Guidelines
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "11px",
                sm: "12px",
                md: "13px",
              },

              lineHeight: 1.45,

              marginBottom: {
                xs: "4px",
                sm: "5px",
              },
            }}
          >
            • Minimum withdrawal amount is ₹500.
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "11px",
                sm: "12px",
                md: "13px",
              },

              lineHeight: 1.45,

              marginBottom: {
                xs: "4px",
                sm: "5px",
              },
            }}
          >
            • Amount cannot exceed your available
            wallet balance.
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "11px",
                sm: "12px",
                md: "13px",
              },

              lineHeight: 1.45,
            }}
          >
            • Your request will be recorded and sent
            to Bhagyamma Hub through WhatsApp for
            verification.
          </Typography>

        </CardContent>

      </Card>


      {/* =================================================
          WITHDRAW DIALOG
      ================================================= */}

      <WithdrawDialog
        open={open}

        onClose={() =>
          setOpen(false)
        }

        wallet={wallet}

        onSubmit={
          handleWithdraw
        }
      />
    </>
  );
};


export default WithdrawCard;