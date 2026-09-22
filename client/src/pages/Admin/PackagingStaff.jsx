import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";

import {
  createPackagingStaff,
  getPackagingStaff,
  updatePackagingStaff,
} from "../../api/packaging.api";

const PackagingStaff = () => {

  // =====================================================
  // CREATE FORM
  // =====================================================

  const [form, setForm] = useState({
    name: "",
    loginId: "",
    password: "",
    branchName: "",
    branchMemberNumber: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  // =====================================================
  // STAFF
  // =====================================================

  const [staffList, setStaffList] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingStaff, setLoadingStaff] =
    useState(true);

  // =====================================================
  // MESSAGES
  // =====================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [createdCredentials, setCreatedCredentials] =
    useState(null);

  // =====================================================
  // EDIT
  // =====================================================

  const [editOpen, setEditOpen] =
    useState(false);

  const [editingStaff, setEditingStaff] =
    useState(null);

  const [editForm, setEditForm] =
    useState({
      name: "",
      loginId: "",
      password: "",
      branchName: "",
      branchMemberNumber: "",
      isActive: true,
    });

  const [editLoading, setEditLoading] =
    useState(false);

  // =====================================================
  // LOAD STAFF
  // =====================================================

  const loadStaff = async () => {

    try {

      setLoadingStaff(true);
      setError("");

      const response =
        await getPackagingStaff();

      const data =
        response?.data?.data ||
        response?.data ||
        [];

      setStaffList(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load packaging staff:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load Packaging Team accounts."
      );

    } finally {

      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // =====================================================
  // CREATE FORM CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE STAFF
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");
    setCreatedCredentials(null);

    const name =
      form.name.trim();

    const loginId =
      form.loginId
        .trim()
        .toUpperCase();

    const password =
      form.password;

    const branchName =
      form.branchName.trim();

    const branchMemberNumber =
      form.branchMemberNumber
        .trim()
        .toUpperCase();

    if (!name) {

      setError(
        "Please enter the Packaging staff name."
      );

      return;
    }

    if (!loginId) {

      setError(
        "Please enter a Login ID."
      );

      return;
    }

    if (password.length < 8) {

      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }

    if (!branchName) {

      setError(
        "Please enter the Branch Name."
      );

      return;
    }

    if (!branchMemberNumber) {

      setError(
        "Please enter the Branch Member Number."
      );

      return;
    }

    try {

      setLoading(true);

      const response =
        await createPackagingStaff({
          name,
          loginId,
          password,
          branchName,
          branchMemberNumber,
        });

      const created =
        response?.data?.data ||
        response?.data ||
        {};

      setCreatedCredentials({

        name:
          created.name ||
          name,

        loginId:
          created.loginId ||
          loginId,

        password:
          created.password ||
          password,

        branchName:
          created.branchName ||
          branchName,

        branchMemberNumber:
          created.branchMemberNumber ||
          branchMemberNumber,
      });

      setSuccess(
        "Packaging account created successfully."
      );

      setForm({
        name: "",
        loginId: "",
        password: "",
        branchName: "",
        branchMemberNumber: "",
      });

      await loadStaff();

    } catch (err) {

      console.error(
        "Create Packaging Staff error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to create Packaging account."
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // COPY CREDENTIALS
  // =====================================================

  const copyCredentials = async () => {

    if (!createdCredentials)
      return;

    const text = `Bhagyamma Hub Packaging Login

Name: ${createdCredentials.name}
Login ID: ${createdCredentials.loginId}
Password: ${createdCredentials.password}
Branch Name: ${createdCredentials.branchName}
Branch Member Number: ${createdCredentials.branchMemberNumber}

Login URL:
${window.location.origin}/login`;

    try {

      await navigator.clipboard.writeText(
        text
      );

      setSuccess(
        "Packaging login credentials copied."
      );

    } catch (err) {

      console.error(
        "Copy failed:",
        err
      );

      setError(
        "Unable to copy credentials."
      );
    }
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (staff) => {

    setEditingStaff(staff);

    setEditForm({

      name:
        staff.name || "",

      loginId:
        staff.loginId || "",

      password:
        "",

      branchName:
        staff.branchName || "",

      branchMemberNumber:
        staff.branchMemberNumber || "",

      isActive:
        staff.isActive !== false,
    });

    setError("");
    setSuccess("");

    setEditOpen(true);
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE STAFF
  // =====================================================

  const handleUpdate = async () => {

    if (!editingStaff)
      return;

    setError("");
    setSuccess("");

    const name =
      editForm.name.trim();

    const loginId =
      editForm.loginId
        .trim()
        .toUpperCase();

    const branchName =
      editForm.branchName.trim();

    const branchMemberNumber =
      editForm.branchMemberNumber
        .trim()
        .toUpperCase();

    if (!name) {

      setError(
        "Name is required."
      );

      return;
    }

    if (!loginId) {

      setError(
        "Login ID is required."
      );

      return;
    }

    if (!branchName) {

      setError(
        "Branch Name is required."
      );

      return;
    }

    if (!branchMemberNumber) {

      setError(
        "Branch Member Number is required."
      );

      return;
    }

    if (
      editForm.password &&
      editForm.password.length < 8
    ) {

      setError(
        "New password must contain at least 8 characters."
      );

      return;
    }

    try {

      setEditLoading(true);

      const payload = {

        name,

        loginId,

        branchName,

        branchMemberNumber,

        isActive:
          editForm.isActive,
      };

      if (
        editForm.password.trim()
      ) {

        payload.password =
          editForm.password;
      }

      await updatePackagingStaff(
        editingStaff._id ||
        editingStaff.id,
        payload
      );

      setSuccess(
        "Packaging account updated successfully."
      );

      setEditOpen(false);
      setEditingStaff(null);

      await loadStaff();

    } catch (err) {

      console.error(
        "Update Packaging Staff error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to update Packaging account."
      );

    } finally {

      setEditLoading(false);
    }
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {

    if (editLoading)
      return;

    setEditOpen(false);
    setEditingStaff(null);
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f6",
        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >

        <Box
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ececeb",
            color: "#444",
          }}
        >
          <LocalShippingRoundedIcon
            fontSize="small"
          />
        </Box>

        <Box>

          <Typography
            sx={{
              fontSize: {
                xs: "1.1rem",
                sm: "1.35rem",
              },
              fontWeight: 700,
              color: "#222",
            }}
          >
            Packaging Team
          </Typography>

          <Typography
            sx={{
              fontSize: "0.82rem",
              color: "#777",
            }}
          >
            Manage packaging staff accounts
          </Typography>

        </Box>

      </Box>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      )}

      {success && (

        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
          onClose={() =>
            setSuccess("")
          }
        >
          {success}
        </Alert>
      )}

      {/* =================================================
          CREATE ACCOUNT
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          borderRadius: 2.5,
          border:
            "1px solid #e5e5e3",
          backgroundColor: "#fff",
          mb: 2.5,
        }}
      >

        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#222",
            mb: 0.5,
          }}
        >
          Create Packaging Account
        </Typography>

        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "#777",
            mb: 2.5,
          }}
        >
          Add the staff details and branch information.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 1.5,
            }}
          >

            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />

            <TextField
              label="Login ID"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />

            <TextField
              label="Password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      size="small"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffRoundedIcon
                          fontSize="small"
                        />
                      ) : (
                        <VisibilityRoundedIcon
                          fontSize="small"
                        />
                      )}
                    </IconButton>

                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Branch Name"
              name="branchName"
              value={form.branchName}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />

            <TextField
              label="Branch Member Number"
              name="branchMemberNumber"
              value={
                form.branchMemberNumber
              }
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />

          </Box>

          <Button
            type="submit"
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              ) : (
                <AddRoundedIcon
                  fontSize="small"
                />
              )
            }
            disabled={loading}
            sx={{
              mt: 2,
              width: {
                xs: "100%",
                sm: "auto",
              },
              backgroundColor: "#333",
              color: "#fff",
              borderRadius: 1.5,
              px: 2.5,
              py: 1,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#222",
                boxShadow: "none",
              },
            }}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </Button>

        </Box>

      </Paper>

      {/* =================================================
          CREATED CREDENTIALS
      ================================================= */}

      {createdCredentials && (

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
            mb: 2.5,
            borderRadius: 2.5,
            border:
              "1px solid #dedede",
            backgroundColor: "#fafafa",
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              justifyContent:
                "space-between",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              gap: 1.5,
            }}
          >

            <Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Account Created
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: "#777",
                  mt: 0.3,
                }}
              >
                Save these credentials securely.
              </Typography>

            </Box>

            <Button
              variant="outlined"
              size="small"
              startIcon={
                <ContentCopyRoundedIcon
                  fontSize="small"
                />
              }
              onClick={
                copyCredentials
              }
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
                textTransform: "none",
                borderColor: "#ccc",
                color: "#333",
              }}
            >
              Copy Credentials
            </Button>

          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 1.5,
            }}
          >

            {[
              [
                "Name",
                createdCredentials.name,
              ],
              [
                "Login ID",
                createdCredentials.loginId,
              ],
              [
                "Password",
                createdCredentials.password,
              ],
              [
                "Branch",
                createdCredentials.branchName,
              ],
              [
                "Member Number",
                createdCredentials.branchMemberNumber,
              ],
            ].map(
              ([label, value]) => (

                <Box key={label}>

                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "#888",
                      mb: 0.3,
                    }}
                  >
                    {label}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {value}
                  </Typography>

                </Box>

              )
            )}

          </Box>

          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: "#f1f1ef",
            }}
          >

            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#888",
              }}
            >
              Common Login
            </Typography>

            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                wordBreak: "break-all",
              }}
            >
              {window.location.origin}/login
            </Typography>

          </Box>

        </Paper>
      )}

      {/* =================================================
          STAFF LIST
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2.5,
          border:
            "1px solid #e5e5e3",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 2.5,
            },
          }}
        >

          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            Packaging Accounts
          </Typography>

          <Typography
            sx={{
              fontSize: "0.78rem",
              color: "#777",
              mt: 0.3,
            }}
          >
            Accounts created by Admin
          </Typography>

        </Box>

        <Divider />

        {loadingStaff ? (

          <Box
            sx={{
              py: 5,
              display: "flex",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress
              size={25}
            />
          </Box>

        ) : staffList.length === 0 ? (

          <Box
            sx={{
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: "#888",
              }}
            >
              No Packaging accounts created yet.
            </Typography>
          </Box>

        ) : (

          <TableContainer
            sx={{
              overflowX: "auto",
            }}
          >

            <Table
              size="small"
              sx={{
                minWidth: 760,
              }}
            >

              <TableHead>

                <TableRow
                  sx={{
                    backgroundColor:
                      "#fafafa",
                  }}
                >

                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Login ID</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Branch</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Member No.</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Created</strong>
                  </TableCell>

                  <TableCell
                    align="right"
                  >
                    <strong>Action</strong>
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {staffList.map(
                  (staff) => (

                    <TableRow
                      key={
                        staff._id ||
                        staff.id
                      }
                      hover
                    >

                      <TableCell>
                        {staff.name || "-"}
                      </TableCell>

                      <TableCell>

                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          {staff.loginId || "-"}
                        </Typography>

                      </TableCell>

                      <TableCell>
                        {staff.branchName ||
                          "-"}
                      </TableCell>

                      <TableCell>
                        {staff.branchMemberNumber ||
                          "-"}
                      </TableCell>

                      <TableCell>

                        <Chip
                          label={
                            staff.isActive
                              ? "Active"
                              : "Inactive"
                          }
                          size="small"
                          sx={{
                            height: 24,
                            fontSize:
                              "0.7rem",
                            backgroundColor:
                              staff.isActive
                                ? "#eeeeee"
                                : "#f5f5f5",
                            color:
                              staff.isActive
                                ? "#444"
                                : "#888",
                          }}
                        />

                      </TableCell>

                      <TableCell>

                        {staff.createdAt
                          ? new Date(
                              staff.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </TableCell>

                      <TableCell
                        align="right"
                      >

                        <IconButton
                          size="small"
                          onClick={() =>
                            openEdit(
                              staff
                            )
                          }
                          sx={{
                            color: "#555",
                          }}
                        >
                          <EditRoundedIcon
                            fontSize="small"
                          />
                        </IconButton>

                      </TableCell>

                    </TableRow>

                  )
                )}

              </TableBody>

            </Table>

          </TableContainer>
        )}

      </Paper>

      {/* =================================================
          EDIT DIALOG
      ================================================= */}

      <Dialog
        open={editOpen}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            m: {
              xs: 1.5,
              sm: 2,
            },
          },
        }}
      >

        <DialogTitle
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            pb: 1,
          }}
        >
          Edit Packaging Account
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            pt: "20px !important",
          }}
        >

          <Stack spacing={1.5}>

            <TextField
              label="Name"
              name="name"
              value={editForm.name}
              onChange={
                handleEditChange
              }
              fullWidth
              size="small"
            />

            <TextField
              label="Login ID"
              name="loginId"
              value={
                editForm.loginId
              }
              onChange={
                handleEditChange
              }
              fullWidth
              size="small"
            />

            <TextField
              label="New Password"
              name="password"
              type="password"
              value={
                editForm.password
              }
              onChange={
                handleEditChange
              }
              fullWidth
              size="small"
              helperText="Leave blank to keep the current password."
            />

            <TextField
              label="Branch Name"
              name="branchName"
              value={
                editForm.branchName
              }
              onChange={
                handleEditChange
              }
              fullWidth
              size="small"
            />

            <TextField
              label="Branch Member Number"
              name="branchMemberNumber"
              value={
                editForm.branchMemberNumber
              }
              onChange={
                handleEditChange
              }
              fullWidth
              size="small"
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                p: 1.5,
                borderRadius: 1.5,
                backgroundColor:
                  "#f7f7f6",
              }}
            >

              <Box>

                <Typography
                  sx={{
                    fontSize:
                      "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Account Status
                </Typography>

                <Typography
                  sx={{
                    fontSize:
                      "0.72rem",
                    color: "#888",
                  }}
                >
                  Allow this staff member to login
                </Typography>

              </Box>

              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  setEditForm(
                    (prev) => ({
                      ...prev,
                      isActive:
                        !prev.isActive,
                    })
                  )
                }
                sx={{
                  textTransform:
                    "none",
                  minWidth: 80,
                  borderColor: "#ccc",
                  color: "#444",
                }}
              >
                {editForm.isActive
                  ? "Active"
                  : "Inactive"}
              </Button>

            </Box>

          </Stack>

        </DialogContent>

        <DialogActions
          sx={{
            p: 1.5,
            gap: 1,
          }}
        >

          <Button
            onClick={closeEdit}
            disabled={editLoading}
            sx={{
              textTransform: "none",
              color: "#666",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={editLoading}
            sx={{
              textTransform: "none",
              backgroundColor: "#333",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#222",
                boxShadow: "none",
              },
            }}
          >
            {editLoading
              ? "Saving..."
              : "Save Changes"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
};

export default PackagingStaff;