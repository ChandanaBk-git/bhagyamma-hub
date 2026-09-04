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
      elevation={0}
      sx={{
        width: "100%",

        mb: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        borderRadius: 0,

        border: "1px solid #E0E0E0",

        boxShadow: "none",

        backgroundColor: "#FFFFFF",

        overflow: "hidden",
      }}
    >

      <CardContent
        sx={{
          p: {
            xs: "9px",
            sm: "12px",
            md: "15px",
          },

          "&:last-child": {
            pb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },
          },
        }}
      >

        {/* HEADER */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          mb={{
            xs: "9px",
            sm: "12px",
            md: "15px",
          }}
        >

          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },

              lineHeight: 1.2,

              color: "#292929",
            }}
          >
            Personal Information
          </Typography>


          <Button
            variant="contained"
            color="success"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{
              minHeight: {
                xs: 30,
                sm: 34,
              },

              px: {
                xs: 1,
                sm: 1.5,
              },

              borderRadius: 0,

              boxShadow: "none",

              fontSize: {
                xs: "8px",
                sm: "9px",
                md: "10px",
              },

              fontWeight: 600,

              textTransform: "none",

              flexShrink: 0,

              "& .MuiButton-startIcon": {
                mr: {
                  xs: 0.35,
                  sm: 0.5,
                },

                "& svg": {
                  fontSize: {
                    xs: 13,
                    sm: 15,
                  },
                },
              },

              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Edit Profile
          </Button>

        </Stack>


        {/* PERSONAL DETAILS */}

        <Grid
          container
          spacing={{
            xs: 1,
            sm: 1.5,
            md: 2,
          }}
        >

          {fields.map((field) => (

            <Grid
              item
              xs={6}
              sm={6}
              key={field.title}
              sx={{
                minWidth: 0,
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 0.75,
                  sm: 1,
                }}
                alignItems="flex-start"
                sx={{
                  minWidth: 0,
                }}
              >

                {/* ICON */}

                <Box
                  sx={{
                    width: {
                      xs: 25,
                      sm: 29,
                    },

                    height: {
                      xs: 25,
                      sm: 29,
                    },

                    minWidth: {
                      xs: 25,
                      sm: 29,
                    },

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    border: "1px solid #E0E0E0",

                    borderRadius: 0,

                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 15,
                        sm: 17,
                      },
                    },
                  }}
                >
                  {field.icon}
                </Box>


                {/* FIELD CONTENT */}

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "8px",
                        sm: "9px",
                        md: "10px",
                      },

                      lineHeight: 1.2,

                      mb: "2px",
                    }}
                  >
                    {field.title}
                  </Typography>


                  <Typography
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: "9px",
                        sm: "10px",
                        md: "11px",
                      },

                      lineHeight: 1.3,

                      wordBreak: "break-word",

                      color: "#292929",
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