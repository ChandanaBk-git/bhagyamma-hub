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


  const textFieldSx = {
    "& .MuiInputBase-root": {
      borderRadius: 0,

      minHeight: {
        xs: 40,
        sm: 42,
      },

      fontSize: {
        xs: "11px",
        sm: "12px",
        md: "13px",
      },
    },

    "& .MuiInputLabel-root": {
      fontSize: {
        xs: "10px",
        sm: "11px",
        md: "12px",
      },
    },

    "& .MuiInputBase-input": {
      py: {
        xs: "9px",
        sm: "10px",
      },
    },

    "& .MuiInputBase-inputMultiline": {
      py: "7px",
    },
  };


  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"

      PaperProps={{
        sx: {
          borderRadius: 0,

          border: "1px solid #E0E0E0",

          boxShadow: "none",

          width: "100%",

          m: {
            xs: 1,
            sm: 2,
          },

          maxHeight: {
            xs: "calc(100% - 16px)",
            sm: "calc(100% - 32px)",
          },
        },
      }}
    >

      {/* =========================================
          TITLE
      ========================================== */}

      <DialogTitle
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },

          py: {
            xs: 1,
            sm: 1.25,
          },

          fontWeight: 700,

          fontSize: {
            xs: "15px",
            sm: "17px",
            md: "19px",
          },

          lineHeight: 1.2,

          borderBottom: "1px solid #E0E0E0",
        }}
      >
        Edit Profile
      </DialogTitle>


      <DialogContent
        dividers
        sx={{
          px: {
            xs: 1.25,
            sm: 2,
            md: 2.5,
          },

          py: {
            xs: 1.25,
            sm: 1.5,
            md: 2,
          },

          borderTop: "none",

          borderBottom: "none",

          "&::-webkit-scrollbar": {
            width: "5px",
          },
        }}
      >

        {/* =========================================
            PERSONAL INFORMATION
        ========================================== */}

        <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "15px",
            },

            lineHeight: 1.2,

            mb: {
              xs: 1,
              sm: 1.25,
            },

            color: "#292929",
          }}
        >
          Personal Information
        </Typography>


        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.25,
            md: 1.5,
          }}
        >

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              sx={textFieldSx}
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
              sx={textFieldSx}
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
              sx={textFieldSx}
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
              sx={textFieldSx}
            />
          </Grid>

        </Grid>


        <Divider
          sx={{
            my: {
              xs: 1.5,
              sm: 2,
            },
          }}
        />


        {/* =========================================
            ADDRESS INFORMATION
        ========================================== */}

        <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "15px",
            },

            lineHeight: 1.2,

            mb: {
              xs: 1,
              sm: 1.25,
            },

            color: "#292929",
          }}
        >
          Address Information
        </Typography>


        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.25,
            md: 1.5,
          }}
        >

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              sx={textFieldSx}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              sx={textFieldSx}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              sx={textFieldSx}
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
              sx={textFieldSx}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              sx={textFieldSx}
            />
          </Grid>

        </Grid>


        <Divider
          sx={{
            my: {
              xs: 1.5,
              sm: 2,
            },
          }}
        />


        {/* =========================================
            BANK INFORMATION
        ========================================== */}

        <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "15px",
            },

            lineHeight: 1.2,

            mb: {
              xs: 1,
              sm: 1.25,
            },

            color: "#292929",
          }}
        >
          Bank Information
        </Typography>


        <Box
          sx={{
            mb: {
              xs: 1,
              sm: 1.25,
            },

            p: {
              xs: 1,
              sm: 1.25,
            },

            borderRadius: 0,

            border: "1px solid #E0E0E0",

            backgroundColor: "#FFF8E1",
          }}
        >

          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "9px",
                sm: "10px",
                md: "11px",
              },

              lineHeight: 1.35,
            }}
          >
            Enter your bank details carefully. These
            details may be used for eligible payments
            and withdrawals.
          </Typography>

        </Box>


        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.25,
            md: 1.5,
          }}
        >

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Bank Name"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              sx={textFieldSx}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Holder Name"
              name="accountHolderName"
              value={form.accountHolderName}
              onChange={handleChange}
              sx={textFieldSx}
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
              sx={textFieldSx}
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
              sx={textFieldSx}
            />
          </Grid>


          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Branch"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              sx={textFieldSx}
            />
          </Grid>

        </Grid>


        <Divider
          sx={{
            my: {
              xs: 1.5,
              sm: 2,
            },
          }}
        />


        {/* =========================================
            KYC INFORMATION
        ========================================== */}

        <Typography
          fontWeight={700}
          sx={{
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "15px",
            },

            lineHeight: 1.2,

            mb: {
              xs: 1,
              sm: 1.25,
            },

            color: "#292929",
          }}
        >
          KYC Information
        </Typography>


        <Box
          sx={{
            mb: {
              xs: 1,
              sm: 1.25,
            },

            p: {
              xs: 1,
              sm: 1.25,
            },

            borderRadius: 0,

            border: "1px solid #E0E0E0",

            backgroundColor: "#E3F2FD",
          }}
        >

          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "9px",
                sm: "10px",
                md: "11px",
              },

              lineHeight: 1.35,
            }}
          >
            You can submit or update your KYC
            information here. KYC verification status
            is controlled by the administrator.
          </Typography>

        </Box>


        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.25,
            md: 1.5,
          }}
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
              sx={textFieldSx}
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
              sx={textFieldSx}
            />
          </Grid>

        </Grid>

      </DialogContent>


      {/* =========================================
          ACTIONS
      ========================================== */}

      <DialogActions
        sx={{
          px: {
            xs: 1.25,
            sm: 2,
            md: 2.5,
          },

          py: {
            xs: 1,
            sm: 1.25,
          },

          borderTop: "1px solid #E0E0E0",

          gap: 0.75,
        }}
      >

        <Button
          onClick={onClose}
          disabled={saving}
          color="inherit"
          sx={{
            minHeight: {
              xs: 34,
              sm: 38,
            },

            px: {
              xs: 1.5,
              sm: 2,
            },

            borderRadius: 0,

            fontSize: {
              xs: "10px",
              sm: "11px",
              md: "12px",
            },

            textTransform: "none",
          }}
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
                size={15}
                color="inherit"
              />
            ) : null
          }
          sx={{
            minHeight: {
              xs: 34,
              sm: 38,
            },

            px: {
              xs: 1.5,
              sm: 2,
            },

            borderRadius: 0,

            boxShadow: "none",

            fontSize: {
              xs: "10px",
              sm: "11px",
              md: "12px",
            },

            fontWeight: 600,

            textTransform: "none",

            "&:hover": {
              boxShadow: "none",
            },
          }}
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