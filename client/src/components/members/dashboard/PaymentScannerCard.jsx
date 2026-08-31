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

  const handleOpenScanner = () => {
    // =====================================================
    // ₹2,000 REGISTRATION PAYMENT
    // This is NOT the normal order payment scanner.
    // =====================================================

    navigate("/membership-payment");
  };

  return (
    <Card
      elevation={2}
      sx={{
        mt: 3,
        borderRadius: 4,
        overflow: "hidden",
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
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              minWidth: 0,
            }}
          >

            <Box
              sx={{
                width: {
                  xs: 56,
                  sm: 64,
                },

                height: {
                  xs: 56,
                  sm: 64,
                },

                borderRadius: "50%",

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
                    xs: 32,
                    sm: 38,
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
                variant="h6"
                fontWeight={800}
              >
                Registration Payment
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,

                  fontSize: {
                    xs: "0.85rem",
                    sm: "0.9rem",
                  },
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
                    "14px !important",
                }}
              />
            }
            onClick={handleOpenScanner}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },

              minWidth: {
                sm: 180,
              },

              borderRadius: 3,

              textTransform: "none",

              fontWeight: 800,

              py: 1.2,

              px: 2.5,

              flexShrink: 0,
            }}
          >
            Pay ₹2,000 Registration Fee
          </Button>

        </Stack>
      </CardContent>
    </Card>
  );
};

export default PaymentScannerCard;