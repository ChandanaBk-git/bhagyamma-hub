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

  const [wallet, setWallet] =
    useState({});

  const [history, setHistory] =
    useState([]);

  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);


  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      const walletData =
        await getWallet();

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

    const numericAmount =
      Number(amount);


    if (
      !numericAmount ||
      numericAmount <= 0
    ) {

      return alert(
        "Enter valid amount"
      );

    }


    if (
      numericAmount < 500
    ) {

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
          minHeight: "60vh",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: "#F5F7FA",
        }}
      >

        <CircularProgress
          color="success"
          size={28}
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

        margin: 0,
        padding: 0,

        boxSizing: "border-box",

        bgcolor: "#F5F7FA",

        overflowX: "hidden",

        /* Remove unnecessary curves */
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
            md: "1400px",
          },

          margin: {
            xs: 0,
            md: "0 auto",
          },

          padding: {
            xs: "8px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
        }}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <Typography
          component="h1"
          sx={{
            margin: 0,

            marginBottom: {
              xs: "12px",
              sm: "16px",
              md: "20px",
            },

            fontSize: {
              xs: "20px",
              sm: "25px",
              md: "30px",
            },

            lineHeight: {
              xs: "25px",
              sm: "31px",
              md: "36px",
            },

            fontWeight: 800,

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
            xs: 1.5,
            sm: 2,
            md: 2.5,
          }}

          sx={{
            width: "100%",
            margin: 0,
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
              boxSizing:
                "border-box",
            }}
          >

            <Card
              elevation={0}
              sx={{
                width: "100%",

                border:
                  "1px solid #E5E5E5",

                borderLeft:
                  "3px solid #2E7D32",

                backgroundColor:
                  "#FFFFFF",

                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >

              <CardContent
                sx={{
                  padding: {
                    xs: "14px",
                    sm: "18px",
                    md: "20px",
                  },

                  "&:last-child": {
                    paddingBottom: {
                      xs: "14px",
                      sm: "18px",
                      md: "20px",
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
                      sm: 1.5,
                    },
                  }}
                >

                  <Box
                    sx={{
                      width: {
                        xs: 44,
                        sm: 52,
                      },

                      height: {
                        xs: 44,
                        sm: 52,
                      },

                      minWidth: {
                        xs: 44,
                        sm: 52,
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
                    }}
                  >

                    <AccountBalanceWallet
                      sx={{
                        fontSize: {
                          xs: 23,
                          sm: 28,
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
                          xs: "11px",
                          sm: "12px",
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
                        marginTop: "4px",

                        fontSize: {
                          xs: "22px",
                          sm: "26px",
                        },

                        lineHeight: 1.1,

                        whiteSpace:
                          "nowrap",
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
              boxSizing:
                "border-box",
            }}
          >

            <Card
              elevation={0}
              sx={{
                width: "100%",

                border:
                  "1px solid #E5E5E5",

                backgroundColor:
                  "#FFFFFF",

                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >

              <CardContent
                sx={{
                  padding: {
                    xs: "14px",
                    sm: "18px",
                    md: "20px",
                  },

                  "&:last-child": {
                    paddingBottom: {
                      xs: "14px",
                      sm: "18px",
                      md: "20px",
                    },
                  },
                }}
              >

                <Typography
                  fontWeight={700}
                  sx={{
                    marginBottom: {
                      xs: "10px",
                      sm: "14px",
                    },

                    fontSize: {
                      xs: "15px",
                      sm: "17px",
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
                      marginLeft: 0,

                      marginTop: "4px",

                      fontSize: {
                        xs: "10px",
                        sm: "11px",
                      },
                    },
                  }}
                />


                {/* INFO */}

                <Alert
                  severity="info"
                  sx={{
                    marginTop: {
                      xs: "10px",
                      sm: "14px",
                    },

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

                    lineHeight: 1.4,
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

                  onClick={
                    handleSubmit
                  }

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
                    marginTop: {
                      xs: "10px",
                      sm: "14px",
                    },

                    minHeight: {
                      xs: 42,
                      sm: 46,
                    },

                    borderRadius:
                      "5px",

                    textTransform:
                      "none",

                    fontWeight: 700,

                    fontSize: {
                      xs: "13px",
                      sm: "14px",
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

            marginTop: {
              xs: "12px",
              sm: "16px",
              md: "20px",
            },

            border:
              "1px solid #E5E5E5",

            backgroundColor:
              "#FFFFFF",

            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >

          <CardContent
            sx={{
              padding: {
                xs: "14px",
                sm: "18px",
                md: "20px",
              },

              "&:last-child": {
                paddingBottom: {
                  xs: "14px",
                  sm: "18px",
                  md: "20px",
                },
              },
            }}
          >

            <Typography
              fontWeight={700}
              sx={{
                marginBottom: {
                  xs: "10px",
                  sm: "14px",
                },

                fontSize: {
                  xs: "15px",
                  sm: "17px",
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
                    xs: "12px",
                    sm: "13px",
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
                    spacing={1}
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
                            xs: "14px",
                            sm: "16px",
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
                          marginTop: "3px",

                          fontSize: {
                            xs: "10px",
                            sm: "12px",
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
                        textAlign:
                          "right",
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
                            xs: 24,
                            sm: 28,
                          },

                          fontSize: {
                            xs: "10px",
                            sm: "11px",
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
                        marginTop: "6px",

                        fontSize: {
                          xs: "11px",
                          sm: "12px",
                        },
                      }}
                    >
                      Reason:{" "}
                      {item.rejectedReason}
                    </Typography>

                  )}


                  <Divider
                    sx={{
                      marginTop: {
                        xs: "10px",
                        sm: "12px",
                      },

                      marginBottom: {
                        xs: "10px",
                        sm: "12px",
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