import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Box,
  Button,
  Divider,
} from "@mui/material";

import {
  Badge,
  Email,
  Phone,
  Language,
  Edit,
  LockReset,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const AccountSettings = () => {

  const navigate = useNavigate();

  return (

    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Account Settings
        </Typography>

        <Grid
          container
          spacing={3}
        >

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
                  BH000001
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
                  member@email.com
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
                  +91 9876543210
                </Typography>

              </Box>

            </Stack>

          </Grid>

          <Grid item xs={12} md={6}>

            <Stack
              direction="row"
              spacing={2}
            >

              <Language color="success" />

              <Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Language
                </Typography>

                <Typography
                  fontWeight="bold"
                >
                  English
                </Typography>

              </Box>

            </Stack>

          </Grid>

        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >

          <Button
            variant="contained"
            color="success"
            startIcon={<Edit />}
            onClick={() =>
              navigate("/member/profile")
            }
          >
            Edit Profile
          </Button>

          <Button
            variant="outlined"
            color="success"
            startIcon={<LockReset />}
            onClick={() =>
              navigate("/member/profile")
            }
          >
            Change Password
          </Button>

        </Stack>

      </CardContent>

    </Card>

  );

};

export default AccountSettings;