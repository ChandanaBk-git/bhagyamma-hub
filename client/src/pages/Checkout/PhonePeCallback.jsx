
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
  verifyMembershipPhonePePayment,
} from "../../services/payment.service";
import { useCart } from "../../context/CartContext";

const PhonePeCallback = () => {
  const navigate = useNavigate();
  const { clearAll } = useCart();
  const [searchParams] = useSearchParams();

  const merchantOrderId = searchParams.get("merchantOrderId");
  const paymentType = String(
    searchParams.get("type") || "order"
  ).toLowerCase();

  const isMembership = paymentType === "membership";

  const guestPaymentToken = sessionStorage.getItem(
    "bhagyamma_guest_payment_token"
  );

  const authToken =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const isMember = Boolean(authToken) && !guestPaymentToken;

  const membershipPaymentOrigin =
    sessionStorage.getItem(
      "bhagyamma_membership_payment_origin"
    ) || "profile";

  const [status, setStatus] = useState("VERIFYING");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [checkAgain, setCheckAgain] = useState(0);

  // CartContext recreates clearAll on each render.
  // Keep the latest function without restarting verification.
  const clearAllRef = useRef(clearAll);

  useEffect(() => {
    clearAllRef.current = clearAll;
  }, [clearAll]);

  useEffect(() => {
    if (!merchantOrderId) {
      setStatus("FAILED");
      setError(
        "Payment reference was not found. Please check your orders or retry."
      );
      return undefined;
    }

    let cancelled = false;
    let timer;
    let attempts = 0;
    const maxAttempts = 20;

    const verify = async () => {
      try {
        attempts += 1;
        setError("");

        let result;

        if (isMembership) {
          result =
            await verifyMembershipPhonePePayment(
              merchantOrderId
            );
        } else if (guestPaymentToken) {
          result =
            await verifyGuestPhonePePayment(
              merchantOrderId,
              guestPaymentToken
            );
        } else if (authToken) {
          result =
            await verifyPhonePePayment(
              merchantOrderId
            );
        } else {
          throw new Error(
            "Your payment session expired. Please log in and check your payment status."
          );
        }

        if (cancelled) return;

        // Services normally return response.data.data.
        // This also safely handles wrapped responses.
        result =
          result?.data?.data ??
          result?.data ??
          result ??
          {};

        setDetails(result);

        const paymentStatus = String(
          result?.paymentStatus ||
            result?.order?.paymentStatus ||
            result?.status ||
            ""
        ).toUpperCase();

        const membershipActive =
          String(
            result?.membershipStatus || ""
          ).toLowerCase() === "active";

        if (isMembership) {
          if (
            paymentStatus === "COMPLETED" ||
            paymentStatus === "PAID" ||
            membershipActive
          ) {
            setStatus("SUCCESS");

            sessionStorage.removeItem(
              "bhagyamma_pending_membership_payment"
            );
            sessionStorage.removeItem(
              "bhagyamma_membership_payment_origin"
            );
            return;
          }

          if (
            ["FAILED", "FAILURE", "CANCELLED"].includes(
              paymentStatus
            )
          ) {
            setStatus("FAILED");
            setError(
              "Membership payment failed. Your membership has not been activated."
            );
            return;
          }
        } else {
          // Backend marks an order PAID only after PhonePe
          // confirms COMPLETED and the amount matches.
          const paymentConfirmed =
            paymentStatus === "PAID" ||
            String(
              result?.order?.paymentStatus || ""
            ).toUpperCase() === "PAID";

          if (paymentConfirmed) {
            setStatus("SUCCESS");

            try {
              await clearAllRef.current?.();
            } catch (cartError) {
              console.error(
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
            ["FAILED", "FAILURE", "CANCELLED"].includes(
              paymentStatus
            )
          ) {
            setStatus("FAILED");
            setError(
              "Product payment failed. Your order was not confirmed. You can return to the product page and try again."
            );
            return;
          }
        }

        if (attempts >= maxAttempts) {
          setStatus("ERROR");
          setError(
            "Payment status is still pending. Check the status again before making another payment."
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

    setStatus("VERIFYING");
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
    checkAgain,
  ]);

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
        <HourglassTop
          sx={{ fontSize: 70, color: "warning.main" }}
        />
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
        <CheckCircle
          sx={{ fontSize: 85, color: "success.main" }}
        />
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
              navigate("/member/dashboard", {
                replace: true,
              })
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
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Order ID
              </Typography>
              <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                {details?.orderNumber ||
                  details?.orderId ||
                  "Order reference unavailable"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography
                color="text.secondary"
                variant="body2"
              >
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
                navigate(
                  isMember
                    ? "/member/orders"
                    : "/orders"
                )
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
      <ErrorOutline
        sx={{ fontSize: 80, color: "error.main" }}
      />

      <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
        {status === "ERROR"
          ? "Payment Status Not Confirmed"
          : isMembership
          ? "Membership Payment Failed"
          : "Product Payment Failed"}
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {isMembership
          ? "Your membership is not active. Please check your payment status or retry from your profile."
          : "Your order has not been confirmed. Do not pay again until you check the payment status."}
      </Typography>

      {error && (
        <Alert
          severity="warning"
          sx={{ mt: 3, textAlign: "left" }}
        >
          {error}
        </Alert>
      )}

      {status === "ERROR" && (
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => {
            setError("");
            setStatus("VERIFYING");
            setCheckAgain((value) => value + 1);
          }}
        >
          Check Payment Status Again
        </Button>
      )}

      {isMembership ? (
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

            navigate(destination, {
              replace: true,
            });
          }}
        >
          {membershipPaymentOrigin === "registration"
            ? "Back to Create Account"
            : "Go to Profile"}
        </Button>
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

            navigate(
              productId
                ? `/products/${productId}`
                : "/products",
              { replace: true }
            );
          }}
        >
          Back to Product Page
        </Button>
      )}
    </>
  );
};

export default PhonePeCallback;
