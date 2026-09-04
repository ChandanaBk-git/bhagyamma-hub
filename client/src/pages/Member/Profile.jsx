import { useEffect, useState } from "react";

import {
  Box,
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


const Profile = () => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [toast, setToast] =
    useState({
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

      const response =
        await getProfile();

      console.log(
        "Profile API:",
        response
      );


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

        name:
          form.name,

        mobile:
          form.mobile,

        gender:
          form.gender,

        dateOfBirth:
          form.dateOfBirth,

        address:
          form.address,

        city:
          form.city,

        state:
          form.state,

        pincode:
          form.pincode,

        country:
          form.country,

        bankName:
          form.bankName,

        accountHolderName:
          form.accountHolderName,

        accountNumber:
          form.accountNumber,

        ifscCode:
          form.ifscCode,

        branch:
          form.branch,

        aadhaarNumber:
          form.aadhaarNumber,

        panNumber:
          form.panNumber,
      };


      const response =
        await updateProfile(
          payload
        );


      console.log(
        "Profile update response:",
        response
      );


      const updatedUser =
        response?.data ||
        response?.user ||
        response;


      setUser(
        updatedUser
      );


      setEditOpen(false);


      setToast({
        open: true,

        message:
          "Profile updated successfully",

        severity:
          "success",
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

        severity:
          "error",
      });

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // CLOSE TOAST
  // =====================================================

  const handleCloseToast = () => {

    setToast(
      (previous) => ({
        ...previous,
        open: false,
      })
    );

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

          justifyContent:
            "center",

          alignItems:
            "center",

          margin: 0,

          padding: 0,
        }}
      >

        <CircularProgress
          color="success"
        />

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

          padding: {
            xs: 2,
            sm: 3,
          },

          textAlign: "center",

          boxSizing:
            "border-box",
        }}
      >

        <Typography
          sx={{
            fontSize: {
              xs: "17px",
              sm: "20px",
            },

            fontWeight: 600,
          }}
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

        maxWidth: "100%",

        minWidth: 0,

        margin: 0,

        padding: 0,

        boxSizing:
          "border-box",

        backgroundColor:
          "#F5F7FA",

        minHeight:
          "100vh",

        overflowX:
          "hidden",

        borderRadius:
          "0 !important",


        /* ===============================================
           REMOVE OUTER CARD/PAPER CURVES
        =============================================== */

        "& .MuiCard-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiCardContent-root": {
          borderRadius:
            "0 !important",
        },


        /* ===============================================
           KEEP CONTENT INSIDE MOBILE SCREEN
        =============================================== */

        "& > *": {

          width: "100%",

          maxWidth: "100%",

          minWidth: 0,

          boxSizing:
            "border-box",
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

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
        }}
      >

        <ProfileHeader
          user={user}
        />

      </Box>


      {/* =================================================
          PERSONAL INFORMATION
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          margin: 0,

          padding: 0,

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
        }}
      >

        <PersonalInformation
          user={user}
          onEdit={
            handleOpenEdit
          }
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

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
        }}
      >

        <AddressInformation
          user={user}
        />

      </Box>


      {/* =================================================
          BANK INFORMATION
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          margin: 0,

          padding: 0,

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
        }}
      >

        <BankInformation
          user={user}
        />

      </Box>


      {/* =================================================
          KYC
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          margin: 0,

          padding: 0,

          boxSizing:
            "border-box",

          overflowX:
            "hidden",
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

          boxSizing:
            "border-box",

          overflowX:
            "hidden",

          pb: {
            xs: 2,
            sm: 4,
          },
        }}
      >

        <ProfileCompletion
          user={user}
        />

      </Box>


      {/* =================================================
          EDIT PROFILE DIALOG
      ================================================= */}

      <EditProfileDialog
        open={editOpen}

        onClose={
          handleCloseEdit
        }

        user={user}

        onSave={
          handleSave
        }

        saving={saving}
      />


      {/* =================================================
          TOAST
      ================================================= */}

      <Snackbar
        open={toast.open}

        autoHideDuration={4000}

        onClose={
          handleCloseToast
        }

        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >

        <Alert
          severity={
            toast.severity
          }

          onClose={
            handleCloseToast
          }

          sx={{
            width: "100%",

            borderRadius:
              "0 !important",
          }}
        >

          {toast.message}

        </Alert>

      </Snackbar>

    </Box>

  );

};


export default Profile;