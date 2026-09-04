import React from "react";

import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

import {
  StarRounded,
  VerifiedRounded,
  LocalShippingRounded,
  SecurityRounded,
  ShoppingBagRounded,
  FavoriteRounded,
  WorkspacePremiumRounded,
  SupportAgentRounded,
  SearchRounded,
  ShoppingCartRounded,
  PaymentRounded,
  Inventory2Rounded,
} from "@mui/icons-material";

// =====================================================
// COLORS
// =====================================================

const COLORS = {
  primary: "#1B5E20",
  green: "#2E7D32",
  gold: "#B08D3C",
  text: "#222222",
  secondaryText: "#666666",
  background: "#F7F8F7",
  white: "#FFFFFF",
  border: "#E1E6E2",
};

// =====================================================
// WHAT YOU'LL GET
// =====================================================

const benefits = [
  {
    icon: <StarRounded />,
    title: "Premium Ayurvedic Products",
    description:
      "Explore authentic herbal and wellness products carefully selected for everyday health and natural care.",
    color: "#F9A825",
    background: "#FFF8E1",
  },
  {
    icon: <VerifiedRounded />,
    title: "Trusted Quality",
    description:
      "Every product is chosen with quality, safety and customer satisfaction in mind.",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
  {
    icon: <LocalShippingRounded />,
    title: "Fast Delivery",
    description:
      "Quick order processing and reliable delivery so your wellness products reach you on time.",
    color: "#1565C0",
    background: "#E3F2FD",
  },
  {
    icon: <SecurityRounded />,
    title: "Secure Shopping",
    description:
      "Enjoy a safe shopping experience with secure authentication and protected transactions.",
    color: "#6A1B9A",
    background: "#F3E5F5",
  },
];

// =====================================================
// WHY CHOOSE
// =====================================================

const whyChoose = [
  {
    icon: <ShoppingBagRounded />,
    title: "Trusted Herbal Wellness",
    description:
      "We provide premium Ayurvedic products made to support everyday wellness and help customers choose natural solutions with confidence.",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
  {
    icon: <FavoriteRounded />,
    title: "Customer First",
    description:
      "Your satisfaction is our priority. We focus on quality products, transparent pricing and a smooth shopping experience from order placement to delivery.",
    color: "#D32F2F",
    background: "#FFEBEE",
  },
];

// =====================================================
// MEMBER BENEFITS
// =====================================================

const memberBenefits = [
  {
    icon: <WorkspacePremiumRounded />,
    title: "Premium Herbal Products",
    color: "#F9A825",
    background: "#FFF8E1",
  },
  {
    icon: <StarRounded />,
    title: "Exclusive Member Discounts",
    color: "#7B1FA2",
    background: "#F3E5F5",
  },
  {
    icon: <ShoppingBagRounded />,
    title: "Selling Points (SP)",
    color: "#1565C0",
    background: "#E3F2FD",
  },
  {
    icon: <FavoriteRounded />,
    title: "Referral Rewards",
    color: "#D32F2F",
    background: "#FFEBEE",
  },
  {
    icon: <SecurityRounded />,
    title: "Secure Online Shopping",
    color: "#00897B",
    background: "#E0F2F1",
  },
  {
    icon: <LocalShippingRounded />,
    title: "Easy Order Tracking",
    color: "#EF6C00",
    background: "#FFF3E0",
  },
  {
    icon: <SupportAgentRounded />,
    title: "Dedicated Customer Support",
    color: "#3949AB",
    background: "#E8EAF6",
  },
  {
    icon: <WorkspacePremiumRounded />,
    title: "Future Member Benefits",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
];

// =====================================================
// SHOPPING PROCESS
// =====================================================

const shoppingSteps = [
  {
    number: 1,
    icon: <SearchRounded />,
    title: "Explore Products",
    description:
      "Browse our premium herbal, Ayurvedic and wellness products.",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
  {
    number: 2,
    icon: <ShoppingCartRounded />,
    title: "Choose Products",
    description:
      "Select your favourite products and add them to your cart.",
    color: "#1565C0",
    background: "#E3F2FD",
  },
  {
    number: 3,
    icon: <PaymentRounded />,
    title: "Place Your Order",
    description:
      "Review your order details and complete checkout securely.",
    color: "#6A1B9A",
    background: "#F3E5F5",
  },
  {
    number: 4,
    icon: <Inventory2Rounded />,
    title: "Order Processing",
    description:
      "Our team carefully prepares and processes your order.",
    color: "#EF6C00",
    background: "#FFF3E0",
  },
  {
    number: 5,
    icon: <LocalShippingRounded />,
    title: "Fast Delivery",
    description:
      "Your products are packed safely and delivered to your doorstep.",
    color: "#00897B",
    background: "#E0F2F1",
  },
];

// =====================================================
// SECTION HEADING
// =====================================================

const SectionHeading = ({ title, description }) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        maxWidth: 700,
        mx: "auto",
        mb: {
          xs: 2.5,
          sm: 3.5,
        },
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: COLORS.primary,
          fontWeight: 700,
          fontSize: {
            xs: "1.2rem",
            sm: "1.5rem",
            md: "1.8rem",
          },
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            mt: 0.7,
            color: COLORS.secondaryText,
            fontSize: {
              xs: "0.65rem",
              sm: "0.75rem",
              md: "0.85rem",
            },
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

// =====================================================
// ABOUT
// =====================================================

const About = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: COLORS.background,
        color: COLORS.text,
      }}
    >
      {/* =================================================
          HERO
      ================================================= */}

      <Box
        sx={{
          bgcolor: COLORS.primary,
          color: COLORS.white,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: {
              xs: 3,
              sm: 4,
              md: 5,
            },
            px: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },
          }}
        >
          <Box
            sx={{
              maxWidth: 760,
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "1.45rem",
                  sm: "1.9rem",
                  md: "2.4rem",
                },
                lineHeight: 1.2,
              }}
            >
              About Bhagyamma Hub
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "rgba(255,255,255,0.88)",
                fontSize: {
                  xs: "0.68rem",
                  sm: "0.78rem",
                  md: "0.9rem",
                },
                lineHeight: 1.55,
              }}
            >
              Experience the goodness of Ayurveda with premium herbal
              products, trusted quality, secure shopping and exclusive
              member benefits. Our mission is to make natural wellness
              simple, affordable and accessible for every family.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* =================================================
          MAIN
      ================================================= */}

      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
          py: {
            xs: 3,
            sm: 5,
            md: 6,
          },
        }}
      >
        {/* =================================================
            WHAT YOU'LL GET
        ================================================= */}

        <Box>
          <SectionHeading
            title="What You'll Get"
            description="Bhagyamma Hub offers carefully selected Ayurvedic products designed to support your daily wellness with trusted quality and reliable customer service."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: {
                xs: 1,
                sm: 1.5,
                md: 2,
              },
            }}
          >
            {benefits.map((item) => (
              <Card
                key={item.title}
                elevation={0}
                sx={{
                  borderRadius: 0,
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: COLORS.white,
                  height: "100%",
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 1.3,
                      sm: 1.8,
                      md: 2,
                    },
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 34,
                        sm: 40,
                      },
                      height: {
                        xs: 34,
                        sm: 40,
                      },
                      bgcolor: item.background,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,

                      "& svg": {
                        fontSize: {
                          xs: 18,
                          sm: 21,
                        },
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.72rem",
                        md: "0.8rem",
                      },
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.6,
                      color: COLORS.secondaryText,
                      fontSize: {
                        xs: "0.52rem",
                        sm: "0.6rem",
                        md: "0.68rem",
                      },
                      lineHeight: 1.45,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* =================================================
            WHY CHOOSE
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 4,
              sm: 6,
              md: 7,
            },
          }}
        >
          <SectionHeading
            title="Why Choose Bhagyamma Hub?"
            description="A simple, reliable and customer-focused approach to natural wellness."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: {
                xs: 1,
                sm: 1.5,
                md: 2,
              },
            }}
          >
            {whyChoose.map((item) => (
              <Card
                key={item.title}
                elevation={0}
                sx={{
                  borderRadius: 0,
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: COLORS.white,
                }}
              >
                <CardContent
                  sx={{
                    p: {
                      xs: 1.5,
                      sm: 2,
                    },
                    display: "flex",
                    gap: 1.2,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 38,
                        sm: 44,
                      },
                      height: {
                        xs: 38,
                        sm: 44,
                      },
                      flexShrink: 0,
                      bgcolor: item.background,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      "& svg": {
                        fontSize: {
                          xs: 19,
                          sm: 22,
                        },
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: {
                          xs: "0.72rem",
                          sm: "0.82rem",
                        },
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.4,
                        color: COLORS.secondaryText,
                        fontSize: {
                          xs: "0.57rem",
                          sm: "0.68rem",
                        },
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* =================================================
            MEMBER BENEFITS
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 4,
              sm: 6,
              md: 7,
            },
          }}
        >
          <SectionHeading
            title="Member Benefits"
            description="Join Bhagyamma Hub and unlock exclusive advantages."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(4, 1fr)",
              },
              gap: {
                xs: 1,
                sm: 1.5,
                md: 2,
              },
              maxWidth: 950,
              mx: "auto",
            }}
          >
            {memberBenefits.map((item) => (
              <Card
                key={item.title}
                elevation={0}
                sx={{
                  borderRadius: 0,
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: COLORS.white,
                }}
              >
                <CardContent
                  sx={{
                    minHeight: {
                      xs: 85,
                      sm: 100,
                    },
                    p: {
                      xs: 1,
                      sm: 1.5,
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: 30,
                        sm: 36,
                      },
                      height: {
                        xs: 30,
                        sm: 36,
                      },
                      bgcolor: item.background,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 0.7,

                      "& svg": {
                        fontSize: {
                          xs: 16,
                          sm: 19,
                        },
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.56rem",
                        sm: "0.65rem",
                      },
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* =================================================
            SHOPPING PROCESS
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 4,
              sm: 6,
              md: 7,
            },
          }}
        >
          <SectionHeading
            title="Simple Shopping Process"
            description="From discovering your favourite products to receiving them at your doorstep."
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(5, 1fr)",
              },
              gap: {
                xs: 0.8,
                sm: 1,
              },
              maxWidth: 1000,
              mx: "auto",
            }}
          >
            {shoppingSteps.map((step) => (
              <Box
                key={step.number}
                sx={{
                  position: "relative",
                  textAlign: "center",
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: COLORS.white,
                  p: {
                    xs: 1.2,
                    sm: 1.3,
                  },
                }}
              >
                {/* Step Number */}
                <Typography
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 7,
                    fontSize: "0.48rem",
                    fontWeight: 700,
                    color: "#999",
                  }}
                >
                  0{step.number}
                </Typography>

                <Box
                  sx={{
                    width: {
                      xs: 34,
                      sm: 40,
                    },
                    height: {
                      xs: 34,
                      sm: 40,
                    },
                    mx: "auto",
                    mb: 0.8,
                    bgcolor: step.background,
                    color: step.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    "& svg": {
                      fontSize: {
                        xs: 18,
                        sm: 21,
                      },
                    },
                  }}
                >
                  {step.icon}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: {
                      xs: "0.62rem",
                      sm: "0.67rem",
                    },
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: COLORS.secondaryText,
                    fontSize: {
                      xs: "0.5rem",
                      sm: "0.55rem",
                    },
                    lineHeight: 1.4,
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* =================================================
            OUR PROMISE
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 4,
              sm: 6,
              md: 7,
            },
          }}
        >
          <Box
            sx={{
              borderLeft: `3px solid ${COLORS.gold}`,
              bgcolor: "#F5F7F5",
              px: {
                xs: 1.5,
                sm: 2.5,
              },
              py: {
                xs: 1.5,
                sm: 2,
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: COLORS.primary,
                fontSize: {
                  xs: "0.85rem",
                  sm: "1rem",
                },
              }}
            >
              Our Promise
            </Typography>

            <Typography
              sx={{
                mt: 0.6,
                color: COLORS.secondaryText,
                fontSize: {
                  xs: "0.6rem",
                  sm: "0.72rem",
                  md: "0.8rem",
                },
                lineHeight: 1.55,
              }}
            >
              We are committed to providing premium Ayurvedic products
              with trusted quality, affordable pricing, secure shopping,
              fast delivery and excellent customer support. Every order
              is handled with care so you can shop confidently and enjoy
              a better wellness experience.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;