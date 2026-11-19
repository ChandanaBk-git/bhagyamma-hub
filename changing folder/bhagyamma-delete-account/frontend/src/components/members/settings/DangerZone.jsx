import { useState } from "react";
import {
  Card, CardContent, Typography, Button, Stack, Alert, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, CircularProgress,
} from "@mui/material";
import { Logout, DeleteForever } from "@mui/icons-material";
import { deleteMyAccount } from "../../../services/auth.service";

const DangerZone = () => {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("member-settings");
    window.location.replace("/");
  };

  const handleLogout = () => {
    clearSession();
  };

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      setError("Enter your current password to continue.");
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await deleteMyAccount(password);
      clearSession();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to delete your account. Please try again."
      );
      setDeleting(false);
    }
  };

  const closeDeleteDialog = () => {
    if (deleting) return;
    setDeleteDialog(false);
    setPassword("");
    setError("");
  };

  return (
    <>
      <Card elevation={2} sx={{ borderRadius: 4, border: "2px solid #F44336", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="error" fontWeight="bold" mb={3}>
            Danger Zone
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Account deletion is permanent. Your profile will be anonymized and access will be disabled.
          </Alert>
          <Stack spacing={2}>
            <Button fullWidth variant="outlined" color="error" startIcon={<DeleteForever />} onClick={() => { setError(""); setPassword(""); setDeleteDialog(true); }}>
              Delete Account
            </Button>
            <Button fullWidth variant="contained" color="error" startIcon={<Logout />} onClick={handleLogout}>
              Logout From This Device
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={deleteDialog} onClose={closeDeleteDialog} fullWidth maxWidth="sm">
        <DialogTitle color="error">Permanently Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This will deactivate your member account, anonymize personal and contact details, remove your cart, and sign you out. Orders, payments, wallet transactions, commissions, referral and selling-point records may be retained where required for accounting, legal or audit purposes. This action cannot be undone.
          </DialogContentText>
          <Alert severity="error" sx={{ mb: 2 }}>
            Enter your current password to confirm. Only MEMBER accounts can use this option.
          </Alert>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            autoFocus
            type="password"
            label="Current password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={deleting}
            autoComplete="current-password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleting}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteAccount} disabled={deleting || !password} startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteForever />}>
            {deleting ? "Deleting..." : "Permanently Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DangerZone;
