import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
} from "@mui/material";

const Intro = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",

        // Keep original section spacing,
        // slightly reduced on mobile
        py: {
          xs: 4,
          sm: 6,
          md: 10,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 3,
          },
        }}
      >
        <Grid
          container
          spacing={{
            xs: 3,
            sm: 4,
            md: 6,
          }}
          alignItems="center"
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              color="primary"
              gutterBottom
              sx={{
                fontSize: {
                  xs: "1.35rem",
                  sm: "1.7rem",
                  md: "3rem",
                },

                lineHeight: {
                  xs: 1.2,
                  sm: 1.25,
                  md: 1.2,
                },

                mb: {
                  xs: 1.5,
                  sm: 2,
                  md: 2,
                },
              }}
            >
              Welcome to Bhagyamma Hub
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "0.9rem",
                  sm: "0.98rem",
                  md: "1rem",
                },

                lineHeight: {
                  xs: 1.65,
                  sm: 1.8,
                  md: 2,
                },
              }}
            >
              Bhagyamma Hub is dedicated to bringing premium herbal,
              wellness, and lifestyle products to every family. Our
              mission is to provide high-quality products while creating
              opportunities for individuals to grow through our trusted
              membership network.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: {
                  xs: 2,
                  sm: 2.5,
                  md: 3,
                },

                fontSize: {
                  xs: "0.9rem",
                  sm: "0.98rem",
                  md: "1rem",
                },

                lineHeight: {
                  xs: 1.65,
                  sm: 1.8,
                  md: 2,
                },
              }}
            >
              We believe in quality, trust, customer satisfaction, and
              empowering people to build a better future together.
            </Typography>
          </Grid>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={4}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3.5,
                  md: 5,
                },

                borderRadius: 4,

                bgcolor: "#F7F8FA",
              }}
            >
              {/* =================================================
                  OUR VISION
              ================================================= */}

              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "1.05rem",
                    sm: "1.2rem",
                    md: "1.5rem",
                  },

                  lineHeight: 1.25,
                }}
              >
                Our Vision
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.9rem",
                    md: "1rem",
                  },

                  lineHeight: {
                    xs: 1.55,
                    sm: 1.65,
                    md: 1.7,
                  },
                }}
              >
                To become India's most trusted platform for premium
                herbal products and membership-driven business
                opportunities.
              </Typography>

              {/* =================================================
                  OUR MISSION
              ================================================= */}

              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{
                  mt: {
                    xs: 3,
                    sm: 3.5,
                    md: 4,
                  },

                  fontSize: {
                    xs: "1.05rem",
                    sm: "1.2rem",
                    md: "1.5rem",
                  },

                  lineHeight: 1.25,
                }}
              >
                Our Mission
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: "0.82rem",
                    sm: "0.9rem",
                    md: "1rem",
                  },

                  lineHeight: {
                    xs: 1.55,
                    sm: 1.65,
                    md: 1.7,
                  },
                }}
              >
                Deliver quality products, create opportunities, and
                build a strong community through innovation, trust, and
                customer satisfaction.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Intro;