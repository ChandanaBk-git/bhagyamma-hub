import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWallet,
  WhatsApp,
} from "@mui/icons-material";


const COMPANY_WHATSAPP =
  "916363645068";

const MIN_WITHDRAWAL = 500;


const WithdrawDialog = ({
  open,
  onClose,
  wallet = {},
  onSubmit,
}) => {

  const balance = Number(
    wallet?.balance || 0
  );

  const [amount, setAmount] =
    useState("");

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);


  /* =====================================================
     RESET
  ===================================================== */

  useEffect(() => {

    if (open) {

      setAmount("");
      setError("");
      setSubmitting(false);

    }

  }, [open]);


  /* =====================================================
     USER
  ===================================================== */

  const user = (() => {

    try {

      return JSON.parse(
        localStorage.getItem(
          "user"
        ) || "{}"
      );

    } catch {

      return {};

    }

  })();


  /* =====================================================
     VALIDATE
  ===================================================== */

  const validateAmount = () => {

    const requestedAmount =
      Number(amount);


    if (!requestedAmount) {

      setError(
        "Please enter a withdrawal amount."
      );

      return false;

    }


    if (
      requestedAmount <
      MIN_WITHDRAWAL
    ) {

      setError(
        `Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}.`
      );

      return false;

    }


    if (
      requestedAmount > balance
    ) {

      setError(
        "Withdrawal amount cannot exceed your wallet balance."
      );

      return false;

    }


    return true;

  };


  /* =====================================================
     WHATSAPP
  ===================================================== */

  const openWhatsApp = (
    requestedAmount
  ) => {

    const memberName =
      user?.name ||
      user?.fullName ||
      "Member";


    const memberId =
      user?.userId ||
      user?.memberId ||
      "N/A";


    const message = [

      "Hello Bhagyamma Hub,",

      "",

      "I would like to request a withdrawal.",

      "",

      `Member Name: ${memberName}`,

      `Member ID: ${memberId}`,

      `Withdrawal Amount: ₹${requestedAmount.toLocaleString(
        "en-IN"
      )}`,

      `Wallet Balance: ₹${balance.toLocaleString(
        "en-IN"
      )}`,

      "",

      "Please verify and process my withdrawal request.",

      "",

      "Thank you.",

    ].join("\n");


    const whatsappUrl =
      `https://wa.me/${COMPANY_WHATSAPP}` +
      `?text=${encodeURIComponent(
        message
      )}`;


    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async () => {

    setError("");


    if (!validateAmount()) {
      return;
    }


    const requestedAmount =
      Number(amount);


    try {

      setSubmitting(true);


      if (onSubmit) {

        await onSubmit({
          amount: requestedAmount,
          walletBalance: balance,
        });

      }


      openWhatsApp(
        requestedAmount
      );


      onClose?.();

    } catch (err) {

      console.error(
        "WITHDRAW REQUEST ERROR:",
        err
      );


      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit withdrawal request."
      );

    } finally {

      setSubmitting(false);

    }

  };


  /* =====================================================
     UI
  ===================================================== */

  return (

    <Dialog
      open={open}
      onClose={
        submitting
          ? undefined
          : onClose
      }

      fullWidth

      maxWidth="sm"

      PaperProps={{
        sx: {

          width: {
            xs: "calc(100% - 20px)",
            sm: "100%",
          },

          maxWidth: {
            xs: "420px",
            sm: "600px",
          },

          margin: {
            xs: "10px",
            sm: "32px",
          },

          borderRadius:
            "0 !important",

          border:
            "1px solid #E5E5E5",

          boxShadow:
            "0 8px 30px rgba(0,0,0,0.12)",

          overflow: "hidden",

        },
      }}
    >

      {/* =================================================
          TITLE
      ================================================= */}

      <DialogTitle
        sx={{
          padding: {
            xs: "14px 16px 10px",
            sm: "18px 22px 12px",
          },

          fontWeight: 700,

          fontSize: {
            xs: "18px",
            sm: "21px",
          },

          lineHeight: 1.25,
        }}
      >
        Withdraw Funds
      </DialogTitle>


      {/* =================================================
          CONTENT
      ================================================= */}

      <DialogContent
        sx={{
          padding: {
            xs: "8px 16px 12px !important",
            sm: "10px 22px 16px !important",
          },

          boxSizing:
            "border-box",
        }}
      >

        {/* =================================================
            AVAILABLE BALANCE
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            padding: {
              xs: "10px 12px",
              sm: "12px 14px",
            },

            marginBottom: {
              xs: "12px",
              sm: "16px",
            },

            boxSizing:
              "border-box",

            bgcolor:
              "#E8F5E9",

            border:
              "1px solid #C8E6C9",

            borderRadius:
              "0 !important",
          }}
        >

          <Stack
            direction="row"
            spacing={{
              xs: 1,
              sm: 1.5,
            }}
            alignItems="center"
          >

            <Box
              sx={{
                width: {
                  xs: 38,
                  sm: 44,
                },

                height: {
                  xs: 38,
                  sm: 44,
                },

                minWidth: {
                  xs: 38,
                  sm: 44,
                },

                bgcolor:
                  "#FFFFFF",

                borderRadius:
                  "50%",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                color:
                  "#2E7D32",
              }}
            >

              <AccountBalanceWallet
                sx={{
                  fontSize: {
                    xs: 21,
                    sm: 24,
                  },
                }}
              />

            </Box>


            <Box
              sx={{
                minWidth: 0,
              }}
            >

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                  },

                  lineHeight: 1.2,
                }}
              >
                Available Balance
              </Typography>


              <Typography
                fontWeight={700}
                color="#2E7D32"
                sx={{
                  marginTop: "3px",

                  fontSize: {
                    xs: "18px",
                    sm: "21px",
                  },

                  lineHeight: 1.1,
                }}
              >
                ₹
                {balance.toLocaleString(
                  "en-IN"
                )}
              </Typography>

            </Box>

          </Stack>

        </Box>


        {/* =================================================
            AMOUNT
        ================================================= */}

        <TextField
          fullWidth

          label="Withdrawal Amount"

          type="number"

          value={amount}

          onChange={(event) => {

            setAmount(
              event.target.value
            );

            setError("");

          }}

          disabled={submitting}

          inputProps={{
            min: MIN_WITHDRAWAL,
            max: balance,
            step: 1,
          }}

          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
              >
                ₹
              </InputAdornment>
            ),
          }}

          helperText={
            `Minimum ₹${MIN_WITHDRAWAL} • ` +
            `Maximum ₹${balance.toLocaleString(
              "en-IN"
            )}`
          }

          sx={{
            "& .MuiInputBase-root": {
              minHeight: {
                xs: "46px",
                sm: "50px",
              },

              fontSize: {
                xs: "14px",
                sm: "15px",
              },
            },

            "& .MuiInputLabel-root": {
              fontSize: {
                xs: "13px",
                sm: "14px",
              },
            },

            "& .MuiFormHelperText-root": {
              marginTop: "4px",

              marginLeft: 0,

              fontSize: {
                xs: "10px",
                sm: "11px",
              },
            },
          }}
        />


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Alert
            severity="error"
            sx={{
              marginTop: "10px",

              padding: {
                xs: "4px 10px",
                sm: "6px 12px",
              },

              borderRadius:
                "0 !important",

              fontSize: {
                xs: "11px",
                sm: "12px",
              },

              "& .MuiAlert-icon": {
                fontSize: {
                  xs: "18px",
                  sm: "20px",
                },
              },
            }}
          >
            {error}
          </Alert>

        )}


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
            WHATSAPP INFORMATION
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            padding: {
              xs: "10px 12px",
              sm: "12px 14px",
            },

            boxSizing:
              "border-box",

            bgcolor:
              "#F1F8E9",

            border:
              "1px solid #E3F0D9",

            borderRadius:
              "0 !important",
          }}
        >

          <Stack
            direction="row"
            spacing={{
              xs: 1,
              sm: 1.5,
            }}
            alignItems="flex-start"
          >

            <WhatsApp
              sx={{
                color: "#25D366",

                fontSize: {
                  xs: 21,
                  sm: 24,
                },

                marginTop:
                  "1px",

                flexShrink: 0,
              }}
            />


            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "11px",
                  sm: "12px",
                },

                lineHeight: 1.45,
              }}
            >
              After submitting the withdrawal
              request, WhatsApp will open with
              your member details and requested
              amount already filled in. Send the
              message to Bhagyamma Hub for
              verification.
            </Typography>

          </Stack>

        </Box>

      </DialogContent>


      {/* =================================================
          ACTIONS
      ================================================= */}

      <DialogActions
        sx={{
          padding: {
            xs: "8px 16px 14px",
            sm: "10px 22px 18px",
          },

          gap: 1,

          flexDirection: {
            xs: "row",
            sm: "row",
          },

          justifyContent:
            "flex-end",
        }}
      >

        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            minHeight: {
              xs: 38,
              sm: 42,
            },

            paddingX: {
              xs: 1.5,
              sm: 2,
            },

            borderRadius:
              "5px",

            textTransform:
              "none",

            fontSize: {
              xs: "12px",
              sm: "13px",
            },
          }}
        >
          Cancel
        </Button>


        <Button
          variant="contained"
          color="success"

          startIcon={
            <WhatsApp
              sx={{
                fontSize: {
                  xs: "17px !important",
                  sm: "20px !important",
                },
              }}
            />
          }

          onClick={handleSubmit}

          disabled={
            submitting ||
            balance < MIN_WITHDRAWAL
          }

          sx={{
            minHeight: {
              xs: 38,
              sm: 42,
            },

            paddingX: {
              xs: 1.5,
              sm: 2,
            },

            borderRadius:
              "5px",

            textTransform:
              "none",

            fontWeight: 700,

            fontSize: {
              xs: "12px",
              sm: "13px",
            },

            whiteSpace:
              "nowrap",
          }}
        >
          {submitting
            ? "Submitting..."
            : "Request & WhatsApp"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default WithdrawDialog;