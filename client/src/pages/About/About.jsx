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
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  primaryLight: "#E8F5E9",
  greenLight: "#C8E6C9",
  text: "#222222",
  secondaryText: "#666666",
  background: "#F7F9F7",
  white: "#FFFFFF",
  border: "#E0E7E1",
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
        width: "100%",
        maxWidth: 760,
        mx: "auto",
        textAlign: "center",
        mb: {
          xs: 4,
          md: 5,
        },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: {
            xs: "1.7rem",
            sm: "2rem",
            md: "2.25rem",
          },
          fontWeight: 800,
          lineHeight: 1.25,
          color: COLORS.text,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            mt: 1.5,
            color: COLORS.secondaryText,
            fontSize: {
              xs: "0.88rem",
              sm: "0.95rem",
              md: "1rem",
            },
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

// =====================================================
// ABOUT PAGE
// =====================================================

const About = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: COLORS.background,
        overflow: "hidden",
      }}
    >
      {/* =================================================
          HERO
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          background:
            "linear-gradient(135deg, #1B5E20 0%, #2E7D32 55%, #388E3C 100%)",
          color: COLORS.white,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: {
              xs: 6,
              sm: 7,
              md: 8,
            },
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          <Box
            sx={{
              maxWidth: 850,
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.6rem",
                  md: "3.2rem",
                },
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              About Bhagyamma Hub
            </Typography>

            <Typography
              sx={{
                mt: 2,
                maxWidth: 720,
                mx: "auto",
                color: "rgba(255,255,255,0.92)",
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                  md: "1.05rem",
                },
                lineHeight: 1.75,
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
          MAIN CONTENT
      ================================================= */}

      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: {
            xs: 6,
            sm: 7,
            md: 9,
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
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
            }}
          >
            {benefits.map((item) => (
              <Card
                key={item.title}
                elevation={0}
                sx={{
                  height: "100%",
                  minHeight: {
                    xs: 210,
                    sm: 225,
                    md: 250,
                  },
                  borderRadius: 4,
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: COLORS.white,
                  transition: "all 0.25s ease",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                      "0 14px 32px rgba(46,125,50,0.13)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    p: {
                      xs: 2.5,
                      sm: 3,
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      bgcolor: item.background,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,

                      "& svg": {
                        fontSize: 28,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: {
                        xs: "0.95rem",
                        sm: "1rem",
                      },
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.2,
                      color: COLORS.secondaryText,
                      fontSize: {
                        xs: "0.82rem",
                        sm: "0.87rem",
                      },
                      lineHeight: 1.65,
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
              xs: 8,
              sm: 10,
              md: 12,
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
                md: "repeat(2, 1fr)",
              },
              gap: {
                xs: 2.5,
                md: 3,
              },
            }}
          >
            {whyChoose.map((item) => (
              <Card
                key={item.title}
                elevation={0}
                sx={{
                  minHeight: {
                    xs: 200,
                    md: 220,
                  },
                  borderRadius: 4,
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: COLORS.white,
                  transition: "all 0.25s ease",

                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      "0 12px 28px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    p: {
                      xs: 3,
                      sm: 4,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2,
                      bgcolor: item.background,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,

                      "& svg": {
                        fontSize: 27,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.08rem",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.2,
                      color: COLORS.secondaryText,
                      fontSize: {
                        xs: "0.85rem",
                        sm: "0.9rem",
                      },
                      lineHeight: 1.7,
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
            MEMBER BENEFITS
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 8,
              sm: 10,
              md: 12,
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
                xs: 1.5,
                sm: 2,
                md: 2.5,
              },
              maxWidth: 1050,
              mx: "auto",
            }}
          >
            {memberBenefits.map((item) => (
              <Card
                key={item.title}
                elevation={0}
                sx={{
                  minHeight: {
                    xs: 125,
                    sm: 145,
                  },
                  borderRadius: 3,
                  border: `1px solid ${COLORS.border}`,
                  bgcolor: COLORS.white,
                  transition: "all 0.2s ease",

                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow:
                      "0 8px 20px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    p: {
                      xs: 1.5,
                      sm: 2,
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      bgcolor: item.background,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.2,

                      "& svg": {
                        fontSize: 23,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.72rem",
                        sm: "0.8rem",
                      },
                      lineHeight: 1.4,
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
            SIMPLE SHOPPING PROCESS
            VERTICAL TIMELINE
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 9,
              sm: 10,
              md: 12,
            },
          }}
        >
          <SectionHeading
            title="Simple Shopping Process"
            description="From discovering your favourite products to receiving them at your doorstep."
          />

          <Box
            sx={{
              maxWidth: 850,
              mx: "auto",
              mt: {
                xs: 5,
                sm: 6,
                md: 7,
              },
              position: "relative",
            }}
          >
            {/* =================================================
                VERTICAL CONNECTING LINE
            ================================================= */}

            <Box
              sx={{
                position: "absolute",

                left: {
                  xs: 31,
                  sm: 35,
                  md: 39,
                },

                top: 35,
                bottom: 35,

                width: 4,

                bgcolor: COLORS.greenLight,

                borderRadius: 10,

                zIndex: 0,
              }}
            />

            {/* =================================================
                TIMELINE ITEMS
            ================================================= */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: {
                  xs: 4,
                  sm: 5,
                  md: 6,
                },
              }}
            >
              {shoppingSteps.map((step) => (
                <Box
                  key={step.number}
                  sx={{
                    position: "relative",
                    zIndex: 1,

                    display: "flex",

                    alignItems: "flex-start",

                    minHeight: {
                      xs: 90,
                      sm: 100,
                    },
                  }}
                >
                  {/* =================================================
                      STEP CIRCLE
                  ================================================= */}

                  <Box
                    sx={{
                      width: {
                        xs: 68,
                        sm: 76,
                      },

                      height: {
                        xs: 68,
                        sm: 76,
                      },

                      flexShrink: 0,

                      borderRadius: "50%",

                      bgcolor: step.color,

                      color: COLORS.white,

                      border: `6px solid ${step.background}`,

                      display: "flex",

                      flexDirection: "column",

                      alignItems: "center",

                      justifyContent: "center",

                      boxShadow:
                        "0 6px 16px rgba(0,0,0,0.14)",

                      "& svg": {
                        fontSize: {
                          xs: 22,
                          sm: 25,
                        },
                      },
                    }}
                  >
                    {step.icon}

                    <Typography
                      sx={{
                        fontSize: "0.55rem",
                        fontWeight: 800,
                        lineHeight: 1,
                        mt: 0.3,
                      }}
                    >
                      STEP {step.number}
                    </Typography>
                  </Box>

                  {/* =================================================
                      CONTENT CARD
                  ================================================= */}

                  <Card
                    elevation={0}
                    sx={{
                      ml: {
                        xs: 2,
                        sm: 3,
                      },

                      flex: 1,

                      minHeight: {
                        xs: 105,
                        sm: 110,
                      },

                      borderRadius: 3,

                      border: `1px solid ${COLORS.border}`,

                      bgcolor: COLORS.white,

                      transition: "all 0.25s ease",

                      "&:hover": {
                        transform: "translateX(5px)",
                        boxShadow:
                          "0 10px 25px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: {
                          xs: 2,
                          sm: 2.5,
                          md: 3,
                        },

                        "&:last-child": {
                          pb: {
                            xs: 2,
                            sm: 2.5,
                            md: 3,
                          },
                        },
                      }}
                    >
                      <Typography
                        component="h3"
                        sx={{
                          fontWeight: 800,

                          color: step.color,

                          fontSize: {
                            xs: "1rem",
                            sm: "1.08rem",
                            md: "1.15rem",
                          },

                          lineHeight: 1.3,
                        }}
                      >
                        {step.title}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1,

                          color: COLORS.secondaryText,

                          fontSize: {
                            xs: "0.82rem",
                            sm: "0.87rem",
                            md: "0.92rem",
                          },

                          lineHeight: 1.65,
                        }}
                      >
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* =================================================
            OUR PROMISE
        ================================================= */}

        <Box
          sx={{
            mt: {
              xs: 8,
              sm: 10,
              md: 12,
            },
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #A5D6A7",
              bgcolor: "#EAF6EC",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 3,
                  sm: 4,
                  md: 5,
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  color: COLORS.primary,
                  fontSize: {
                    xs: "1.3rem",
                    sm: "1.5rem",
                  },
                }}
              >
                Our Promise
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  color: "#555",
                  fontSize: {
                    xs: "0.86rem",
                    sm: "0.92rem",
                    md: "0.98rem",
                  },
                  lineHeight: 1.8,
                }}
              >
                We are committed to providing premium Ayurvedic products
                with trusted quality, affordable pricing, secure shopping,
                fast delivery and excellent customer support. Every order
                is handled with care so you can shop confidently and enjoy
                a better wellness experience.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default About;