import {
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Box,
} from "@mui/material";

import {
  Home,
  LocationCity,
  Map,
  MarkunreadMailbox,
  Public,
} from "@mui/icons-material";


const AddressInformation = ({ user = {} }) => {

  const fields = [
    {
      icon: <Home color="success" />,
      title: "Address",
      value: user.address || "Not Provided",
    },

    {
      icon: <LocationCity color="success" />,
      title: "City",
      value: user.city || "Not Provided",
    },

    {
      icon: <Map color="success" />,
      title: "State",
      value: user.state || "Not Provided",
    },

    {
      icon: <MarkunreadMailbox color="success" />,
      title: "Pincode",
      value: user.pincode || "Not Provided",
    },

    {
      icon: <Public color="success" />,
      title: "Country",
      value: user.country || "India",
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

        <Typography
          fontWeight={600}
          sx={{
            fontSize: {
              xs: "14px",
              sm: "16px",
              md: "18px",
            },

            lineHeight: 1.2,

            mb: {
              xs: "9px",
              sm: "12px",
              md: "15px",
            },

            color: "#292929",
          }}
        >
          Address Information
        </Typography>


        {/* ADDRESS FIELDS */}

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
              xs={12}
              sm={6}
              key={field.title}
              sx={{
                minWidth: 0,
              }}
            >

              <Stack
                direction="row"
                spacing={{
                  xs: 1,
                  sm: 1.25,
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
                      xs: 26,
                      sm: 30,
                    },

                    height: {
                      xs: 26,
                      sm: 30,
                    },

                    minWidth: {
                      xs: 26,
                      sm: 30,
                    },

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",

                    border: "1px solid #E0E0E0",

                    borderRadius: 0,

                    flexShrink: 0,

                    "& svg": {
                      fontSize: {
                        xs: 16,
                        sm: 18,
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
                        xs: "9px",
                        sm: "10px",
                        md: "11px",
                      },

                      lineHeight: 1.2,

                      mb: "3px",
                    }}
                  >
                    {field.title}
                  </Typography>


                  <Typography
                    fontWeight={600}
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "11px",
                        md: "12px",
                      },

                      lineHeight: 1.35,

                      wordBreak: "break-word",

                      whiteSpace:
                        field.title === "Address"
                          ? "pre-wrap"
                          : "normal",

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


export default AddressInformation;