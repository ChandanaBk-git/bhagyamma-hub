import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";

import {
  ArrowBack,
  Save,
  RestartAlt,
  Person,
  Payment,
  Description,
  Inventory,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

import {
  getMemberById,
  updateUser,
} from "../../services/admin.service";

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [openSnack, setOpenSnack] = useState(false);

  const [member, setMember] = useState({
    name: "",
    userId: "",
    referralCode: "",

    mobile: "",
    email: "",
    address: "",

    managerId: "",
    packageName: "",

    paymentStatus: "Pending",
    paymentDate: "",

    aadhaarReceived: false,
    panReceived: false,
    bankPassbookReceived: false,

    welcomeKitStatus: "Pending",
    welcomeKitReceived: false,

    adminNotes: "",
  });

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    try {
      const response = await getMemberById(id);

      if (response.success) {
        setMember(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMember((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheck = (e) => {
    setMember((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await updateUser(id, member);

      if (response.success) {
        setOpenSnack(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin/members")}
        >
          Back
        </Button>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Edit Member
        </Typography>

        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSubmit}
        >
          Save
        </Button>

      </Stack>

      <Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardContent>

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      mb={3}
    >
      <Person color="primary" />

      <Typography
        variant="h6"
        fontWeight="bold"
      >
        Member Information
      </Typography>
    </Stack>

    <Divider sx={{ mb: 3 }} />

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={member.name}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="User ID"
          value={member.userId}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Referral Code"
          value={member.referralCode}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Mobile Number"
          name="mobile"
          value={member.mobile}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={member.email}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          label="Package"
          name="packageName"
          value={member.packageName}
          onChange={handleChange}
        >
          <MenuItem value="">
            Select Package
          </MenuItem>

          <MenuItem value="Silver">
            Silver
          </MenuItem>

          <MenuItem value="Gold">
            Gold
          </MenuItem>

          <MenuItem value="Diamond">
            Diamond
          </MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Address"
          name="address"
          value={member.address}
          onChange={handleChange}
        />
      </Grid>

    </Grid>

  </CardContent>
</Card>
<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardContent>

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      mb={3}
    >
      <Payment color="primary" />

      <Typography
        variant="h6"
        fontWeight="bold"
      >
        Payment & Manager
      </Typography>

    </Stack>

    <Divider sx={{ mb: 3 }} />

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Manager"
          name="managerId"
          value={member.managerId}
          onChange={handleChange}
          placeholder="Manager ID"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          label="Payment Status"
          name="paymentStatus"
          value={member.paymentStatus}
          onChange={handleChange}
        >
          <MenuItem value="Pending">
            Pending
          </MenuItem>

          <MenuItem value="Paid">
            Paid
          </MenuItem>

          <MenuItem value="Rejected">
            Rejected
          </MenuItem>

        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="date"
          label="Payment Date"
          name="paymentDate"
          value={member.paymentDate || ""}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

    </Grid>

  </CardContent>
</Card>

<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardContent>

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      mb={3}
    >
      <Description color="primary" />

      <Typography
        variant="h6"
        fontWeight="bold"
      >
        Documents Received
      </Typography>

    </Stack>

    <Divider sx={{ mb: 3 }} />

    <Grid container spacing={2}>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="aadhaarReceived"
              checked={member.aadhaarReceived}
              onChange={handleCheck}
            />
          }
          label="Aadhaar Card Received"
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="panReceived"
              checked={member.panReceived}
              onChange={handleCheck}
            />
          }
          label="PAN Card Received"
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name="bankPassbookReceived"
              checked={member.bankPassbookReceived}
              onChange={handleCheck}
            />
          }
          label="Bank Passbook Received"
        />
      </Grid>

    </Grid>

  </CardContent>
</Card>

<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardContent>

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      mb={3}
    >
      <Inventory color="primary" />

      <Typography
        variant="h6"
        fontWeight="bold"
      >
        Welcome Kit
      </Typography>

    </Stack>

    <Divider sx={{ mb: 3 }} />

    <Grid container spacing={3}>

      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          label="Welcome Kit Status"
          name="welcomeKitStatus"
          value={member.welcomeKitStatus}
          onChange={handleChange}
        >
          <MenuItem value="Pending">
            Pending
          </MenuItem>

          <MenuItem value="Packed">
            Packed
          </MenuItem>

          <MenuItem value="Dispatched">
            Dispatched
          </MenuItem>

          <MenuItem value="Delivered">
            Delivered
          </MenuItem>

        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Checkbox
              name="welcomeKitReceived"
              checked={member.welcomeKitReceived}
              onChange={handleCheck}
            />
          }
          label="Welcome Kit Received"
        />
      </Grid>

    </Grid>

  </CardContent>
</Card>

<Card sx={{ mb: 4, borderRadius: 3 }}>
  <CardContent>

    <Typography
      variant="h6"
      fontWeight="bold"
      mb={3}
    >
      Admin Notes
    </Typography>

    <Divider sx={{ mb: 3 }} />

    <TextField
      fullWidth
      multiline
      rows={5}
      label="Admin Notes"
      name="adminNotes"
      value={member.adminNotes}
      onChange={handleChange}
    />

  </CardContent>
</Card>
<Stack
  direction="row"
  spacing={2}
  justifyContent="flex-end"
  sx={{ mt: 2, mb: 4 }}
>
  <Button
    variant="outlined"
    startIcon={<ArrowBack />}
    onClick={() => navigate("/admin/members")}
  >
    Cancel
  </Button>

  <Button
    variant="outlined"
    color="warning"
    startIcon={<RestartAlt />}
    onClick={loadMember}
  >
    Reset
  </Button>

  <Button
    variant="contained"
    color="primary"
    startIcon={<Save />}
    onClick={handleSubmit}
  >
    Save Changes
  </Button>
</Stack>

<Snackbar
  open={openSnack}
  autoHideDuration={3000}
  onClose={() => setOpenSnack(false)}
  anchorOrigin={{
    vertical: "top",
    horizontal: "right",
  }}
>
  <Alert
    severity="success"
    variant="filled"
    onClose={() => setOpenSnack(false)}
  >
    Member updated successfully.
  </Alert>
</Snackbar>

</Box>
);
};

export default EditMember;