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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Page Heading */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="success.main"
          gutterBottom
        >
          Contact Us
        </Typography>

        <Typography variant="h6" color="text.secondary">
          We'd love to hear from you! Feel free to contact us for any queries or
          support.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
                gutterBottom
              >
                Contact Information
              </Typography>

              <Box display="flex" alignItems="center" mt={3}>
                <Person color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">Owner</Typography>
                  <Typography color="text.secondary">
                    Prakash Reddy
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mt={3}>
                <Email color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">Email</Typography>
                  <Typography color="text.secondary">
                    bhagyammahub@gmail.com
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mt={3}>
                <Phone color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">Mobile</Typography>
                  <Typography color="text.secondary">
                    +91 90191 74672
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mt={3}>
                <LocationOn color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography fontWeight="bold">Location</Typography>
                  <Typography color="text.secondary">
                    Bengaluru, Karnataka, India
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card elevation={4} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
                gutterBottom
              >
                Send Us a Message
              </Typography>

              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
              />

              <TextField
                fullWidth
                label="Subject"
                margin="normal"
              />

              <TextField
                fullWidth
                label="Message"
                multiline
                rows={5}
                margin="normal"
              />

              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{
                  mt: 3,
                  px: 5,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;