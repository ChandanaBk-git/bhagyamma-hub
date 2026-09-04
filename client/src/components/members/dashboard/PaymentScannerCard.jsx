import {
  Card,
  CardContent,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import {
  QrCode2,
  ArrowForwardIos,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


const PaymentScannerCard = () => {
  const navigate = useNavigate();

  // =====================================================
  // OPEN ₹2,000 MEMBERSHIP PAYMENT SCANNER
  //
  // IMPORTANT:
  // This scanner belongs to the MEMBER DASHBOARD.
  // =====================================================

  const handleOpenScanner = () => {
    navigate(
      "/membership-payment",
      {
        state: {
          from: "member-dashboard",
        },
      }
    );
  };


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

        <Stack
          direction={{
            xs: "row",
            sm: "row",
          }}
          spacing={{
            xs: 0.8,
            sm: 1.2,
          }}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <Stack
            direction="row"
            spacing={{
              xs: 0.8,
              sm: 1,
            }}
            alignItems="center"
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >

            {/* QR ICON */}

            <Box
              sx={{
                width: {
                  xs: 34,
                  sm: 40,
                  md: 46,
                },

                height: {
                  xs: 34,
                  sm: 40,
                  md: 46,
                },

                minWidth: {
                  xs: 34,
                  sm: 40,
                  md: 46,
                },

                borderRadius: 0,

                bgcolor: "#E8F5E9",

                color: "#2E7D32",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                flexShrink: 0,
              }}
            >

              <QrCode2
                sx={{
                  fontSize: {
                    xs: 19,
                    sm: 23,
                    md: 26,
                  },
                }}
              />

            </Box>


            {/* TEXT */}

            <Box
              sx={{
                minWidth: 0,
                flex: 1,
                overflow: "hidden",
              }}
            >

              <Typography
                fontWeight={700}
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                    md: "16px",
                  },

                  lineHeight: 1.2,

                  color: "#292929",

                  whiteSpace: {
                    xs: "nowrap",
                    sm: "normal",
                  },

                  overflow: "hidden",

                  textOverflow: "ellipsis",
                }}
              >
                Registration Payment
              </Typography>


              <Typography
                color="text.secondary"
                sx={{
                  mt: {
                    xs: "2px",
                    sm: "3px",
                  },

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                    md: "11px",
                  },

                  lineHeight: 1.25,

                  display: {
                    xs: "-webkit-box",
                    sm: "block",
                  },

                  WebkitLineClamp: {
                    xs: 2,
                    sm: "unset",
                  },

                  WebkitBoxOrient: "vertical",

                  overflow: "hidden",
                }}
              >
                Pay the ₹2,000 registration fee
                by scanning the QR code.
              </Typography>

            </Box>

          </Stack>


          {/* =================================================
              BUTTON
          ================================================= */}

          <Button
            variant="contained"
            color="success"
            endIcon={
              <ArrowForwardIos
                sx={{
                  fontSize:
                    "10px !important",
                }}
              />
            }
            onClick={handleOpenScanner}
            sx={{
              minWidth: {
                xs: "auto",
                sm: 150,
                md: 170,
              },

              height: {
                xs: 32,
                sm: 36,
                md: 40,
              },

              borderRadius: 0,

              textTransform: "none",

              fontWeight: 600,

              fontSize: {
                xs: "9px",
                sm: "10px",
                md: "11px",
              },

              lineHeight: 1.1,

              px: {
                xs: 1,
                sm: 1.5,
                md: 2,
              },

              py: 0,

              flexShrink: 0,

              whiteSpace: {
                xs: "nowrap",
                sm: "nowrap",
              },

              boxShadow: "none",

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: {
                  xs: "none",
                  sm: "inline",
                },
              }}
            >
              Pay ₹2,000 Registration Fee
            </Box>

            <Box
              component="span"
              sx={{
                display: {
                  xs: "inline",
                  sm: "none",
                },
              }}
            >
              Pay ₹2,000
            </Box>
          </Button>

        </Stack>

      </CardContent>

    </Card>
  );
};


export default PaymentScannerCard;