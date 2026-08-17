import { useState } from "react";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import {
  Logout,
  DeleteForever,
  Block,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const DangerZone = () => {

  const navigate = useNavigate();

  const [deleteDialog, setDeleteDialog] = useState(false);

  const [disableDialog, setDisableDialog] = useState(false);

  const handleLogout = () => {

    localStorage.clear();

    sessionStorage.clear();

    navigate("/login");

  };

  const handleDisableAccount = () => {

    console.log("Disable Account");

    setDisableDialog(false);

  };

  const handleDeleteAccount = () => {

    console.log("Delete Account");

    setDeleteDialog(false);

  };

  return (

    <>

      <Card
        elevation={2}
        sx={{
          borderRadius:4,
          border:"2px solid #F44336",
          mb:3,
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            color="error"
            fontWeight="bold"
            mb={3}
          >
            Danger Zone
          </Typography>

          <Alert
            severity="warning"
            sx={{
              mb:3,
            }}
          >
            These actions are sensitive. Please proceed carefully.
          </Alert>

          <Stack spacing={2}>

            <Button
              fullWidth
              variant="outlined"
              color="warning"
              startIcon={<Block />}
              onClick={() =>
                setDisableDialog(true)
              }
            >
              Disable Account
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<DeleteForever />}
              onClick={() =>
                setDeleteDialog(true)
              }
            >
              Delete Account
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout From This Device
            </Button>

          </Stack>

        </CardContent>

      </Card>

      <Dialog
        open={disableDialog}
        onClose={() =>
          setDisableDialog(false)
        }
      >

        <DialogTitle>
          Disable Account
        </DialogTitle>

        <DialogContent>

          <DialogContentText>

            Are you sure you want to disable your account?
            You can reactivate it later by contacting support.

          </DialogContentText>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setDisableDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="warning"
            variant="contained"
            onClick={handleDisableAccount}
          >
            Disable
          </Button>

        </DialogActions>

      </Dialog>

      <Dialog
        open={deleteDialog}
        onClose={() =>
          setDeleteDialog(false)
        }
      >

        <DialogTitle>
          Delete Account
        </DialogTitle>

        <DialogContent>

          <DialogContentText>

            This action cannot be undone.
            All your account information, wallet history,
            orders, and profile data will be permanently removed.

          </DialogContentText>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setDeleteDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>

    </>

  );

};

export default DangerZone;