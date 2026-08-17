import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  Person,
  Phone,
  Email,
  Badge,
  CardGiftcard,
  CalendarMonth,
  Group,
} from "@mui/icons-material";

const MemberDialog = ({
  open,
  onClose,
  member,
}) => {

  if (!member) return null;

  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >

      <DialogTitle
        sx={{
          fontWeight: "bold",
        }}
      >
        Member Details
      </DialogTitle>

      <DialogContent>

        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          mb={3}
        >

          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#2E7D32",
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            {member.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box>

            <Typography
              variant="h5"
              fontWeight="bold"
            >
              {member.name}
            </Typography>

            <Typography
              color="text.secondary"
            >
              {member.userId}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={1}
            >

              <Chip
                color="primary"
                label={member.role || "MEMBER"}
              />

              <Chip
                color={
                  member.isActive
                    ? "success"
                    : "error"
                }
                label={
                  member.isActive
                    ? "Active"
                    : "Inactive"
                }
              />

            </Stack>

          </Box>

        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <Person color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Member Name
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {member.name}
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <Badge color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Member ID
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {member.userId}
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <Phone color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Mobile
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {member.mobile || "-"}
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <Email color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Email
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {member.email || "-"}
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <CardGiftcard color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Referral Code
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {member.referralCode}
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <CalendarMonth color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Joining Date
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {
                    member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString()
                      : "-"
                  }
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <Group color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Direct Members
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  {member.children?.length || 0}
                </Typography>

              </Box>

            </Stack>

          </Grid>

        </Grid>

      </DialogContent>

    </Dialog>

  );

};

export default MemberDialog;