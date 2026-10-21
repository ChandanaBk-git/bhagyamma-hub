import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Alert,
  Divider,
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
  verifyGuestPhonePePayment,
} from "../../services/payment.service";

import { useCart } from "../../context/CartContext";

const PhonePeCallback = () => {
  const navigate = useNavigate();
  const { clearAll } = useCart();

  const [searchParams] = useSearchParams();

  const merchantOrderId =
    searchParams.get("merchantOrderId");

  const source = searchParams.get("source");

  const guestPaymentToken = sessionStorage.getItem(
    "bhagyamma_guest_payment_token"
  );

  const authToken =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const isMember =
    source === "member" ||
    (!guestPaymentToken && Boolean(authToken));

  const [status, setStatus] = useState("VERIFYING");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!merchantOrderId) {
      setStatus("FAILED");
      setError("Payment reference was not found.");
      return;
    }

    let cancelled = false;
    let retryTimer;
    let attempts = 0;

    const MAX_ATTEMPTS = 20;

    const verify = async () => {
      try {
        attempts += 1;

        let response;

        if (guestPaymentToken) {
          response = await verifyGuestPhonePePayment(
            merchantOrderId,
            guestPaymentToken
          );
        } else if (authToken) {
          response = await verifyPhonePePayment(
            merchantOrderId
          );
        } else {
          throw new Error(
            "Your payment verification session has expired. Please contact support before making another payment."
          );
        }

        if (cancelled) return;

        // Support both a direct result and common API response wrappers.
        const result =
          response?.data?.data ??
          response?.data ??
          response?.data?.result ??
          response?.result ??
          response;

        console.log(
          "PhonePe verification result:",
          result
        );

        const paymentStatus = String(
          result?.paymentStatus ||
            result?.order?.paymentStatus ||
            result?.status ||
            ""
        ).toUpperCase();

        // Only the backend-confirmed PAID status is accepted.
        if (paymentStatus === "PAID") {
          const orderData = result?.order || result;

          setOrder({
            orderId:
              orderData?.orderId ||
              orderData?._id ||
              result?.orderId ||
              "",

            orderNumber:
              orderData?.orderNumber ||
              result?.orderNumber ||
              "",

            finalAmount:
              orderData?.finalAmount ??
              result?.finalAmount ??
              null,

            paymentStatus: "PAID",

            orderStatus:
              orderData?.orderStatus ||
              orderData?.status ||
              result?.orderStatus ||
              "",

            transactionId:
              orderData?.transactionId ||
              orderData?.phonePeTransactionId ||
              result?.transactionId ||
              "",
          });

          setStatus("SUCCESS");

          // Clear the cart only after server-confirmed payment.
          try {
            await clearAll();
          } catch (cartError) {
            console.warn(
              "Payment confirmed, but cart cleanup failed:",
              cartError
            );
          }

          sessionStorage.removeItem(
            "bhagyamma_guest_payment_token"
          );
          sessionStorage.removeItem(
            "bhagyamma_pending_payment"
          );
          sessionStorage.removeItem(
            "bhagyamma_pending_cart"
          );

          return;
        }

        if (
          paymentStatus === "FAILED" ||
          paymentStatus === "FAILURE" ||
          paymentStatus === "CANCELLED"
        ) {
          setOrder(result);
          setStatus("FAILED");
          setError(
            "PhonePe did not confirm a successful payment. Check your order status before trying again."
          );
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          setOrder(result);
          setStatus("ERROR");
          setError(
            "Payment verification is still pending. Please check your order status before making another payment."
          );
          return;
        }

        setStatus("PENDING");

        retryTimer = setTimeout(verify, 3000);
      } catch (err) {
        if (cancelled) return;

        console.error(
          "PhonePe payment verification error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to verify your payment."
        );

        setStatus("ERROR");
      }
    };

    verify();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [
    merchantOrderId,
    guestPaymentToken,
    authToken,
    clearAll,
  ]);

  const goToOrders = () => {
    navigate(
      isMember ? "/member/orders" : "/orders"
    );
  };

  const goToShopping = () => {
    navigate(
      isMember ? "/member/products" : "/products"
    );
  };

  const formatAmount = (amount) => {
    const value = Number(amount);

    if (
      amount === null ||
      amount === undefined ||
      amount === "" ||
      !Number.isFinite(value)
    ) {
      return "Unavailable";
    }

    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const renderPage = (content) => (
    <Container
      maxWidth="sm"
      sx={{ py: { xs: 4, sm: 8 } }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        {content}
      </Paper>
    </Container>
  );

  if (status === "VERIFYING") {
    return renderPage(
      <>
        <CircularProgress size={60} color="success" />

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 3 }}
        >
          Verifying Payment
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we confirm your PhonePe payment.
        </Typography>
      </>
    );
  }

  if (status === "PENDING") {
    return renderPage(
      <>
        <HourglassTop
          sx={{ fontSize: 70, color: "warning.main" }}
        />

        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mt: 2 }}
        >
          Payment Verification in Progress
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Your payment is being confirmed. Please wait.
        </Typography>
      </>
    );
  }

  if (status === "SUCCESS") {
    return renderPage(
      <>
        <CheckCircle
          sx={{ fontSize: 85, color: "success.main" }}
        />

        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ mt: 2 }}
        >
          Payment Successful!
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Your payment has been successfully verified.
        </Typography>

        <Alert severity="success" sx={{ mt: 3 }}>
          Payment confirmed by PhonePe
        </Alert>

        <Box
          sx={{
            mt: 3,
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            textAlign: "left",
            overflowWrap: "anywhere",
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Order ID
          </Typography>

          <Typography fontWeight={700} sx={{ mt: 0.5 }}>
            {order?.orderNumber ||
              order?.orderId ||
              "Order reference unavailable"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography color="text.secondary" variant="body2">
            Amount Received
          </Typography>

          <Typography
            variant="h5"
            fontWeight={800}
            color="success.main"
            sx={{ mt: 0.5 }}
          >
            {formatAmount(order?.finalAmount)}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography color="text.secondary" variant="body2">
            Payment Status
          </Typography>

          <Typography fontWeight={700} sx={{ mt: 0.5 }}>
            {order?.paymentStatus}
          </Typography>

          {order?.transactionId && (
            <>
              <Divider sx={{ my: 2 }} />

              <Typography
                color="text.secondary"
                variant="body2"
              >
                PhonePe Transaction ID
              </Typography>

              <Typography
                fontWeight={600}
                sx={{ mt: 0.5 }}
              >
                {order.transactionId}
              </Typography>
            </>
          )}
        </Box>

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
          onClick={goToOrders}
        >
          View My Orders
        </Button>

        <Button
          fullWidth
          sx={{ mt: 1 }}
          onClick={goToShopping}
        >
          Continue Shopping
        </Button>
      </>
    );
  }

  return renderPage(
    <>
      <ErrorOutline
        sx={{ fontSize: 80, color: "error.main" }}
      />

      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mt: 2 }}
      >
        {status === "ERROR"
          ? "Payment Verification Pending"
          : "Payment Not Confirmed"}
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {status === "ERROR"
          ? "We could not confirm the payment status. Do not pay again until you check your order."
          : "The payment has not been confirmed as successful."}
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mt: 3, textAlign: "left" }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 4 }}
        onClick={goToOrders}
      >
        Check My Orders
      </Button>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={goToShopping}
      >
        Continue Shopping
      </Button>
    </>
  );
};

export default PhonePeCallback;