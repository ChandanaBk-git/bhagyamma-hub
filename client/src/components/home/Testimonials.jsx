import {
  Avatar,
  Box,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";

import { testimonials } from "../../utils/dummyData";

const Testimonials = () => {
  return (
    <Box
      sx={{
        py: {
          xs: 3,
          sm: 5,
          md: 7,
        },
        bgcolor: "#F7F8FA",
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
        {/* Heading */}
        <Typography
          align="center"
          fontWeight={700}
          color="primary"
          sx={{
            fontSize: {
              xs: "1.2rem",
              sm: "1.6rem",
              md: "2rem",
            },
            lineHeight: 1.2,
          }}
        >
          What Our Members Say
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            mt: 0.5,
            mb: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            fontSize: {
              xs: "0.65rem",
              sm: "0.8rem",
              md: "0.9rem",
            },
          }}
        >
          Trusted by our growing Bhagyamma Hub family.
        </Typography>

        {/* Testimonials */}
        <Grid
          container
          spacing={{
            xs: 1,
            sm: 2,
            md: 3,
          }}
        >
          {testimonials.map((item) => (
            <Grid
              key={item.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #E2E6E3",
                  p: {
                    xs: 1.5,
                    sm: 2,
                    md: 2.5,
                  },
                  minHeight: {
                    xs: "145px",
                    sm: "165px",
                    md: "180px",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mb: 1,
                  }}
                >
                  <Avatar
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: {
                        xs: 38,
                        sm: 45,
                        md: 50,
                      },
                      height: {
                        xs: 38,
                        sm: 45,
                        md: 50,
                      },
                    }}
                  />

                  <Box>
                    <Typography
                      fontWeight={700}
                      sx={{
                        fontSize: {
                          xs: "0.7rem",
                          sm: "0.8rem",
                          md: "0.9rem",
                        },
                      }}
                    >
                      {item.name}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "0.55rem",
                          sm: "0.62rem",
                          md: "0.7rem",
                        },
                      }}
                    >
                      {item.location}
                    </Typography>
                  </Box>
                </Box>

                <Rating
                  value={item.rating}
                  readOnly
                  size="small"
                  sx={{
                    mb: 0.5,
                    fontSize: {
                      xs: "0.85rem",
                      sm: "1rem",
                    },
                  }}
                />

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: "0.62rem",
                      sm: "0.7rem",
                      md: "0.78rem",
                    },
                    lineHeight: 1.45,
                  }}
                >
                  "{item.review}"
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;