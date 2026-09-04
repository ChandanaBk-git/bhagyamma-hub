import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const Contact = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F8FAF8",
        py: {
          xs: 2.5,
          sm: 3.5,
          md: 4.5,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
        }}
      >
        {/* =====================================================
            HEADING
        ===================================================== */}

        <Box
          sx={{
            textAlign: "center",
            maxWidth: 650,
            mx: "auto",

            mb: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: "#1B5E20",
              fontWeight: 700,

              fontSize: {
                xs: "1.25rem",
                sm: "1.6rem",
                md: "1.9rem",
              },

              lineHeight: 1.2,
            }}
          >
            Contact Us
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#666",

              fontSize: {
                xs: "0.62rem",
                sm: "0.72rem",
                md: "0.82rem",
              },

              lineHeight: 1.5,
            }}
          >
            We'd love to hear from you! Feel free to contact us for
            any queries or support.
          </Typography>
        </Box>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <Grid
          container
          spacing={{
            xs: 1.5,
            sm: 2,
            md: 2.5,
          }}
          alignItems="stretch"
        >
          {/* ===================================================
              CONTACT INFORMATION
          =================================================== */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 0,
                border: "1px solid #DDE4DE",
                bgcolor: "#fff",
                boxShadow: "none",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.5,
                    sm: 2,
                    md: 2.2,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.5,
                      sm: 2,
                      md: 2.2,
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#1B5E20",
                    fontWeight: 700,

                    fontSize: {
                      xs: "0.85rem",
                      sm: "0.95rem",
                      md: "1.05rem",
                    },

                    lineHeight: 1.3,

                    pb: 0.8,

                    borderBottom: "1px solid #E5EAE6",
                  }}
                >
                  Contact Information
                </Typography>

                {/* OWNER */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: {
                      xs: 1.4,
                      sm: 1.7,
                    },
                  }}
                >
                  <Person
                    sx={{
                      color: "#1B5E20",
                      fontSize: {
                        xs: 19,
                        sm: 21,
                      },
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: {
                          xs: "0.62rem",
                          sm: "0.7rem",
                        },
                      }}
                    >
                      Owner
                    </Typography>

                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: {
                          xs: "0.58rem",
                          sm: "0.66rem",
                        },
                      }}
                    >
                      Prakash Reddy
                    </Typography>
                  </Box>
                </Box>

                {/* EMAIL */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1.5,
                  }}
                >
                  <Email
                    sx={{
                      color: "#1B5E20",
                      fontSize: {
                        xs: 19,
                        sm: 21,
                      },
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: {
                          xs: "0.62rem",
                          sm: "0.7rem",
                        },
                      }}
                    >
                      Email
                    </Typography>

                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: {
                          xs: "0.58rem",
                          sm: "0.66rem",
                        },

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      bhagyammahub@gmail.com
                    </Typography>
                  </Box>
                </Box>

                {/* PHONE */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1.5,
                  }}
                >
                  <Phone
                    sx={{
                      color: "#1B5E20",
                      fontSize: {
                        xs: 19,
                        sm: 21,
                      },
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: {
                          xs: "0.62rem",
                          sm: "0.7rem",
                        },
                      }}
                    >
                      Mobile
                    </Typography>

                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: {
                          xs: "0.58rem",
                          sm: "0.66rem",
                        },
                      }}
                    >
                      +91 90191 74672
                    </Typography>
                  </Box>
                </Box>

                {/* LOCATION */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1.5,
                  }}
                >
                  <LocationOn
                    sx={{
                      color: "#1B5E20",
                      fontSize: {
                        xs: 19,
                        sm: 21,
                      },
                      mr: 1,
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        fontSize: {
                          xs: "0.62rem",
                          sm: "0.7rem",
                        },
                      }}
                    >
                      Location
                    </Typography>

                    <Typography
                      sx={{
                        color: "#777",
                        fontSize: {
                          xs: "0.58rem",
                          sm: "0.66rem",
                        },
                      }}
                    >
                      Bengaluru, Karnataka, India
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ===================================================
              CONTACT FORM
          =================================================== */}

          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: 0,
                border: "1px solid #DDE4DE",
                bgcolor: "#fff",
                boxShadow: "none",
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.5,
                    sm: 2,
                    md: 2.2,
                  },

                  "&:last-child": {
                    pb: {
                      xs: 1.5,
                      sm: 2,
                      md: 2.2,
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#1B5E20",
                    fontWeight: 700,

                    fontSize: {
                      xs: "0.85rem",
                      sm: "0.95rem",
                      md: "1.05rem",
                    },

                    lineHeight: 1.3,

                    pb: 0.8,
                    mb: 0.5,

                    borderBottom: "1px solid #E5EAE6",
                  }}
                >
                  Send Us a Message
                </Typography>

                {/* NAME */}

                <TextField
                  fullWidth
                  size="small"
                  label="Full Name"
                  margin="dense"
                  sx={{
                    mt: 0.8,

                    "& .MuiInputBase-root": {
                      borderRadius: 0,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },

                    "& .MuiInputLabel-root": {
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },
                  }}
                />

                {/* EMAIL */}

                <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  type="email"
                  margin="dense"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 0,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },

                    "& .MuiInputLabel-root": {
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },
                  }}
                />

                {/* SUBJECT */}

                <TextField
                  fullWidth
                  size="small"
                  label="Subject"
                  margin="dense"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 0,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },

                    "& .MuiInputLabel-root": {
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },
                  }}
                />

                {/* MESSAGE */}

                <TextField
                  fullWidth
                  size="small"
                  label="Message"
                  multiline
                  rows={3}
                  margin="dense"
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 0,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },

                    "& .MuiInputLabel-root": {
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.7rem",
                      },
                    },
                  }}
                />

                {/* SEND BUTTON */}

                <Button
                  variant="contained"
                  disableElevation
                  sx={{
                    mt: 1.2,

                    height: {
                      xs: 30,
                      sm: 33,
                    },

                    px: {
                      xs: 2,
                      sm: 2.5,
                    },

                    borderRadius: 0,

                    bgcolor: "#1B5E20",
                    color: "#fff",

                    textTransform: "none",

                    fontWeight: 600,

                    fontSize: {
                      xs: "0.58rem",
                      sm: "0.68rem",
                    },

                    "&:hover": {
                      bgcolor: "#154A19",
                    },
                  }}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;