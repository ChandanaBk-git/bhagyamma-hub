import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { features } from "../../utils/dummyData";

const Features = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#FFFFFF",

        py: {
          xs: 3,
          sm: 5,
          md: 8,
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
        {/* =================================================
            HEADING
        ================================================= */}

        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="primary"
          sx={{
            fontSize: {
              xs: "1.25rem",
              sm: "1.7rem",
              md: "2.5rem",
            },

            lineHeight: 1.2,

            mb: {
              xs: 0.8,
              sm: 1,
              md: 1.5,
            },
          }}
        >
          Why Customers Choose Us
        </Typography>

        {/* =================================================
            SUBTITLE
        ================================================= */}

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            fontSize: {
              xs: "0.68rem",
              sm: "0.82rem",
              md: "0.98rem",
            },

            lineHeight: 1.5,

            mb: {
              xs: 2.5,
              sm: 3.5,
              md: 5,
            },

            px: {
              xs: 1,
              sm: 0,
            },
          }}
        >
          We are committed to quality, trust, and customer satisfaction.
        </Typography>

        {/* =================================================
            FEATURES
        ================================================= */}

        <Grid
          container
          spacing={{
            xs: 1.5,
            sm: 2,
            md: 3,
          }}
        >
          {features.map((feature) => (
            <Grid
              key={feature.id}
              size={{
                // 2 PER ROW ON MOBILE
                xs: 6,

                // 2 PER ROW ON TABLET
                sm: 6,

                // 4 PER ROW ON DESKTOP
                md: 3,
              }}
              sx={{
                display: "flex",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  width: "100%",

                  height: {
                    xs: "175px",
                    sm: "205px",
                    md: "240px",
                  },

                  borderRadius: 0,

                  border:
                    "1px solid #E2E6E8",

                  bgcolor: "#FFFFFF",

                  textAlign: "center",

                  display: "flex",

                  flexDirection: "column",

                  justifyContent: "center",

                  transition:
                    "border-color 0.2s ease, box-shadow 0.2s ease",

                  "&:hover": {
                    borderColor: "#A9CFAF",

                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.07)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 1.2,
                      sm: 1.8,
                      md: 2.5,
                    },

                    "&:last-child": {
                      pb: {
                        xs: 1.2,
                        sm: 1.8,
                        md: 2.5,
                      },
                    },
                  }}
                >
                  {/* =================================================
                      ICON
                  ================================================= */}

                  <Typography
                    sx={{
                      fontSize: {
                        xs: "28px",
                        sm: "36px",
                        md: "45px",
                      },

                      lineHeight: 1,

                      mb: {
                        xs: 1,
                        sm: 1.2,
                        md: 1.5,
                      },
                    }}
                  >
                    {feature.icon}
                  </Typography>

                  {/* =================================================
                      TITLE
                  ================================================= */}

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      fontSize: {
                        xs: "0.72rem",
                        sm: "0.85rem",
                        md: "1rem",
                      },

                      lineHeight: 1.25,

                      mb: {
                        xs: 0.6,
                        sm: 0.8,
                        md: 1,
                      },
                    }}
                  >
                    {feature.title}
                  </Typography>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.55rem",
                        sm: "0.65rem",
                        md: "0.78rem",
                      },

                      lineHeight: {
                        xs: 1.35,
                        sm: 1.45,
                        md: 1.55,
                      },

                      display:
                        "-webkit-box",

                      WebkitLineClamp: {
                        xs: 3,
                        sm: 3,
                        md: 4,
                      },

                      WebkitBoxOrient:
                        "vertical",

                      overflow: "hidden",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;