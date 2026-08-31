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
  CurrencyRupee,
  Groups,
} from "@mui/icons-material";

const CommissionTable = ({
  commissions = [],
}) => {
  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (commissions.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",
          boxSizing: "border-box",

          borderRadius: {
            xs: "24px",
            sm: "26px",
            md: "28px",
          },

          border: "1px solid #E8F5E9",

          backgroundColor: "#FFFFFF",

          boxShadow:
            "0 6px 20px rgba(0,0,0,0.07)",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.15rem",
                sm: "1.3rem",
                md: "1.5rem",
              },
            }}
          >
            Commission History
          </Typography>

          <Box
            sx={{
              py: {
                xs: 5,
                sm: 6,
              },

              px: 1,

              textAlign: "center",
            }}
          >
            <CurrencyRupee
              sx={{
                fontSize: {
                  xs: 55,
                  sm: 65,
                  md: 70,
                },

                color: "#C8E6C9",
              }}
            />

            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,

                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.25rem",
                },
              }}
            >
              No Commission Yet
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1,

                fontSize: {
                  xs: "0.82rem",
                  sm: "0.9rem",
                },
              }}
            >
              Start referring members and
              purchasing products to earn
              your first commission.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // =====================================================
  // COMMISSION HISTORY
  // =====================================================

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",

        boxSizing: "border-box",

        borderRadius: {
          xs: "24px",
          sm: "26px",
          md: "28px",
        },

        border: "1px solid #E8F5E9",

        backgroundColor: "#FFFFFF",

        boxShadow:
          "0 6px 20px rgba(0,0,0,0.07)",

        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
          },

          "&:last-child": {
            pb: {
              xs: 1.5,
              sm: 2.5,
              md: 3,
            },
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1.5}
          mb={3}
        >
          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.15rem",
                sm: "1.3rem",
                md: "1.5rem",
              },
            }}
          >
            Commission History
          </Typography>

          <Chip
            label={`${commissions.length} Records`}
            color="success"
            size="small"
            sx={{
              fontWeight: 500,
            }}
          />
        </Stack>

        {/* =================================================
            COMMISSION RECORDS
        ================================================= */}

        {commissions.map((item, index) => (
          <Box
            key={item?._id || index}
            sx={{
              width: "100%",
              boxSizing: "border-box",

              mb:
                index === commissions.length - 1
                  ? 0
                  : 2,

              p: {
                xs: 1.5,
                sm: 2,
              },

              borderRadius: {
                xs: "18px",
                sm: "20px",
              },

              backgroundColor: "#FFFFFF",

              border: "1px solid #EEEEEE",

              transition:
                "background-color .2s ease, transform .2s ease",

              "&:hover": {
                bgcolor: "#FAFAFA",

                transform: {
                  xs: "none",
                  sm: "translateY(-2px)",
                },
              },
            }}
          >
            {/* =================================================
                USER + COMMISSION AMOUNT
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
              spacing={2}
            >
              {/* USER */}

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 50,
                      sm: 60,
                    },

                    height: {
                      xs: 50,
                      sm: 60,
                    },

                    minWidth: {
                      xs: 50,
                      sm: 60,
                    },

                    bgcolor: "#E8F5E9",

                    borderRadius: "50%",

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    boxShadow:
                      "0 4px 10px rgba(0,0,0,.06)",
                  }}
                >
                  <Groups
                    sx={{
                      color: "#2E7D32",

                      fontSize: {
                        xs: 25,
                        sm: 30,
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
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "0.95rem",
                        sm: "1rem",
                      },

                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {item?.fromUser?.name ||
                      "System"}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.78rem",
                        sm: "0.85rem",
                      },

                      overflowWrap:
                        "anywhere",
                    }}
                  >
                    {item?.fromUser?.userId ||
                      "-"}
                  </Typography>
                </Box>
              </Stack>

              {/* COMMISSION AMOUNT */}

              <Typography
                fontWeight={700}
                color="success.main"
                sx={{
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.4rem",
                    md: "1.5rem",
                  },

                  textAlign: {
                    xs: "left",
                    sm: "right",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                ₹
                {Number(
                  item?.commissionAmount || 0
                ).toLocaleString("en-IN")}
              </Typography>
            </Stack>

            {/* =================================================
                LEVEL / PERCENTAGE / STATUS
            ================================================= */}

            <Stack
              direction="row"
              spacing={1}
              mt={2}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                size="small"
                label={`L${item?.level ?? 0}`}
                color="primary"
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
    bgcolor: "#FFF3E0",
    color: "#EF6C00",
  }}
/>

              <Chip
                size="small"
                label="Paid"
                color="success"
              />
            </Stack>

            {/* =================================================
                DATE
            ================================================= */}

            <Typography
              color="text.secondary"
              sx={{
                mt: 1.5,

                fontSize: {
                  xs: "0.8rem",
                  sm: "0.88rem",
                },
              }}
            >
              Earned On:{" "}
              {item?.createdAt
                ? new Date(
                    item.createdAt
                  ).toLocaleDateString("en-IN")
                : "-"}
            </Typography>

            {/* =================================================
                DIVIDER
            ================================================= */}

            {index !== commissions.length - 1 && (
              <Divider
                sx={{
                  mt: 2.5,
                }}
              />
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default CommissionTable;