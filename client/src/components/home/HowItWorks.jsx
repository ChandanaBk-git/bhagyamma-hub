import {
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";

import { howItWorks } from "../../utils/dummyData";

const HowItWorks = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#FFFFFF",

        py: {
          xs: 4,
          sm: 6,
          md: 8,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            textAlign: "center",

            mb: {
              xs: 3.5,
              sm: 4.5,
              md: 6,
            },
          }}
        >
          <Typography
            component="h2"
            sx={{
              color: "#1B5E20",

              fontWeight: 700,

              fontSize: {
                xs: "1.35rem",
                sm: "1.8rem",
                md: "2.5rem",
              },

              lineHeight: 1.2,
            }}
          >
            How It Works
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.7,

              fontSize: {
                xs: "0.7rem",
                sm: "0.82rem",
                md: "0.95rem",
              },

              lineHeight: 1.5,
            }}
          >
            Start your journey with Bhagyamma Hub in four simple steps.
          </Typography>
        </Box>

        {/* =================================================
            DESKTOP TIMELINE
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },

            position: "relative",
          }}
        >
          {/* =================================================
              TIMELINE LINE
          ================================================= */}

          <Box
            sx={{
              position: "absolute",

              top: "30px",

              left: "12.5%",

              right: "12.5%",

              height: "3px",

              bgcolor: "#DCEBDD",

              overflow: "hidden",
            }}
          >
            {/* Animated green line */}

            <Box
              sx={{
                position: "absolute",

                top: 0,
                left: 0,

                width: "35%",

                height: "100%",

                bgcolor: "#2E7D32",

                animation:
                  "timelineMove 3s ease-in-out infinite",

                "@keyframes timelineMove": {
                  "0%": {
                    transform:
                      "translateX(-100%)",
                  },

                  "50%": {
                    transform:
                      "translateX(280%)",
                  },

                  "100%": {
                    transform:
                      "translateX(700%)",
                  },
                },
              }}
            />
          </Box>

          {/* =================================================
              STEPS
          ================================================= */}

          <Grid
            container
            spacing={2}
          >
            {howItWorks.map(
              (item, index) => (
                <Grid
                  key={item.id}
                  size={3}
                >
                  <Box
                    sx={{
                      textAlign: "center",

                      position:
                        "relative",

                      zIndex: 2,

                      px: 2,
                    }}
                  >
                    {/* =================================================
                        STEP CIRCLE
                    ================================================= */}

                    <Box
                      sx={{
                        width: "60px",

                        height: "60px",

                        mx: "auto",

                        bgcolor:
                          "#1B5E20",

                        color: "#FFFFFF",

                        display: "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        borderRadius:
                          "50%",

                        border:
                          "5px solid #FFFFFF",

                        boxShadow:
                          "0 0 0 2px #B7D7BA",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize:
                            "1rem",

                          fontWeight: 700,
                        }}
                      >
                        {item.step}
                      </Typography>
                    </Box>

                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <Typography
                      component="h3"
                      sx={{
                        mt: 2,

                        color:
                          "#1B5E20",

                        fontWeight: 700,

                        fontSize:
                          "1rem",

                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </Typography>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <Typography
                      color="text.secondary"
                      sx={{
                        mt: 0.8,

                        fontSize:
                          "0.76rem",

                        lineHeight: 1.5,

                        maxWidth:
                          "220px",

                        mx: "auto",
                      }}
                    >
                      {
                        item.description
                      }
                    </Typography>
                  </Box>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        {/* =================================================
            MOBILE TIMELINE
        ================================================= */}

        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },

            position: "relative",

            pl: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          {/* =================================================
              VERTICAL LINE
          ================================================= */}

          <Box
            sx={{
              position: "absolute",

              top: "10px",

              bottom: "10px",

              left: {
                xs: "31px",
                sm: "39px",
              },

              width: "3px",

              bgcolor: "#DCEBDD",

              overflow: "hidden",
            }}
          >
            {/* Animated line */}

            <Box
              sx={{
                position: "absolute",

                top: 0,
                left: 0,

                width: "100%",

                height: "35%",

                bgcolor: "#2E7D32",

                animation:
                  "timelineVertical 3s ease-in-out infinite",

                "@keyframes timelineVertical": {
                  "0%": {
                    transform:
                      "translateY(-100%)",
                  },

                  "50%": {
                    transform:
                      "translateY(190%)",
                  },

                  "100%": {
                    transform:
                      "translateY(400%)",
                  },
                },
              }}
            />
          </Box>

          {/* =================================================
              MOBILE STEPS
          ================================================= */}

          {howItWorks.map(
            (item, index) => (
              <Box
                key={item.id}
                sx={{
                  position:
                    "relative",

                  display: "flex",

                  alignItems:
                    "flex-start",

                  minHeight:
                    index ===
                    howItWorks.length - 1
                      ? "100px"
                      : "125px",
                }}
              >
                {/* =================================================
                    STEP CIRCLE
                ================================================= */}

                <Box
                  sx={{
                    flexShrink: 0,

                    width: {
                      xs: "38px",
                      sm: "46px",
                    },

                    height: {
                      xs: "38px",
                      sm: "46px",
                    },

                    bgcolor:
                      "#1B5E20",

                    color: "#FFFFFF",

                    display: "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    borderRadius:
                      "50%",

                    border:
                      "3px solid #FFFFFF",

                    boxShadow:
                      "0 0 0 2px #B7D7BA",

                    position:
                      "relative",

                    zIndex: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.75rem",
                      },

                      fontWeight: 700,
                    }}
                  >
                    {item.step}
                  </Typography>
                </Box>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <Box
                  sx={{
                    pl: {
                      xs: 1.5,
                      sm: 2,
                    },

                    pr: 1,

                    pt: 0.2,

                    flex: 1,

                    minWidth: 0,
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      color:
                        "#1B5E20",

                      fontWeight: 700,

                      fontSize: {
                        xs: "0.82rem",
                        sm: "0.92rem",
                      },

                      lineHeight: 1.3,

                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.64rem",
                        sm: "0.72rem",
                      },

                      lineHeight: {
                        xs: 1.45,
                        sm: 1.5,
                      },

                      maxWidth:
                        "500px",
                    }}
                  >
                    {
                      item.description
                    }
                  </Typography>
                </Box>
              </Box>
            )
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorks;