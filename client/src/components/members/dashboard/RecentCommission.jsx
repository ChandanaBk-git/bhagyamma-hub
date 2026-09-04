import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  CurrencyRupee,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const RecentCommission = ({
  commissions = [],
}) => {

  const navigate = useNavigate();


  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",

        mt: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        backgroundColor: "#FFFFFF",

        boxShadow: "none",

        overflow: "hidden",

        boxSizing: "border-box",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
          },
        }}
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{
            mb: {
              xs: "7px",
              sm: "9px",
              md: "11px",
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
            Recent Commission
          </Typography>


          <Button
            size="small"
            onClick={() =>
              navigate("/member/commission")
            }
            sx={{
              minWidth: "auto",

              height: {
                xs: "25px",
                sm: "28px",
              },

              px: {
                xs: "6px",
                sm: "8px",
              },

              borderRadius: 0,

              textTransform: "none",

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 600,

              lineHeight: 1,
            }}
          >
            View All
          </Button>

        </Stack>


        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {commissions.length === 0 ? (

          <Box
            sx={{
              py: {
                xs: 2,
                sm: 2.5,
              },

              textAlign: "center",
            }}
          >

            <CurrencyRupee
              sx={{
                fontSize: {
                  xs: 32,
                  sm: 38,
                },

                color: "#BDBDBD",
              }}
            />

            <Typography
              sx={{
                mt: {
                  xs: "5px",
                  sm: "7px",
                },

                color: "text.secondary",

                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },

                lineHeight: 1.2,
              }}
            >
              No Commission Found
            </Typography>

          </Box>

        ) : (

          commissions
            .slice(0, 5)
            .map((item) => (

              <Box
                key={item._id}
                sx={{
                  width: "100%",

                  minWidth: 0,

                  boxSizing: "border-box",
                }}
              >

                {/* ==================================
                    COMMISSION ROW
                ================================== */}

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

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >

                    <Typography
                      fontWeight={600}
                      sx={{
                        fontSize: {
                          xs: "11px",
                          sm: "12px",
                          md: "13px",
                        },

                        lineHeight: 1.2,

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",

                        color: "#292929",
                      }}
                    >
                      {item.fromUser?.name ||
                        "System"}
                    </Typography>


                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: "2px",

                        fontSize: {
                          xs: "9px",
                          sm: "10px",
                          md: "11px",
                        },

                        lineHeight: 1.2,

                        whiteSpace: "nowrap",

                        overflow: "hidden",

                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.type}
                    </Typography>

                  </Box>


                  {/* AMOUNT + LEVEL */}

                  <Box
                    textAlign="right"
                    sx={{
                      flexShrink: 0,
                    }}
                  >

                    <Typography
                      fontWeight={700}
                      color="success.main"
                      sx={{
                        fontSize: {
                          xs: "13px",
                          sm: "15px",
                          md: "17px",
                        },

                        lineHeight: 1.1,

                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹
                      {item.commissionAmount}
                    </Typography>


                    <Chip
                      size="small"
                      color="success"
                      label={
                        item.level
                          ? `Level ${item.level}`
                          : "Reward"
                      }
                      sx={{
                        mt: "3px",

                        height: {
                          xs: "18px",
                          sm: "20px",
                        },

                        borderRadius: 0,

                        fontSize: {
                          xs: "8px",
                          sm: "9px",
                        },

                        "& .MuiChip-label": {
                          px: "5px",
                        },
                      }}
                    />

                  </Box>

                </Stack>


                {/* DATE */}

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: {
                      xs: "4px",
                      sm: "5px",
                    },

                    fontSize: {
                      xs: "8px",
                      sm: "9px",
                      md: "10px",
                    },

                    lineHeight: 1.2,
                  }}
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </Typography>


                {/* DIVIDER */}

                <Divider
                  sx={{
                    my: {
                      xs: "6px",
                      sm: "8px",
                    },
                  }}
                />

              </Box>

            ))

        )}

      </CardContent>

    </Card>

  );

};


export default RecentCommission;