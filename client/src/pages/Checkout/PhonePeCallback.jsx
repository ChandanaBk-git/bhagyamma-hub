import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  ErrorOutline,
  HourglassTop,
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  verifyPhonePePayment,
  verifyGuestPhonePePayment,
  createMembershipPhonePePayment,
  verifyMembershipPhonePePayment,
} from "../../services/payment.service";
import { useCart } from "../../context/CartContext";

const PhonePeCallback = () => {
  const navigate = useNavigate();
  const { clearAll } = useCart();
  const [searchParams] = useSearchParams();

  const merchantOrderId = searchParams.get("merchantOrderId");
  const paymentType = String(searchParams.get("type") || "order").toLowerCase();
  const isMembership = paymentType === "membership";
  const guestPaymentToken = sessionStorage.getItem(
    "bhagyamma_guest_payment_token"
  );
  const authToken =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const isMember = Boolean(authToken) && !guestPaymentToken;

  const membershipPaymentOrigin =
    sessionStorage.getItem("bhagyamma_membership_payment_origin") ||
    "profile";

  const [status, setStatus] = useState("VERIFYING");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const failureRedirected = useRef(false);

  useEffect(() => {
    if (!merchantOrderId) {
      setStatus("FAILED");
      setError("Payment reference was not found. Please retry from your profile.");
      return undefined;
    }

    let cancelled = false;
    let timer;
    let attempts = 0;
    const maxAttempts = 20;

    const verify = async () => {
      try {
        attempts += 1;
        let result;

        if (isMembership) {
          result = await verifyMembershipPhonePePayment(merchantOrderId);
        } else if (guestPaymentToken) {
          result = await verifyGuestPhonePePayment(
            merchantOrderId,
            guestPaymentToken
          );
        } else if (authToken) {
          result = await verifyPhonePePayment(merchantOrderId);
        } else {
          throw new Error(
            "Your payment session expired. Please log in and check your payment status."
          );
        }

        if (cancelled) return;
        result = result?.data?.data ?? result?.data ?? result;
        setDetails(result);

        const paymentStatus = String(
          result?.paymentStatus ||
            result?.order?.paymentStatus ||
            result?.status ||
            ""
        ).toUpperCase();

        if (isMembership) {
          if (
            paymentStatus === "COMPLETED" ||
            paymentStatus === "PAID" ||
            String(result?.membershipStatus || "").toLowerCase() === "active"
          ) {
            setStatus("SUCCESS");
            sessionStorage.removeItem("bhagyamma_pending_membership_payment");
            sessionStorage.removeItem(
              "bhagyamma_membership_payment_origin"
            );
            return;
          }

          if (["FAILED", "FAILURE", "CANCELLED"].includes(paymentStatus)) {
            setStatus("FAILED");
            setError(
              "Membership payment failed. Please try again later. Your membership has not been activated."
            );
            return;
          }
        } else {
          if (paymentStatus === "PAID") {
            setStatus("SUCCESS");
            try {
              await clearAll();
            } catch (cartError) {
              console.warn(
                "Payment confirmed, but cart cleanup failed:",
                cartError
              );
            }
            sessionStorage.removeItem("bhagyamma_guest_payment_token");
            sessionStorage.removeItem("bhagyamma_pending_payment");
            sessionStorage.removeItem("bhagyamma_pending_cart");
            return;
          }

          if (["FAILED", "FAILURE", "CANCELLED"].includes(paymentStatus)) {
            setStatus("FAILED");
            setError(
              "Product payment failed. Your order has not been confirmed. You can return to the product page and try again."
            );
            return;
          }
        }

        if (attempts >= maxAttempts) {
          setStatus("ERROR");
          setError(
            "Payment status is still pending. Please check again before making another payment."
          );
          return;
        }

        setStatus("PENDING");
        timer = setTimeout(verify, 3000);
      } catch (err) {
        if (cancelled) return;
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
      clearTimeout(timer);
    };
  }, [
    merchantOrderId,
    isMembership,
    guestPaymentToken,
    authToken,
    clearAll,
  ]);

  useEffect(() => {
  if (status !== "FAILED" || failureRedirected.current) {
    return;
  }

  failureRedirected.current = true;

  if (isMembership) {
    const origin =
      sessionStorage.getItem(
        "bhagyamma_membership_payment_origin"
      ) || membershipPaymentOrigin;

    sessionStorage.removeItem(
      "bhagyamma_membership_payment_origin"
    );

    sessionStorage.removeItem(
      "bhagyamma_pending_membership_payment"
    );

    if (origin === "registration") {
      navigate("/register", {
        replace: true,
        state: {
          membershipPaymentFailed: true,
          message:
            "Membership payment failed. Your account has been created, but your membership is not active. You can retry payment from your profile.",
        },
      });
    } else {
      navigate("/member/profile", {
        replace: true,
        state: {
          membershipPaymentFailed: true,
        },
      });
    }

    return;
  }

  let productId = "";

  try {
    const pendingCart = JSON.parse(
      sessionStorage.getItem("bhagyamma_pending_cart") || "{}"
    );

    const firstItem = pendingCart?.items?.[0];

    productId =
      firstItem?.productId?._id ||
      firstItem?.productId ||
      firstItem?.product?._id ||
      "";
  } catch (readError) {
    console.warn("Unable to read pending cart:", readError);
  }

  sessionStorage.removeItem(
    "bhagyamma_guest_payment_token"
  );
  sessionStorage.removeItem("bhagyamma_pending_payment");

  navigate(
    productId ? `/products/${productId}` : "/products",
    {
      replace: true,
      state: {
        paymentFailed: true,
        message:
          "Product payment failed. Your order was not confirmed. Please try again.",
      },
    }
  );
}, [
  status,
  isMembership,
  membershipPaymentOrigin,
  navigate,
]);

  const retryMembershipPayment = async () => {
    try {
      setRetrying(true);
      setError("");

      const payment = await createMembershipPhonePePayment();

      if (!payment?.redirectUrl || !payment?.merchantOrderId) {
        throw new Error("PhonePe did not return valid checkout details.");
      }

      sessionStorage.setItem(
        "bhagyamma_pending_membership_payment",
        payment.merchantOrderId
      );
      window.location.assign(payment.redirectUrl);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not restart membership payment. Please try again later."
      );
      setRetrying(false);
    }
  };

  const formatAmount = (amount) => {
    const value = Number(amount);
    return Number.isFinite(value)
      ? `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "Unavailable";
  };

  const renderPage = (content) => (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
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
        <Typography variant="h5" fontWeight={700} sx={{ mt: 3 }}>
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
        <HourglassTop sx={{ fontSize: 70, color: "warning.main" }} />
        <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
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
        <CheckCircle sx={{ fontSize: 85, color: "success.main" }} />
        <Typography variant="h4" fontWeight={800} sx={{ mt: 2 }}>
          {isMembership
            ? "Registration Payment Successful!"
            : "Payment Successful!"}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {isMembership
            ? "Your ₹2,000 payment is verified and your membership is active."
            : "Your payment has been successfully verified."}
        </Typography>
        <Alert severity="success" sx={{ mt: 3 }}>
          Payment confirmed by PhonePe
        </Alert>

        {isMembership ? (
          <Button
            fullWidth
            variant="contained"
            color="success"
            sx={{ mt: 4 }}
            onClick={() =>
              navigate("/member/dashboard", { replace: true })
            }
          >
            Go to Member Dashboard
          </Button>
        ) : (
          <>
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
                {details?.orderNumber ||
                  details?.orderId ||
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
                {formatAmount(details?.finalAmount)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 4 }}
              onClick={() =>
                navigate(isMember ? "/member/orders" : "/orders")
              }
            >
              View My Orders
            </Button>
          </>
        )}
      </>
    );
  }

  return renderPage(
    <>
      <ErrorOutline sx={{ fontSize: 80, color: "error.main" }} />
      <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
        {status === "ERROR"
          ? "Payment Status Not Confirmed"
          : isMembership
          ? "Membership Payment Failed"
          : "Product Payment Failed"}
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {isMembership
          ? "Your membership is not active. Membership failed; please try again later."
          : "Your order has not been confirmed because payment was unsuccessful."}
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mt: 3, textAlign: "left" }}>
          {error}
        </Alert>
      )}

      {isMembership ? (
        <>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 4 }}
            onClick={() => {
              const destination =
                membershipPaymentOrigin === "registration"
                  ? "/register"
                  : "/member/profile";

              sessionStorage.removeItem(
                "bhagyamma_membership_payment_origin"
              );
              navigate(destination, { replace: true });
            }}
          >
            {membershipPaymentOrigin === "registration"
              ? "Back to Create Account"
              : "Go to Profile"}
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 4 }}
          onClick={() => {
            const productId =
              details?.productId ||
              details?.product?._id ||
              details?.items?.[0]?.productId ||
              details?.items?.[0]?.product?._id;

            if (productId) {
              navigate(`/products/${productId}`, { replace: true });
            } else {
              navigate("/products", { replace: true });
            }
          }}
        >
          Back to Product Page
        </Button>
      )}
    </>
  );
};

export default PhonePeCallback;