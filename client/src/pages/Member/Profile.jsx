import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";

import ProfileHeader from "../../components/members/profile/ProfileHeader";
import PersonalInformation from "../../components/members/profile/PersonalInformation";
import AddressInformation from "../../components/members/profile/AddressInformation";
import BankInformation from "../../components/members/profile/BankInformation";
import KYCInformation from "../../components/members/profile/KYCInformation";
import ProfileCompletion from "../../components/members/profile/ProfileCompletion";
import EditProfileDialog from "../../components/members/profile/EditProfileDialog";

import {
  getProfile,
  updateProfile,
} from "../../services/auth.service";

import {
  createMembershipPhonePePayment,
} from "../../services/payment.service";

const unwrapApiData = (response) => {
  // Supports Axios responses and the project's ApiResponse format.
  let data = response?.data ?? response;

  if (data?.data !== undefined) {
    data = data.data;
  }

  if (data?.user !== undefined) {
    data = data.user;
  }

  return data;
};

const normalizeStatus = (status) =>
  String(status || "").trim().toLowerCase();

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [membershipPaymentLoading, setMembershipPaymentLoading] =
    useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();

      console.log("Profile API:", response);

      const profile = unwrapApiData(response);

      if (!profile || typeof profile !== "object") {
        throw new Error("Profile data was not returned by the server.");
      }

      setUser(profile);
    } catch (error) {
      console.error("Profile loading error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load profile";

      setToast({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // loadProfile is intentionally called once when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // MEMBERSHIP PHONEPE PAYMENT
  // =====================================================

  const handleMembershipPayment = async () => {
    try {
      setMembershipPaymentLoading(true);

      sessionStorage.setItem("bhagyamma_membership_payment_origin", "profile");

      const payment = await createMembershipPhonePePayment();

      if (!payment?.redirectUrl || !payment?.merchantOrderId) {
        throw new Error(
          "PhonePe checkout details were not returned. Please try again."
        );
      }

      sessionStorage.setItem(
        "bhagyamma_pending_membership_payment",
        payment.merchantOrderId
      );

      window.location.assign(payment.redirectUrl);
    } catch (error) {
      console.error("Membership payment error:", error);

      setToast({
        open: true,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to start membership payment. Please try again.",
        severity: "error",
      });

      setMembershipPaymentLoading(false);
    }
  };

  // Show the payment card only for an explicitly pending membership.
  // Active, suspended, missing, or any other status will not show it.
  const membershipStatus = normalizeStatus(user?.membershipStatus);
  const showMembershipPayment = membershipStatus === "pending";
  const membershipIsActive = membershipStatus === "active";

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEdit = () => {
    setEditOpen(true);
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setEditOpen(false);
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (form) => {
    try {
      setSaving(true);

      const payload = {
        name: form.name,
        mobile: form.mobile,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,

        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: form.country,

        bankName: form.bankName,
        accountHolderName: form.accountHolderName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        branch: form.branch,

        aadhaarNumber: form.aadhaarNumber,
        panNumber: form.panNumber,
      };

      const response = await updateProfile(payload);

      console.log("Profile update response:", response);

      const updatedUser = unwrapApiData(response);

      if (updatedUser && typeof updatedUser === "object") {
        setUser((previous) => ({
          ...previous,
          ...updatedUser,
        }));
      } else {
        await loadProfile();
      }

      setEditOpen(false);

      setToast({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Profile update error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Profile update failed";

      setToast({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CLOSE TOAST
  // =====================================================

  const handleCloseToast = () => {
    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  // =====================================================
  // PROFILE NOT FOUND
  // =====================================================

  if (!user) {
    return (
      <Box
        sx={{
          width: "100%",
          margin: 0,
          padding: { xs: 1.5, sm: 2 },
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "17px" },
            fontWeight: 600,
          }}
        >
          Unable to load profile
        </Typography>

        <Button
          variant="outlined"
          color="success"
          onClick={loadProfile}
          sx={{ mt: 2, borderRadius: 0 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        backgroundColor: "#F5F7FA",
        minHeight: "100vh",
        overflowX: "hidden",
        borderRadius: "0 !important",

        "& .MuiCard-root": {
          borderRadius: "0 !important",
        },
        "& .MuiPaper-root": {
          borderRadius: "0 !important",
        },
        "& .MuiCardContent-root": {
          borderRadius: "0 !important",
        },
        "& .MuiAlert-root": {
          borderRadius: "0 !important",
        },
        "& .MuiButton-root": {
          borderRadius: "0 !important",
        },
        "& .MuiChip-root": {
          borderRadius: "0 !important",
        },
        "& > *": {
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        },
      }}
    >
      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <ProfileHeader user={user} />
      </Box>

      {/* =================================================
          MEMBERSHIP STATUS
      ================================================= */}

      {membershipIsActive && (
        <Box
          sx={{
            width: "100%",
            px: { xs: 1.5, sm: 2 },
            py: 1,
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid #C8E6C9",
              backgroundColor: "#F1F8E9",
              px: 1.5,
              py: 1,
            }}
          >
            <Chip label="✓" color="success" size="small" />
            <Typography fontWeight={700} fontSize="13px" color="success.dark">
              Membership Activated
            </Typography>
          </Box>
        </Box>
      )}

      {/* =================================================
          MEMBERSHIP REGISTRATION PAYMENT
          Visible ONLY when membershipStatus is Pending.
      ================================================= */}

      {showMembershipPayment && (
        <Box
          sx={{
            width: "100%",
            px: { xs: 1.5, sm: 2 },
            py: 1.5,
            boxSizing: "border-box",
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: "100%",
              border: "1px solid #E0E0E0",
              backgroundColor: "#FFFFFF",
              boxShadow: "none",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2, sm: 2.5 },
                "&:last-child": { pb: { xs: 2, sm: 2.5 } },
              }}
            >
              <Box
                display="flex"
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                flexDirection={{ xs: "column", sm: "row" }}
                gap={2}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    flexWrap="wrap"
                  >
                    <Typography fontWeight={700} fontSize="16px">
                      Complete Registration Payment
                    </Typography>

                    <Chip
                      label="Membership Pending"
                      color="warning"
                      size="small"
                    />
                  </Box>

                  <Typography
                    color="text.secondary"
                    fontSize="12px"
                    mt={0.75}
                  >
                    Complete your one-time membership payment to
                    activate your Bhagyamma Hub membership.
                  </Typography>

                  <Typography
                    fontWeight={800}
                    fontSize="25px"
                    color="success.main"
                    mt={1}
                  >
                    ₹2,000
                  </Typography>

                  <Typography
                    color="text.secondary"
                    fontSize="11px"
                    mt={0.75}
                    sx={{ lineHeight: 1.5 }}
                  >
                    Disclaimer: Pay the one-time ₹2,000 registration amount to
                    activate your membership. After successful payment, 40 SP
                    will be credited to your account.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={membershipPaymentLoading}
                  onClick={handleMembershipPayment}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { sm: 220 },
                    py: 1.2,
                    px: 2.5,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 0,
                    whiteSpace: "normal",
                  }}
                >
                  {membershipPaymentLoading ? (
                    <>
                      <CircularProgress
                        size={18}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                      Connecting to PhonePe...
                    </>
                  ) : (
                    "Pay ₹2,000 Registration Fee"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* =================================================
          PERSONAL INFORMATION
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <PersonalInformation
          user={user}
          onEdit={handleOpenEdit}
        />
      </Box>

      {/* =================================================
          ADDRESS
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <AddressInformation user={user} />
      </Box>

      {/* =================================================
          BANK INFORMATION
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <BankInformation user={user} />
      </Box>

      {/* =================================================
          KYC
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <KYCInformation />
      </Box>

      {/* =================================================
          PROFILE COMPLETION
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          overflowX: "hidden",
          pb: { xs: 1.5, sm: 2.5 },
        }}
      >
        <ProfileCompletion user={user} />
      </Box>

      {/* =================================================
          EDIT PROFILE DIALOG
      ================================================= */}

      <EditProfileDialog
        open={editOpen}
        onClose={handleCloseEdit}
        user={user}
        onSave={handleSave}
        saving={saving}
      />

      {/* =================================================
          TOAST
      ================================================= */}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={toast.severity}
          onClose={handleCloseToast}
          sx={{
            width: "100%",
            borderRadius: "0 !important",
            fontSize: { xs: "11px", sm: "12px" },
            boxSizing: "border-box",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
