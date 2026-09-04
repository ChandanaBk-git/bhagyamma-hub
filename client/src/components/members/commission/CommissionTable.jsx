import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import {
  CurrencyRupee,
  Groups,
} from "@mui/icons-material";


const CommissionTable = ({
  commissions = [],
}) => {

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (commissions.length === 0) {

    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",

          boxSizing: "border-box",

          borderRadius: "0 !important",

          border: "1px solid #E8E8E8",

          backgroundColor: "#FFFFFF",

          boxShadow: "none",

          overflow: "hidden",
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

          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "18px",
                sm: "20px",
                md: "23px",
              },

              lineHeight: 1.25,
            }}
          >
            Commission History
          </Typography>


          <Box
            sx={{
              py: {
                xs: 4,
                sm: 5,
              },

              textAlign: "center",
            }}
          >

            <CurrencyRupee
              sx={{
                fontSize: {
                  xs: 48,
                  sm: 60,
                },

                color: "#C8E6C9",
              }}
            />

            <Typography
              sx={{
                mt: 1.5,

                fontWeight: 700,

                fontSize: {
                  xs: "15px",
                  sm: "17px",
                },
              }}
            >
              No Commission Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.7,

                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },

                lineHeight: 1.5,
              }}
            >
              Start referring members and purchasing
              products to earn your first commission.
            </Typography>

          </Box>

        </CardContent>
      </Card>
    );
  }


  /* =====================================================
     COMMISSION HISTORY
  ===================================================== */

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",

        boxSizing: "border-box",

        borderRadius: "0 !important",

        border: "1px solid #E8E8E8",

        backgroundColor: "#FFFFFF",

        boxShadow: "none",

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

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{
            marginBottom: {
              xs: "12px",
              sm: "16px",
              md: "20px",
            },
          }}
        >

          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "18px",
                sm: "20px",
                md: "23px",
              },

              lineHeight: 1.25,
            }}
          >
            Commission History
          </Typography>


          <Chip
            label={`${commissions.length} Records`}
            color="success"
            size="small"
            sx={{
              height: {
                xs: "24px",
                sm: "26px",
              },

              fontSize: {
                xs: "11px",
                sm: "12px",
              },

              fontWeight: 500,
            }}
          />

        </Stack>


        {/* =================================================
            COMMISSION RECORDS
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",

            boxSizing: "border-box",

            display: "flex",
            flexDirection: "column",

            gap: {
              xs: "8px",
              sm: "10px",
            },
          }}
        >

          {commissions.map((item, index) => (

            <Box
              key={item?._id || index}
              sx={{
                width: "100%",
                maxWidth: "100%",

                boxSizing: "border-box",

                padding: {
                  xs: "10px 12px",
                  sm: "14px",
                },

                borderRadius: {
                  xs: "14px",
                  sm: "16px",
                },

                backgroundColor: "#FFFFFF",

                border: "1px solid #E5E5E5",

                overflow: "hidden",

                "&:hover": {
                  backgroundColor: "#FAFAFA",
                },
              }}
            >

              {/* ==========================================
                  USER + AMOUNT
              ========================================== */}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{
                  width: "100%",
                  minWidth: 0,
                }}
              >

                {/* USER */}

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >

                  {/* USER ICON */}

                  <Box
                    sx={{
                      width: {
                        xs: 42,
                        sm: 48,
                      },

                      height: {
                        xs: 42,
                        sm: 48,
                      },

                      minWidth: {
                        xs: 42,
                        sm: 48,
                      },

                      bgcolor: "#E8F5E9",

                      borderRadius: "50%",

                      display: "flex",

                      justifyContent: "center",

                      alignItems: "center",
                    }}
                  >

                    <Groups
                      sx={{
                        color: "#2E7D32",

                        fontSize: {
                          xs: 21,
                          sm: 25,
                        },
                      }}
                    />

                  </Box>


                  {/* USER DETAILS */}

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
                          xs: "14px",
                          sm: "15px",
                        },

                        lineHeight: 1.25,

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                      }}
                    >
                      {item?.fromUser?.name ||
                        "System"}
                    </Typography>


                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "11px",
                          sm: "12px",
                        },

                        lineHeight: 1.3,

                        marginTop: "2px",

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                      }}
                    >
                      {item?.fromUser?.userId ||
                        "-"}
                    </Typography>

                  </Box>

                </Stack>


                {/* COMMISSION */}

                <Typography
                  fontWeight={700}
                  color="success.main"
                  sx={{
                    fontSize: {
                      xs: "19px",
                      sm: "21px",
                      md: "23px",
                    },

                    lineHeight: 1,

                    whiteSpace: "nowrap",

                    flexShrink: 0,
                  }}
                >
                  ₹
                  {Number(
                    item?.commissionAmount || 0
                  ).toLocaleString("en-IN")}
                </Typography>

              </Stack>


              {/* ==========================================
                  LEVEL / PERCENTAGE / STATUS
              ========================================== */}

              <Stack
                direction="row"
                spacing={0.7}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={{
                  marginTop: {
                    xs: "8px",
                    sm: "10px",
                  },
                }}
              >

                <Chip
                  size="small"
                  label={`L${item?.level ?? 0}`}
                  color="primary"
                  sx={{
                    height: {
                      xs: "23px",
                      sm: "25px",
                    },

                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                  }}
                />


                <Chip
                  size="small"
                  label={`${Number(
                    item?.percentage ??
                    item?.commissionPercent ??
                    item?.commissionPercentage ??
                    item?.commissionRate ??
                    item?.percent ??
                    item?.rate ??
                    0
                  )}%`}
                  sx={{
                    height: {
                      xs: "23px",
                      sm: "25px",
                    },

                    bgcolor: "#FFF3E0",

                    color: "#EF6C00",

                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                  }}
                />


                <Chip
                  size="small"
                  label="Paid"
                  color="success"
                  sx={{
                    height: {
                      xs: "23px",
                      sm: "25px",
                    },

                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                  }}
                />

              </Stack>


              {/* ==========================================
                  DATE
              ========================================== */}

              <Typography
                color="text.secondary"
                sx={{
                  marginTop: {
                    xs: "7px",
                    sm: "9px",
                  },

                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                  },

                  lineHeight: 1.3,
                }}
              >
                Earned On:{" "}
                {item?.createdAt
                  ? new Date(
                      item.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "-"}
              </Typography>

            </Box>

          ))}

        </Box>

      </CardContent>

    </Card>
  );
};


export default CommissionTable;