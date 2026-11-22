import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  Paper,
} from "@mui/material";

const Intro = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#FFFFFF",
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
            xs: 2,
            sm: 3,
          },
        }}
      >
        <Grid
          container
          spacing={{
            xs: 2,
            sm: 3,
            md: 4,
          }}
          alignItems="center"
        >
          {/* LEFT: WELCOME TEXT */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              color="primary"
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem",
                  md: "1.85rem",
                },
                lineHeight: 1.25,
                mb: 1,
              }}
            >
              Welcome to Bhagyamma Hub
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.88rem",
                  md: "0.92rem",
                },
                lineHeight: 1.55,
              }}
            >
              Bhagyamma Hub markets and retails selected Ayurvedic,
              herbal, skincare, wellness and lifestyle products from
              Kisra and Vedgiri. We aim to provide clear product
              information and a convenient shopping experience while
              creating opportunities through our membership network.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1.25,
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.88rem",
                  md: "0.92rem",
                },
                lineHeight: 1.55,
              }}
            >
              We value clear product information, customer satisfaction
              and building a trusted shopping community through
              Bhagyamma Hub.
            </Typography>
          </Grid>

          {/* RIGHT: COMPACT VISION & MISSION CARD */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 1.75,
                  sm: 2.25,
                  md: 2.75,
                },
                borderRadius: 2.5,
                bgcolor: "#F7F9F7",
                border: "1px solid #E3EAE3",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="#1F2937"
                sx={{
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.12rem",
                  },
                  lineHeight: 1.25,
                  mb: 0.5,
                }}
              >
                Our Vision
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.78rem",
                    sm: "0.84rem",
                    md: "0.88rem",
                  },
                  lineHeight: 1.5,
                }}
              >
                To build a trusted platform for marketing and retailing
                products from Kisra and Vedgiri while offering a
                customer-focused shopping and membership experience.
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: "#E3EAE3" }} />

              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="#1F2937"
                sx={{
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.12rem",
                  },
                  lineHeight: 1.25,
                  mb: 0.5,
                }}
              >
                Our Mission
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.78rem",
                    sm: "0.84rem",
                    md: "0.88rem",
                  },
                  lineHeight: 1.5,
                }}
              >
                Market and retail products from Kisra and Vedgiri with
                clear product information, reliable service and a focus
                on customer satisfaction.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Intro;