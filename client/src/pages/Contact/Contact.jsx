import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  Stack,
} from "@mui/material";
import API from "../../api";
import { useState } from "react";

import {
  Person,
  Email,
  Phone,
  LocationOn,
  WhatsApp,
  Call,
} from "@mui/icons-material";

const WHATSAPP_NUMBER = "919019174672";
const CALL_NUMBER = "+919019174672";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const buildWhatsAppUrl = (data) => {
    const lines = [
      "Hello Bhagyamma Hub,",
      data.name?.trim() ? `*Name:* ${data.name.trim()}` : null,
      data.email?.trim() ? `*Email:* ${data.email.trim()}` : null,
      data.subject?.trim() ? `*Subject:* ${data.subject.trim()}` : null,
      data.message?.trim() ? `*Message:*\n${data.message.trim()}` : null,
    ].filter(Boolean);

    const text =
      lines.length > 1
        ? lines.join("\n")
        : "Hello Bhagyamma Hub! I would like to enquire about your products.";

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!form.message.trim()) {
      setNotice({
        open: true,
        type: "error",
        message: "Please enter your message before sending.",
      });
      return;
    }

    const whatsappUrl = buildWhatsAppUrl(form);

    // Open WhatsApp immediately with the typed message
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setLoading(true);
    try {
      await API.post("/contact", form);
    } catch (error) {
      console.error("Contact API log error:", error);
    } finally {
      setLoading(false);
      setNotice({
        open: true,
        type: "success",
        message: "Redirecting to WhatsApp with your message.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

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
                      HuchaRaddi
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
                      component="a"
                      href="mailto:bhagyammahub@gmail.com"
                      sx={{
                        display: "block",
                        color: "#777",
                        fontSize: {
                          xs: "0.58rem",
                          sm: "0.66rem",
                        },

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        "&:hover": { color: "#1B5E20" },
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
                      component="a"
                      href={`tel:${CALL_NUMBER}`}
                      sx={{
                        display: "block",
                        color: "#777",
                        fontSize: {
                          xs: "0.58rem",
                          sm: "0.66rem",
                        },
                        "&:hover": { color: "#1B5E20" },
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
                      Gadag, Karnataka, India
                    </Typography>
                  </Box>
                </Box>

                {/* CALL NOW + WHATSAPP BUTTONS */}

                <Box
                  sx={{
                    mt: 2.2,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                  }}
                >
                  <Button
                    component="a"
                    href={`tel:${CALL_NUMBER}`}
                    variant="contained"
                    disableElevation
                    startIcon={<Call sx={{ fontSize: 16 }} />}
                    sx={{
                      height: {
                        xs: 34,
                        sm: 36,
                      },
                      borderRadius: 0,
                      bgcolor: "#1B5E20",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.72rem",
                      },
                      "&:hover": {
                        bgcolor: "#154A19",
                      },
                    }}
                  >
                    Call Now
                  </Button>

                  <Button
                    component="a"
                    href={buildWhatsAppUrl({})}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    disableElevation
                    startIcon={<WhatsApp sx={{ fontSize: 16 }} />}
                    sx={{
                      height: {
                        xs: 34,
                        sm: 36,
                      },
                      borderRadius: 0,
                      bgcolor: "#25D366",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.72rem",
                      },
                      "&:hover": {
                        bgcolor: "#1EBE5D",
                      },
                    }}
                  >
                    WhatsApp
                  </Button>
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

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  {/* NAME */}

                  <TextField
                    fullWidth
                    size="small"
                    label="Full Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    inputProps={{ maxLength: 100 }}
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
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    inputProps={{ maxLength: 254 }}
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
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    inputProps={{ maxLength: 200 }}
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
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 5000 }}
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

                  {/* SEND VIA WHATSAPP BUTTON */}

                  <Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disableElevation
                      disabled={loading}
                      startIcon={<WhatsApp sx={{ fontSize: 16 }} />}
                      sx={{
                        height: {
                          xs: 34,
                          sm: 36,
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
                          xs: "0.62rem",
                          sm: "0.72rem",
                        },

                        "&:hover": {
                          bgcolor: "#154A19",
                        },
                      }}
                    >
                      {loading ? "Opening WhatsApp..." : "Send Message on WhatsApp"}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={notice.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotice((previous) => ({ ...previous, open: false }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 2000 }}
      >
        <Alert
          severity={notice.type}
          variant="filled"
          onClose={() =>
            setNotice((previous) => ({ ...previous, open: false }))
          }
          sx={{
            width: "100%",
            borderRadius: 0,
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {notice.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;