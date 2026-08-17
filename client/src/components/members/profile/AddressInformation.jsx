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
      elevation={2}
      sx={{
        borderRadius: 4,
        mb: 3,
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Address Information
        </Typography>

        <Grid
          container
          spacing={{
            xs: 2.5,
            sm: 3,
          }}
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
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    minWidth: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {field.icon}
                </Box>

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={0.5}
                  >
                    {field.title}
                  </Typography>

                  <Typography
                    fontWeight="bold"
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace:
                        field.title === "Address"
                          ? "pre-wrap"
                          : "normal",
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