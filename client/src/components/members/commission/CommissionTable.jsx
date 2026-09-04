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

          borderRadius: 0,

          border: "1px solid #E0E0E0",

          backgroundColor: "#FFFFFF",

          boxShadow: "none",

          overflow: "hidden",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: "10px",
              sm: "14px",
              md: "18px",
            },

            "&:last-child": {
              pb: {
                xs: "10px",
                sm: "14px",
                md: "18px",
              },
            },
          }}
        >

          {/* HEADER */}

          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              lineHeight: 1.2,

              color: "#292929",
            }}
          >
            Commission History
          </Typography>


          {/* EMPTY CONTENT */}

          <Box
            sx={{
              py: {
                xs: 2.5,
                sm: 3,
              },

              textAlign: "center",
            }}
          >

            <CurrencyRupee
              sx={{
                fontSize: {
                  xs: 34,
                  sm: 42,
                },

                color: "#C8E6C9",
              }}
            />

            <Typography
              sx={{
                mt: 0.8,

                fontWeight: 600,

                fontSize: {
                  xs: "13px",
                  sm: "15px",
                },

                lineHeight: 1.2,
              }}
            >
              No Commission Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.5,

                fontSize: {
                  xs: "10px",
                  sm: "12px",
                },

                lineHeight: 1.35,

                maxWidth: "400px",

                mx: "auto",
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

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        backgroundColor: "#FFFFFF",

        boxShadow: "none",

        overflow: "hidden",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "13px",
            md: "17px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "13px",
              md: "17px",
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
            mb: {
              xs: "8px",
              sm: "11px",
              md: "14px",
            },
          }}
        >

          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              lineHeight: 1.2,

              color: "#292929",
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
                xs: "21px",
                sm: "23px",
              },

              borderRadius: 0,

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 500,

              "& .MuiChip-label": {
                px: {
                  xs: "6px",
                  sm: "7px",
                },
              },
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
              xs: "5px",
              sm: "7px",
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

                p: {
                  xs: "7px 8px",
                  sm: "10px",
                },

                borderRadius: 0,

                backgroundColor: "#FFFFFF",

                border: "1px solid #E2E2E2",

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
                spacing={0.7}
                sx={{
                  width: "100%",
                  minWidth: 0,
                }}
              >

                {/* USER */}

                <Stack
                  direction="row"
                  spacing={0.8}
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
                        xs: 32,
                        sm: 36,
                      },

                      height: {
                        xs: 32,
                        sm: 36,
                      },

                      minWidth: {
                        xs: 32,
                        sm: 36,
                      },

                      bgcolor: "#E8F5E9",

                      borderRadius: 0,

                      display: "flex",

                      justifyContent: "center",

                      alignItems: "center",

                      flexShrink: 0,
                    }}
                  >

                    <Groups
                      sx={{
                        color: "#2E7D32",

                        fontSize: {
                          xs: 17,
                          sm: 19,
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
                      fontWeight={600}
                      sx={{
                        fontSize: {
                          xs: "12px",
                          sm: "13px",
                        },

                        lineHeight: 1.2,

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        color: "#292929",
                      }}
                    >
                      {item?.fromUser?.name ||
                        "System"}
                    </Typography>


                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                        },

                        lineHeight: 1.2,

                        mt: "2px",

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
                      xs: "15px",
                      sm: "17px",
                      md: "19px",
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
                spacing={0.5}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={{
                  mt: {
                    xs: "5px",
                    sm: "7px",
                  },
                }}
              >

                <Chip
                  size="small"
                  label={`L${item?.level ?? 0}`}
                  color="primary"
                  sx={{
                    height: {
                      xs: "19px",
                      sm: "21px",
                    },

                    borderRadius: 0,

                    fontSize: {
                      xs: "9px",
                      sm: "10px",
                    },

                    "& .MuiChip-label": {
                      px: "5px",
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
                      xs: "19px",
                      sm: "21px",
                    },

                    borderRadius: 0,

                    bgcolor: "#FFF3E0",

                    color: "#EF6C00",

                    fontSize: {
                      xs: "9px",
                      sm: "10px",
                    },

                    "& .MuiChip-label": {
                      px: "5px",
                    },
                  }}
                />


                <Chip
                  size="small"
                  label="Paid"
                  color="success"
                  sx={{
                    height: {
                      xs: "19px",
                      sm: "21px",
                    },

                    borderRadius: 0,

                    fontSize: {
                      xs: "9px",
                      sm: "10px",
                    },

                    "& .MuiChip-label": {
                      px: "5px",
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
                  mt: {
                    xs: "4px",
                    sm: "6px",
                  },

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                  },

                  lineHeight: 1.2,
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