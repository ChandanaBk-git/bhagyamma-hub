import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";

// import KYCInformation from "./KYCInformation";

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

const Profile = () => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();

      /*
       * ApiResponse normally returns:
       *
       * {
       *   statusCode,
       *   message,
       *   data
       * }
       *
       * Keep a fallback so the page also works
       * if the API returns the user directly.
       */

      const profile =
        response?.data ||
        response?.user ||
        response;

      setUser(profile);

    } catch (error) {
      console.error(
        "Profile loading error:",
        error
      );

      const message =
        error?.response?.data?.message ||
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

  // =====================================================
  // OPEN EDIT PROFILE
  // =====================================================

  const handleOpenEdit = () => {
    setEditOpen(true);
  };

  // =====================================================
  // CLOSE EDIT PROFILE
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

      /*
       * Send only the fields supported by
       * the backend profile update service.
       */

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
        accountHolderName:
          form.accountHolderName,
        accountNumber:
          form.accountNumber,
        ifscCode: form.ifscCode,
        branch: form.branch,

        aadhaarNumber:
          form.aadhaarNumber,
        panNumber:
          form.panNumber,
      };

      const response =
        await updateProfile(payload);

      /*
       * Backend returns ApiResponse:
       *
       * {
       *   statusCode,
       *   message,
       *   data
       * }
       */

      const updatedUser =
        response?.data ||
        response?.user ||
        response;

      // Update UI immediately
      setUser(updatedUser);

      // Close dialog
      setEditOpen(false);

      // Success message
      setToast({
        open: true,
        message:
          "Profile updated successfully",
        severity: "success",
      });

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      const message =
        error?.response?.data?.message ||
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
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
        >
          Unable to load profile
        </Typography>
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
        maxWidth: 1400,
        mx: "auto",
        p: {
          xs: 1,
          sm: 2,
          md: 3,
        },
        pb: 6,
      }}
    >
      {/* ===============================================
          PROFILE HEADER
      ================================================ */}

      <ProfileHeader user={user} />

      {/* ===============================================
          PERSONAL INFORMATION
      ================================================ */}

      <PersonalInformation
        user={user}
        onEdit={handleOpenEdit}
      />

      {/* ===============================================
          ADDRESS
      ================================================ */}

      <AddressInformation
        user={user}
      />

      {/* ===============================================
          BANK
      ================================================ */}

      <BankInformation
        user={user}
      />

      {/* ===============================================
          KYC
      ================================================ */}

<KYCInformation />

      {/* ===============================================
          PROFILE COMPLETION
      ================================================ */}

      <ProfileCompletion
        user={user}
      />

      {/* ===============================================
          EDIT PROFILE DIALOG
      ================================================ */}

      <EditProfileDialog
        open={editOpen}
        onClose={handleCloseEdit}
        user={user}
        onSave={handleSave}
        saving={saving}
      />

      {/* ===============================================
          TOAST
      ================================================ */}

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
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;