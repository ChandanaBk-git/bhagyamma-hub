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
  AccountBalance,
  AccountBalanceWallet,
  WhatsApp,
} from "@mui/icons-material";

const COMPANY_WHATSAPP = "916363645068";

const MIN_WITHDRAWAL = 500;

const WithdrawDialog = ({
  open,
  onClose,
  wallet = {},
  onSubmit,
}) => {
  // =====================================================
  // WALLET BALANCE
  // =====================================================

  const balance = Number(wallet?.balance || 0);

  // =====================================================
  // STATE
  // =====================================================

  const [amount, setAmount] = useState("");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // USER FROM LOCAL STORAGE
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
  // RESET WHEN OPEN
  // =====================================================

  useEffect(() => {
    if (open) {
      setAmount("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  // =====================================================
  // BANK DETAILS
  //
  // Your User model stores these directly:
  // bankName
  // accountHolderName
  // accountNumber
  // ifscCode
  // branch
  // =====================================================

  const bankName =
    user?.bankName ||
    "";

  const accountHolderName =
    user?.accountHolderName ||
    "";

  const accountNumber =
    user?.accountNumber ||
    "";

  const ifscCode =
    user?.ifscCode ||
    "";

  const branch =
    user?.branch ||
    "";

  // =====================================================
  // MASK ACCOUNT NUMBER
  // =====================================================

  const maskedAccountNumber = () => {
    if (!accountNumber) {
      return "Not provided";
    }

    const account =
      String(accountNumber);

    if (account.length <= 4) {
      return account;
    }

    return (
      "XXXX XXXX " +
      account.slice(-4)
    );
  };

  // =====================================================
  // VALIDATE BANK DETAILS
  // =====================================================

  const hasBankDetails =
    Boolean(
      bankName &&
      accountHolderName &&
      accountNumber &&
      ifscCode
    );

  // =====================================================
  // VALIDATE AMOUNT
  // =====================================================

  const validateAmount = () => {
    const requestedAmount =
      Number(amount);

    if (
      !amount ||
      !Number.isFinite(
        requestedAmount
      )
    ) {
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
      requestedAmount >
      balance
    ) {
      setError(
        "Withdrawal amount cannot exceed your wallet balance."
      );

      return false;
    }

    return true;
  };

  // =====================================================
  // WHATSAPP MESSAGE
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

    const mobile =
      user?.mobile ||
      user?.phone ||
      "N/A";

    const message = [
      "Hello Bhagyamma Hub,",
      "",
      "I would like to request a withdrawal.",
      "",
      "MEMBER DETAILS",
      `Member Name: ${memberName}`,
      `Member ID: ${memberId}`,
      `Mobile: ${mobile}`,
      "",
      "WITHDRAWAL DETAILS",
      `Withdrawal Amount: ₹${requestedAmount.toLocaleString(
        "en-IN"
      )}`,
      `Wallet Balance: ₹${balance.toLocaleString(
        "en-IN"
      )}`,
      "",
      "BANK DETAILS",
      `Bank Name: ${
        bankName || "Not provided"
      }`,
      `Account Holder: ${
        accountHolderName ||
        "Not provided"
      }`,
      `Account Number: ${
        accountNumber ||
        "Not provided"
      }`,
      `IFSC Code: ${
        ifscCode ||
        "Not provided"
      }`,
      `Branch: ${
        branch || "Not provided"
      }`,
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
  // SUBMIT WITHDRAWAL
  // =====================================================

  const handleSubmit = async () => {
    setError("");

    // ---------------------------------------
    // Validate amount
    // ---------------------------------------

    if (!validateAmount()) {
      return;
    }

    // ---------------------------------------
    // Validate bank details
    // ---------------------------------------

    if (!hasBankDetails) {
      setError(
        "Please update your bank details before requesting a withdrawal."
      );

      return;
    }

    const requestedAmount =
      Number(amount);

    try {
      setSubmitting(true);

      // -------------------------------------
      // Create PENDING withdrawal
      // -------------------------------------

      if (onSubmit) {
        await onSubmit({
          amount: requestedAmount,
          walletBalance: balance,
        });
      }

      // -------------------------------------
      // Open WhatsApp AFTER successful API
      // request
      // -------------------------------------

      openWhatsApp(
        requestedAmount
      );

      // -------------------------------------
      // Close dialog
      // -------------------------------------

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
            BANK DETAILS
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            padding: {
              xs: "12px",
              sm: "14px",
            },

            marginBottom: {
              xs: "12px",
              sm: "16px",
            },

            boxSizing:
              "border-box",

            bgcolor:
              "#FAFAFA",

            border:
              "1px solid #E5E5E5",

            borderRadius:
              "0 !important",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: "10px",
            }}
          >
            <AccountBalance
              sx={{
                color: "#2E7D32",
                fontSize: {
                  xs: 20,
                  sm: 23,
                },
              }}
            />

            <Typography
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: "13px",
                  sm: "15px",
                },
              }}
            >
              Registered Bank Details
            </Typography>
          </Stack>

          {hasBankDetails ? (
            <Stack
              spacing={0.7}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },
                  }}
                >
                  Bank Name
                </Typography>

                <Typography
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },

                    textAlign: "right",
                  }}
                >
                  {bankName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },
                  }}
                >
                  Account Holder
                </Typography>

                <Typography
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },

                    textAlign: "right",
                  }}
                >
                  {accountHolderName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },
                  }}
                >
                  Account Number
                </Typography>

                <Typography
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },

                    textAlign: "right",
                  }}
                >
                  {maskedAccountNumber()}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 2,
                }}
              >
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },
                  }}
                >
                  IFSC Code
                </Typography>

                <Typography
                  fontWeight={600}
                  sx={{
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                    },

                    textAlign: "right",
                  }}
                >
                  {ifscCode}
                </Typography>
              </Box>

              {branch && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                      },
                    }}
                  >
                    Branch
                  </Typography>

                  <Typography
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                      },

                      textAlign: "right",
                    }}
                  >
                    {branch}
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            <Alert
              severity="warning"
              sx={{
                borderRadius:
                  "0 !important",

                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },

                padding: {
                  xs: "5px 10px",
                  sm: "7px 12px",
                },
              }}
            >
              Please update your bank
              details before requesting a
              withdrawal.
            </Alert>
          )}
        </Box>

        {/* =================================================
            WITHDRAWAL AMOUNT
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
          disabled={
            submitting ||
            !hasBankDetails
          }
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

                marginTop: "1px",

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
              Your withdrawal request will
              first be recorded in the system.
              WhatsApp will then open with your
              member, withdrawal and bank
              details already filled in.
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

          justifyContent:
            "flex-end",
        }}
      >
        {/* CANCEL */}

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

            borderRadius: "5px",

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

        {/* SEND WHATSAPP */}

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
            !hasBankDetails ||
            balance < MIN_WITHDRAWAL ||
            !amount ||
            Number(amount) < MIN_WITHDRAWAL ||
            Number(amount) > balance
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

            borderRadius: "5px",

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
            : "Send WhatsApp Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithdrawDialog;