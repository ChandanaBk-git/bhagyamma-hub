import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowDownward,
  ArrowUpward,
  AccountBalanceWallet,
} from "@mui/icons-material";


const WalletTransactions = ({
  transactions = [],
}) => {

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (!transactions.length) {

    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",

          borderRadius: "0 !important",

          border: "1px solid #E8E8E8",

          backgroundColor: "#FFFFFF",

          boxShadow: "none",

          boxSizing: "border-box",
        }}
      >

        <CardContent
          sx={{
            padding: {
              xs: "14px",
              sm: "20px",
              md: "24px",
            },

            "&:last-child": {
              paddingBottom: {
                xs: "14px",
                sm: "20px",
                md: "24px",
              },
            },
          }}
        >

          <Box
            sx={{
              py: {
                xs: 3,
                sm: 4,
              },

              textAlign: "center",
            }}
          >

            <AccountBalanceWallet
              sx={{
                fontSize: {
                  xs: 45,
                  sm: 55,
                  md: 65,
                },

                color: "#BDBDBD",
              }}
            />

            <Typography
              fontWeight={700}
              sx={{
                marginTop: {
                  xs: "8px",
                  sm: "12px",
                },

                fontSize: {
                  xs: "16px",
                  sm: "18px",
                },

                lineHeight: 1.25,
              }}
            >
              No Transactions Found
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                marginTop: "5px",

                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },

                lineHeight: 1.4,
              }}
            >
              Your wallet transactions will appear here.
            </Typography>

          </Box>

        </CardContent>

      </Card>
    );

  }


  /* =====================================================
     TRANSACTION LIST
  ===================================================== */

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",

        borderRadius: "0 !important",

        border: "1px solid #E8E8E8",

        backgroundColor: "#FFFFFF",

        boxShadow: "none",

        boxSizing: "border-box",

        overflow: "hidden",
      }}
    >

      <CardContent
        sx={{
          padding: {
            xs: "12px",
            sm: "18px",
            md: "22px",
          },

          "&:last-child": {
            paddingBottom: {
              xs: "12px",
              sm: "18px",
              md: "22px",
            },
          },
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Typography
          fontWeight={700}
          sx={{
            margin: 0,

            marginBottom: {
              xs: "10px",
              sm: "14px",
              md: "18px",
            },

            fontSize: {
              xs: "18px",
              sm: "20px",
              md: "23px",
            },

            lineHeight: 1.25,
          }}
        >
          Wallet Transactions
        </Typography>


        {/* =================================================
            TRANSACTIONS
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            display: "flex",

            flexDirection: "column",

            gap: {
              xs: "7px",
              sm: "9px",
            },
          }}
        >

          {transactions.map((item, index) => {

            const isCredit =
              item.type === "CREDIT";

            return (

              <Box
                key={
                  item?._id ||
                  `transaction-${index}`
                }
                sx={{
                  width: "100%",

                  boxSizing: "border-box",

                  padding: {
                    xs: "9px 10px",
                    sm: "12px",
                    md: "14px",
                  },

                  border: "1px solid #E8E8E8",

                  borderRadius: {
                    xs: "10px",
                    sm: "12px",
                  },

                  backgroundColor: "#FFFFFF",

                  overflow: "hidden",

                  transition:
                    "background-color 0.2s ease",

                  "&:hover": {
                    backgroundColor: "#FAFAFA",
                  },
                }}
              >

                {/* =================================================
                    TOP ROW
                ================================================= */}

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{
                    width: "100%",
                    minWidth: 0,
                  }}
                >

                  {/* ===============================================
                      LEFT SIDE
                  =============================================== */}

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={{
                      xs: 1,
                      sm: 1.5,
                    }}
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >

                    {/* ICON */}

                    <Box
                      sx={{
                        width: {
                          xs: 38,
                          sm: 45,
                        },

                        height: {
                          xs: 38,
                          sm: 45,
                        },

                        minWidth: {
                          xs: 38,
                          sm: 45,
                        },

                        borderRadius: "50%",

                        bgcolor: isCredit
                          ? "#E8F5E9"
                          : "#FFEBEE",

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",

                        flexShrink: 0,
                      }}
                    >

                      {isCredit ? (

                        <ArrowDownward
                          sx={{
                            color: "#2E7D32",

                            fontSize: {
                              xs: 20,
                              sm: 24,
                            },
                          }}
                        />

                      ) : (

                        <ArrowUpward
                          sx={{
                            color: "#D32F2F",

                            fontSize: {
                              xs: 20,
                              sm: 24,
                            },
                          }}
                        />

                      )}

                    </Box>


                    {/* DESCRIPTION */}

                    <Box
                      sx={{
                        minWidth: 0,

                        overflow: "hidden",
                      }}
                    >

                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: {
                            xs: "13px",
                            sm: "14px",
                            md: "15px",
                          },

                          lineHeight: 1.25,

                          whiteSpace: "nowrap",

                          overflow: "hidden",

                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.description}
                      </Typography>


                      <Typography
                        color="text.secondary"
                        sx={{
                          marginTop: "3px",

                          fontSize: {
                            xs: "10px",
                            sm: "11px",
                            md: "12px",
                          },

                          lineHeight: 1.2,

                          whiteSpace: "nowrap",

                          overflow: "hidden",

                          textOverflow: "ellipsis",
                        }}
                      >
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </Typography>

                    </Box>

                  </Stack>


                  {/* ===============================================
                      RIGHT SIDE
                  =============================================== */}

                  <Stack
                    alignItems="flex-end"
                    spacing={{
                      xs: 0.5,
                      sm: 0.7,
                    }}
                    sx={{
                      flexShrink: 0,
                    }}
                  >

                    <Typography
                      fontWeight={700}
                      sx={{
                        color: isCredit
                          ? "#2E7D32"
                          : "#D32F2F",

                        fontSize: {
                          xs: "15px",
                          sm: "17px",
                          md: "19px",
                        },

                        lineHeight: 1.1,

                        whiteSpace: "nowrap",
                      }}
                    >

                      {isCredit
                        ? "+"
                        : "-"}

                      ₹
                      {Number(
                        item.amount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </Typography>


                    <Chip
                      size="small"
                      color={
                        isCredit
                          ? "success"
                          : "error"
                      }
                      label={
                        item.type
                      }
                      sx={{
                        height: {
                          xs: "21px",
                          sm: "23px",
                        },

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                        },

                        fontWeight: 600,
                      }}
                    />

                  </Stack>

                </Stack>


                {/* =================================================
                    BALANCE
                ================================================= */}

                <Typography
                  color="text.secondary"
                  sx={{
                    marginTop: {
                      xs: "7px",
                      sm: "9px",
                    },

                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                      md: "12px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  Balance: ₹
                  {Number(
                    item.balanceAfter || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </Typography>


                {/* =================================================
                    DIVIDER
                ================================================= */}

                {index <
                  transactions.length - 1 && (
                  <Divider
                    sx={{
                      marginTop: {
                        xs: "8px",
                        sm: "10px",
                      },

                      display: "none",
                    }}
                  />
                )}

              </Box>

            );

          })}

        </Box>

      </CardContent>

    </Card>
  );
};


export default WalletTransactions;