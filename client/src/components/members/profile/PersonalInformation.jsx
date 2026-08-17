import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Button,
  Box,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  Cake,
  Wc,
  Edit,
} from "@mui/icons-material";

const PersonalInformation = ({
  user = {},
  onEdit,
}) => {
  const formatDate = (date) => {
    if (!date) {
      return "Not Provided";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not Provided";
    }

    return parsedDate.toLocaleDateString();
  };

  const fields = [
    {
      icon: <Person color="success" />,
      title: "Full Name",
      value: user.name || "Not Provided",
    },

    {
      icon: <Email color="success" />,
      title: "Email",
      value: user.email || "Not Provided",
    },

    {
      icon: <Phone color="success" />,
      title: "Mobile",
      value: user.mobile || "Not Provided",
    },

    {
      icon: <Wc color="success" />,
      title: "Gender",
      value: user.gender || "Not Provided",
    },

    {
      icon: <Cake color="success" />,
      title: "Date of Birth",
      value: formatDate(user.dateOfBirth),
    },
  ];

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
      }}
    >
      <CardContent>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
          mb={3}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Personal Information
          </Typography>

          <Button
            variant="contained"
            color="success"
            startIcon={<Edit />}
            onClick={onEdit}
            fullWidth
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            Edit Profile
          </Button>
        </Stack>

        <Grid
          container
          spacing={3}
        >
          {fields.map((field) => (
            <Grid
              item
              xs={12}
              sm={6}
              key={field.title}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 32,
                  }}
                >
                  {field.icon}
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {field.title}
                  </Typography>

                  <Typography
                    fontWeight="bold"
                    sx={{
                      wordBreak: "break-word",
                    }}
                  >
                    {field.value}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;