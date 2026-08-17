import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Stack,
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

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  // =====================================================
  // RESET
  // =====================================================

  useEffect(() => {
    if (open) {
      setAmount("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  // =====================================================
  // USER
  // =====================================================

  const user = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      return {};
    }
  })();

  // =====================================================
  // VALIDATE
  // =====================================================

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

  // =====================================================
  // WHATSAPP
  // =====================================================

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

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async () => {
    setError("");

    if (!validateAmount()) {
      return;
    }

    const requestedAmount =
      Number(amount);

    try {
      setSubmitting(true);

      /*
       * IMPORTANT:
       *
       * onSubmit will be connected to
       * your real withdrawal API from
       * WithdrawCard.jsx.
       *
       * We do NOT fake a successful
       * backend request here.
       */

      if (onSubmit) {
        await onSubmit({
          amount: requestedAmount,
          walletBalance: balance,
        });
      }

      /*
       * Open company WhatsApp after
       * the request has been processed
       * by the parent.
       */

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

  // =====================================================
  // UI
  // =====================================================

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
          borderRadius: {
            xs: 3,
            sm: 4,
          },

          mx: {
            xs: 1.5,
            sm: 2,
          },

          width: {
            xs: "calc(100% - 24px)",
            sm: "100%",
          },
        },
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <DialogTitle
        sx={{
          fontWeight: 700,

          fontSize: {
            xs: "1.15rem",
            sm: "1.35rem",
          },

          pb: 1,
        }}
      >
        Withdraw Funds
      </DialogTitle>

      <DialogContent>
        {/* =================================================
            BALANCE
        ================================================= */}

        <Box
          sx={{
            p: 2,

            mb: 2.5,

            borderRadius: 3,

            bgcolor: "#E8F5E9",

            border:
              "1px solid #C8E6C9",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
          >
            <AccountBalanceWallet
              sx={{
                color: "#2E7D32",
              }}
            />

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Available Balance
              </Typography>

              <Typography
                fontWeight={700}
                color="#2E7D32"
                sx={{
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.4rem",
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
              <InputAdornment position="start">
                ₹
              </InputAdornment>
            ),
          }}
          helperText={`Minimum ₹${MIN_WITHDRAWAL} • Maximum ₹${balance.toLocaleString(
            "en-IN"
          )}`}
        />

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Divider
          sx={{
            my: 2.5,
          }}
        />

        {/* =================================================
            WHATSAPP INFO
        ================================================= */}

        <Box
          sx={{
            p: 2,

            borderRadius: 3,

            bgcolor: "#F1F8E9",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
          >
            <WhatsApp
              sx={{
                color: "#25D366",
                mt: 0.25,
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
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
          p: {
            xs: 2,
            sm: 2.5,
          },

          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={submitting}
          sx={{
            borderRadius: 2,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={
            <WhatsApp />
          }
          onClick={handleSubmit}
          disabled={
            submitting ||
            balance < MIN_WITHDRAWAL
          }
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            px: 2.5,
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