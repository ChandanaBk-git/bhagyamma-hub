import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Alert,
} from "@mui/material";

import {
  CheckCircle,
  ErrorOutline,
  HourglassTop,
} from "@mui/icons-material";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  verifyPhonePePayment,
} from "../../services/payment.service";

const PhonePeCallback = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const merchantOrderId =
    searchParams.get(
      "merchantOrderId"
    );

  const source =
    searchParams.get(
      "source"
    );

  const isMember =
    source === "member";

  const [
    status,
    setStatus,
  ] = useState("VERIFYING");

  const [
    order,
    setOrder,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  useEffect(() => {
    if (!merchantOrderId) {
      setStatus("FAILED");

      setError(
        "Payment reference was not found."
      );

      return;
    }

    let cancelled = false;

    let attempts = 0;

    const MAX_ATTEMPTS = 20;

    const verify = async () => {
      try {
        attempts += 1;

        const result =
          await verifyPhonePePayment(
            merchantOrderId
          );

        if (cancelled) {
          return;
        }

        console.log(
          "PhonePe verification result:",
          result
        );

        const paymentStatus =
          String(
            result?.paymentStatus ||
              result?.status ||
              ""
          ).toUpperCase();

        // =================================================
        // SUCCESS
        // =================================================

        if (
          paymentStatus === "PAID" ||
          paymentStatus === "SUCCESS" ||
          paymentStatus === "COMPLETED"
        ) {
          setOrder(
            result?.order ||
              result
          );

          setStatus(
            "SUCCESS"
          );

          return;
        }

        // =================================================
        // FAILED
        // =================================================

        if (
          paymentStatus === "FAILED" ||
          paymentStatus === "FAILURE" ||
          paymentStatus === "CANCELLED"
        ) {
          setStatus(
            "FAILED"
          );

          return;
        }

        // =================================================
        // STOP AFTER MAX ATTEMPTS
        // =================================================

        if (
          attempts >=
          MAX_ATTEMPTS
        ) {
          setStatus(
            "ERROR"
          );

          setError(
            "Payment verification timed out. Please check your order status before trying again."
          );

          return;
        }

        // =================================================
        // RETRY
        // =================================================

        setStatus(
          "PENDING"
        );

        setTimeout(
          verify,
          3000
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Payment verification error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Unable to verify payment."
        );

        setStatus(
          "ERROR"
        );
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [
    merchantOrderId,
  ]);

  // =====================================================
  // ORDER LOCATION
  // =====================================================

  const goToOrders = () => {
    navigate(
      isMember
        ? "/member/orders"
        : "/orders"
    );
  };

  const goToShopping = () => {
    navigate(
      isMember
        ? "/member/products"
        : "/products"
    );
  };

  // =====================================================
  // VERIFYING
  // =====================================================

  if (
    status === "VERIFYING"
  ) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 10,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <CircularProgress
            size={60}
            color="success"
          />

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ mt: 3 }}
          >
            Verifying Payment
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Please wait while we
            confirm your PhonePe
            payment.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // =====================================================
  // PENDING
  // =====================================================

  if (
    status === "PENDING"
  ) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 10,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <HourglassTop
            sx={{
              fontSize: 70,
              color: "warning.main",
            }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ mt: 2 }}
          >
            Payment Verification
            in Progress
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Your payment is being
            confirmed. Please wait.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // =====================================================
  // SUCCESS
  // =====================================================

  if (
    status === "SUCCESS"
  ) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          py: 8,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
            textAlign: "center",
            borderRadius: 4,
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 85,
              color: "success.main",
            }}
          />

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mt: 2 }}
          >
            Payment Successful!
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Your payment has been
            successfully verified.
          </Typography>

          {order && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success">
                Payment successful
              </Alert>

              <Typography
                sx={{ mt: 2 }}
                fontWeight={600}
              >
                Order ID:{" "}
                {order.orderNumber ||
                  order._id}
              </Typography>

              <Typography
                sx={{ mt: 1 }}
              >
                Amount: ₹
                {Number(
                  order.finalAmount ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{
              mt: 4,
              py: 1.4,
              borderRadius: 2,
              fontWeight: 700,
            }}
            onClick={
              goToOrders
            }
          >
            View My Orders
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1 }}
            onClick={
              goToShopping
            }
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  // =====================================================
  // FAILED / ERROR
  // =====================================================

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 10,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <ErrorOutline
          sx={{
            fontSize: 80,
            color: "error.main",
          }}
        />

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 2 }}
        >
          Payment Failed
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Your payment was not
          confirmed.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mt: 3 }}
          >
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 4 }}
          onClick={() =>
            navigate(
              isMember
                ? "/member/checkout"
                : "/checkout"
            )
          }
        >
          Try Payment Again
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1 }}
          onClick={() =>
            navigate(
              isMember
                ? "/member/cart"
                : "/cart"
            )
          }
        >
          Back to Cart
        </Button>
      </Paper>
    </Container>
  );
};

export default PhonePeCallback;