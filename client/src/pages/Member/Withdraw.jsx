import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { AccountBalanceWallet } from "@mui/icons-material";

import { useEffect, useState } from "react";

import { getWallet } from "../../services/wallet.service";

import {
  requestWithdraw,
  getMyWithdraws,
} from "../../services/withdraw.service";

const Withdraw = () => {
  const [wallet, setWallet] = useState({});
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const walletData = await getWallet();

      setWallet(
        walletData?.wallet || {}
      );

      const withdrawData =
        await getMyWithdraws();

      setHistory(
        Array.isArray(withdrawData)
          ? withdrawData
          : []
      );
    } catch (err) {
      console.error(
        "WITHDRAW LOAD ERROR:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SUBMIT WITHDRAW
  ===================================================== */

  const handleSubmit = async () => {
    const numericAmount = Number(amount);

    if (
      !numericAmount ||
      numericAmount <= 0
    ) {
      return alert(
        "Enter valid amount"
      );
    }

    if (numericAmount < 500) {
      return alert(
        "Minimum withdrawal amount is ₹500"
      );
    }

    if (
      numericAmount >
      Number(wallet?.balance || 0)
    ) {
      return alert(
        "Amount exceeds available balance"
      );
    }

    try {
      setSubmitting(true);

      await requestWithdraw({
        amount: numericAmount,
      });

      alert(
        "Withdraw request submitted successfully."
      );

      setAmount("");

      await loadData();
    } catch (err) {
      console.error(
        "WITHDRAW REQUEST ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Unable to submit request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "45vh",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          m: 0,
          p: 0,

          boxSizing: "border-box",

          backgroundColor: "#F5F7FA",
        }}
      >
        <CircularProgress
          color="success"
          size={24}
          thickness={4}
        />
      </Box>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        minHeight: "100vh",

        m: 0,
        p: 0,

        boxSizing: "border-box",

        backgroundColor: "#F5F7FA",

        overflowX: "hidden",

        borderRadius: 0,

        "& .MuiCard-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius:
            "0 !important",
        },
      }}
    >
      {/* =================================================
          CONTENT
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1400px",
          },

          minWidth: 0,

          m: {
            xs: 0,
            md: "0 auto",
          },

          p: {
            xs: "8px",
            sm: "12px",
            md: "16px 8px 24px",
          },

          boxSizing: "border-box",

          overflowX: "hidden",
        }}
      >
        {/* =================================================
            TITLE
        ================================================= */}

        <Typography
          component="h1"
          sx={{
            m: 0,

            mb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            fontSize: {
              xs: "18px",
              sm: "22px",
              md: "26px",
            },

            lineHeight: 1.25,

            fontWeight: 700,

            color: "#292929",
          }}
        >
          Withdraw
        </Typography>

        {/* =================================================
            BALANCE + REQUEST
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.25,
            md: 1.5,
          }}
          sx={{
            width: "100%",
            m: 0,
          }}
        >
          {/* =================================================
              AVAILABLE BALANCE
          ================================================= */}

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",

                border:
                  "1px solid #DDE7DE",

                borderLeft:
                  "3px solid #2E7D32",

                backgroundColor:
                  "#FFFFFF",

                boxShadow: "none",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.25,
                    sm: 1.5,
                    md: 1.75,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.25,
                      sm: 1.5,
                      md: 1.75,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    gap: {
                      xs: 1,
                      sm: 1.25,
                    },
                  }}
                >
                  {/* ICON */}

                  <Box
                    sx={{
                      width: {
                        xs: 34,
                        sm: 40,
                      },

                      height: {
                        xs: 34,
                        sm: 40,
                      },

                      minWidth: {
                        xs: 34,
                        sm: 40,
                      },

                      backgroundColor:
                        "#E8F5E9",

                      color: "#2E7D32",

                      borderRadius: 0,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      flexShrink: 0,
                    }}
                  >
                    <AccountBalanceWallet
                      sx={{
                        fontSize: {
                          xs: 19,
                          sm: 23,
                        },
                      }}
                    />
                  </Box>

                  {/* BALANCE */}

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
                        },

                        lineHeight: 1.2,
                      }}
                    >
                      Available Balance
                    </Typography>

                    <Typography
                      fontWeight={800}
                      color="#2E7D32"
                      sx={{
                        mt: 0.25,

                        fontSize: {
                          xs: "18px",
                          sm: "21px",
                        },

                        lineHeight: 1.15,

                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹
                      {Number(
                        wallet?.balance || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* =================================================
              NEW WITHDRAW REQUEST
          ================================================= */}

          <Grid
            item
            xs={12}
            md={8}
            sx={{
              minWidth: 0,
              boxSizing: "border-box",
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",

                border:
                  "1px solid #DDE7DE",

                backgroundColor:
                  "#FFFFFF",

                boxShadow: "none",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.25,
                    sm: 1.5,
                    md: 1.75,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.25,
                      sm: 1.5,
                      md: 1.75,
                    },
                  },
                }}
              >
                <Typography
                  fontWeight={700}
                  sx={{
                    mb: {
                      xs: 0.75,
                      sm: 1,
                    },

                    fontSize: {
                      xs: "13px",
                      sm: "15px",
                    },
                  }}
                >
                  New Withdraw Request
                </Typography>

                <TextField
                  fullWidth
                  type="number"
                  label="Withdraw Amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                  disabled={submitting}
                  inputProps={{
                    min: 500,
                    max: Number(
                      wallet?.balance || 0
                    ),
                    step: 1,
                  }}
                  helperText={
                    `Minimum ₹500 • Available ₹${Number(
                      wallet?.balance || 0
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                  sx={{
                    "& .MuiInputBase-root":
                      {
                        minHeight: {
                          xs: "40px",
                          sm: "44px",
                        },

                        fontSize: {
                          xs: "12px",
                          sm: "13px",
                        },
                      },

                    "& .MuiInputLabel-root":
                      {
                        fontSize: {
                          xs: "11px",
                          sm: "12px",
                        },
                      },

                    "& .MuiFormHelperText-root":
                      {
                        ml: 0,
                        mt: "3px",

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                        },
                      },
                  }}
                />

                {/* INFO */}

                <Alert
                  severity="info"
                  sx={{
                    mt: {
                      xs: 0.75,
                      sm: 1,
                    },

                    py: 0.25,
                    px: 1,

                    borderRadius: 0,

                    fontSize: {
                      xs: "9px",
                      sm: "10px",
                    },

                    lineHeight: 1.35,
                  }}
                >
                  Your registered bank account
                  will be used for payment after
                  approval.
                </Alert>

                {/* BUTTON */}

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !amount ||
                    Number(amount) < 500 ||
                    Number(amount) >
                      Number(
                        wallet?.balance || 0
                      )
                  }
                  sx={{
                    mt: {
                      xs: 0.75,
                      sm: 1,
                    },

                    minHeight: {
                      xs: 36,
                      sm: 40,
                    },

                    borderRadius: 0,

                    textTransform: "none",

                    fontWeight: 700,

                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                  }}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Request"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* =================================================
            WITHDRAW HISTORY
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            width: "100%",

            mt: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            border:
              "1px solid #DDE7DE",

            backgroundColor:
              "#FFFFFF",

            boxShadow: "none",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 1.25,
                sm: 1.5,
                md: 1.75,
              },

              "&:last-child": {
                pb: {
                  xs: 1.25,
                  sm: 1.5,
                  md: 1.75,
                },
              },
            }}
          >
            <Typography
              fontWeight={700}
              sx={{
                mb: {
                  xs: 0.75,
                  sm: 1,
                },

                fontSize: {
                  xs: "13px",
                  sm: "15px",
                },
              }}
            >
              Withdraw History
            </Typography>

            {/* =================================================
                EMPTY
            ================================================= */}

            {history.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },
                }}
              >
                No withdraw requests found.
              </Typography>
            ) : (
              history.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    spacing={0.75}
                  >
                    {/* AMOUNT */}

                    <Grid
                      item
                      xs={7}
                      sm={8}
                    >
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: {
                            xs: "12px",
                            sm: "14px",
                          },

                          lineHeight: 1.2,
                        }}
                      >
                        ₹
                        {Number(
                          item?.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{
                          mt: "2px",

                          fontSize: {
                            xs: "9px",
                            sm: "10px",
                          },
                        }}
                      >
                        {item?.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </Grid>

                    {/* STATUS */}

                    <Grid
                      item
                      xs={5}
                      sm={4}
                      sx={{
                        textAlign: "right",
                      }}
                    >
                      <Chip
                        size="small"
                        label={
                          item?.status ||
                          "PENDING"
                        }
                        color={
                          item?.status ===
                          "APPROVED"
                            ? "success"
                            : item?.status ===
                              "REJECTED"
                            ? "error"
                            : "warning"
                        }
                        sx={{
                          height: {
                            xs: 21,
                            sm: 24,
                          },

                          fontSize: {
                            xs: "8px",
                            sm: "9px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* REJECTED REASON */}

                  {item?.rejectedReason && (
                    <Typography
                      color="error"
                      sx={{
                        mt: 0.5,

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                        },
                      }}
                    >
                      Reason:{" "}
                      {item.rejectedReason}
                    </Typography>
                  )}

                  <Divider
                    sx={{
                      mt: {
                        xs: 0.75,
                        sm: 1,
                      },

                      mb: {
                        xs: 0.75,
                        sm: 1,
                      },
                    }}
                  />
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Withdraw;