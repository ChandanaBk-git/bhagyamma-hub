import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";

const MemberDetailsModal = ({ open, onClose, member }) => {
  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Member Details

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>

        <div
          style={{
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              margin: "auto",
              bgcolor: "#1976d2",
            }}
          >
            <PersonIcon sx={{ fontSize: 45 }} />
          </Avatar>

          <Typography
            variant="h5"
            mt={2}
          >
            {member.name}
          </Typography>

          <Chip
            label={member.role}
            color={
              member.role === "MANAGER"
                ? "primary"
                : "success"
            }
            sx={{ mt: 1 }}
          />
        </div>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              User ID
            </Typography>

            <Typography>
              {member.userId}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Referral Code
            </Typography>

            <Typography>
              {member.referralCode || "-"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Sponsor
            </Typography>

            <Typography>
              {member.sponsorName || "-"}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography fontWeight="bold">
              Direct Members
            </Typography>

            <Typography>
              {member.children?.length || 0}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography fontWeight="bold">
              Joined On
            </Typography>

            <Typography>
              {member.createdAt
                ? new Date(member.createdAt).toLocaleDateString()
                : "-"}
            </Typography>
          </Grid>

        </Grid>

      </DialogContent>
    </Dialog>
  );
};

export default MemberDetailsModal;