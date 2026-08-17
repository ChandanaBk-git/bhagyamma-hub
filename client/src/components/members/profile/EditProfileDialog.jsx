import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Divider,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const EditProfileDialog = ({
  open,
  onClose,
  user = {},
  onSave,
  saving = false,
}) => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    dateOfBirth: "",

    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",

    aadhaarNumber: "",
    panNumber: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      mobile: user.mobile || "",
      gender: user.gender || "",

      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth)
            .toISOString()
            .split("T")[0]
        : "",

      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
      country: user.country || "India",

      bankName: user.bankName || "",
      accountHolderName:
        user.accountHolderName || "",
      accountNumber:
        user.accountNumber || "",
      ifscCode:
        user.ifscCode || "",
      branch:
        user.branch || "",

      aadhaarNumber:
        user.aadhaarNumber || "",
      panNumber:
        user.panNumber || "",
    });
  }, [user, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave?.(form);
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          pb: 1,
        }}
      >
        Edit Profile
      </DialogTitle>

      <DialogContent dividers>
        {/* =========================================
            PERSONAL INFORMATION
        ========================================== */}

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          Personal Information
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <MenuItem value="">
                Not Selected
              </MenuItem>

              <MenuItem value="Male">
                Male
              </MenuItem>

              <MenuItem value="Female">
                Female
              </MenuItem>

              <MenuItem value="Other">
                Other
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* =========================================
            ADDRESS INFORMATION
        ========================================== */}

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          Address Information
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              inputProps={{
                maxLength: 6,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* =========================================
            BANK INFORMATION
        ========================================== */}

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          Bank Information
        </Typography>

        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "warning.light",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Enter your bank details carefully. These
            details may be used for eligible payments
            and withdrawals.
          </Typography>
        </Box>

        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Holder Name"
              name="accountHolderName"
              value={form.accountHolderName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Number"
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
              type="text"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IFSC Code"
              name="ifscCode"
              value={form.ifscCode}
              onChange={handleChange}
              inputProps={{
                maxLength: 11,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* =========================================
            KYC INFORMATION
        ========================================== */}

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          KYC Information
        </Typography>

        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "info.light",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            You can submit or update your KYC
            information here. KYC verification status
            is controlled by the administrator.
          </Typography>
        </Box>

        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Aadhaar Number"
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={handleChange}
              inputProps={{
                maxLength: 12,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="PAN Number"
              name="panNumber"
              value={form.panNumber}
              onChange={handleChange}
              inputProps={{
                maxLength: 10,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={onClose}
          disabled={saving}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          disabled={saving}
          startIcon={
            saving ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : null
          }
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;