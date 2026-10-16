import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
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
// BENEFITS
// =====================================================

const benefits = [
  {
    icon: <StarRounded />,
    title: "Kisra & Vedgiri Products",
    description:
      "Explore available products from Kisra and Vedgiri with clear product information.",
    color: "#F9A825",
    background: "#FFF8E1",
  },
  {
    icon: <VerifiedRounded />,
    title: "Product Transparency",
    description:
      "Review product descriptions, labels and manufacturer information before purchasing.",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
  {
    icon: <LocalShippingRounded />,
    title: "Order Delivery",
    description:
      "Orders are processed according to our published shipping policy and delivery estimates.",
    color: "#1565C0",
    background: "#E3F2FD",
  },
  {
    icon: <SecurityRounded />,
    title: "Secure Shopping",
    description:
      "Shop through our online platform and review the applicable payment and order policies.",
    color: "#6A1B9A",
    background: "#F3E5F5",
  },
];

// =====================================================
// WHY CHOOSE US
// =====================================================

const whyChoose = [
  {
    icon: <ShoppingBagRounded />,
    title: "Selected Products",
    description:
      "Bhagyamma Hub markets and retails products sourced from external brands and suppliers, including Kisra and Vedgiri.",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
  {
    icon: <FavoriteRounded />,
    title: "Customer First",
    description:
      "We focus on transparent product information, clear pricing and a convenient customer shopping experience.",
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
    title: "Membership Benefits",
    color: "#F9A825",
    background: "#FFF8E1",
  },
  {
    icon: <StarRounded />,
    title: "Member Discounts",
    color: "#7B1FA2",
    background: "#F3E5F5",
  },
  {
    icon: <ShoppingBagRounded />,
    title: "Selling Points",
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
    title: "Online Shopping",
    color: "#00897B",
    background: "#E0F2F1",
  },
  {
    icon: <LocalShippingRounded />,
    title: "Order Tracking",
    color: "#EF6C00",
    background: "#FFF3E0",
  },
  {
    icon: <SupportAgentRounded />,
    title: "Customer Support",
    color: "#3949AB",
    background: "#E8EAF6",
  },
  {
    icon: <WorkspacePremiumRounded />,
    title: "Future Benefits",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
];

// =====================================================
// SHOPPING STEPS
// =====================================================

const shoppingSteps = [
  {
    number: 1,
    icon: <SearchRounded />,
    title: "Explore Products",
    description:
      "Browse available products from Kisra and Vedgiri.",
    color: "#2E7D32",
    background: "#E8F5E9",
  },
  {
    number: 2,
    icon: <ShoppingCartRounded />,
    title: "Choose Products",
    description:
      "Select your products and add them to your cart.",
    color: "#1565C0",
    background: "#E3F2FD",
  },
  {
    number: 3,
    icon: <PaymentRounded />,
    title: "Place Your Order",
    description:
      "Review your order details and complete checkout.",
    color: "#6A1B9A",
    background: "#F3E5F5",
  },
  {
    number: 4,
    icon: <Inventory2Rounded />,
    title: "Order Processing",
    description:
      "Our team prepares and processes your order.",
    color: "#EF6C00",
    background: "#FFF3E0",
  },
  {
    number: 5,
    icon: <LocalShippingRounded />,
    title: "Delivery",
    description:
      "Your order is shipped according to our delivery policy.",
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
// ABOUT PAGE
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
                lineHeight: 1.65,
              }}
            >
              Bhagyamma Hub, operated by BHAGYAMMA ENTERPRISES,
              is a trading and retail platform offering products
              from Kisra and Vedgiri. Our goal is to provide
              clear product information, convenient online
              shopping and customer-focused service.
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
            description="Discover products, useful information and a convenient shopping experience through Bhagyamma Hub."
          />

          <Grid
            container
            spacing={{
              xs: 1,
              sm: 1.5,
              md: 2,
            }}
          >
            {benefits.map((item) => (
              <Grid
                key={item.title}
                size={{
                  xs: 6,
                  sm: 6,
                  md: 3,
                }}
              >
                <Card
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
                      "&:last-child": {
                        pb: {
                          xs: 1.3,
                          sm: 1.8,
                          md: 2,
                        },
                      },
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
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* =================================================
            WHY CHOOSE US
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
            description="A straightforward, customer-focused approach to shopping for products from Kisra and Vedgiri."
          />

          <Grid
            container
            spacing={{
              xs: 1,
              sm: 1.5,
              md: 2,
            }}
          >
            {whyChoose.map((item) => (
              <Grid
                key={item.title}
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <Card
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
              </Grid>
            ))}
          </Grid>
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
            description="Explore the features available through the Bhagyamma Hub membership programme. Applicable terms and eligibility rules apply."
          />

          <Grid
            container
            spacing={{
              xs: 1,
              sm: 1.5,
              md: 2,
            }}
          >
            {memberBenefits.map((item) => (
              <Grid
                key={item.title}
                size={{
                  xs: 6,
                  sm: 3,
                }}
              >
                <Card
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
              </Grid>
            ))}
          </Grid>
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
            description="Follow these steps to place an order through Bhagyamma Hub."
          />

          <Grid
            container
            spacing={{
              xs: 1,
              sm: 1,
            }}
          >
            {shoppingSteps.map((step) => (
              <Grid
                key={step.number}
                size={{
                  xs: 12,
                  sm: 4,
                  md: "auto",
                }}
                sx={{
                  flex: {
                    xs: "initial",
                    md: "1 1 0",
                  },
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    textAlign: "center",
                    border: `1px solid ${COLORS.border}`,
                    bgcolor: COLORS.white,
                    p: {
                      xs: 1.2,
                      sm: 1.3,
                    },
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
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
                        xs: "0.58rem",
                        sm: "0.55rem",
                      },
                      lineHeight: 1.4,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* =================================================
            PRODUCT SOURCING
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
            title="Product Sourcing & Transparency"
            description="Understand our role as a trader and retailer and how we present products on Bhagyamma Hub."
          />

          <Grid
            container
            spacing={{
              xs: 1,
              sm: 1.5,
              md: 2,
            }}
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
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
                      xs: 1.5,
                      sm: 2,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: COLORS.primary,
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.78rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    Kisra & Vedgiri Products
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.7,
                      color: COLORS.secondaryText,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.74rem",
                      },
                      lineHeight: 1.6,
                    }}
                  >
                    Bhagyamma Hub markets and retails products from
                    Kisra and Vedgiri. We may introduce products from
                    additional brands in the future as our catalogue
                    expands. Brand names and product details should
                    match the actual products listed for sale.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
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
                      xs: 1.5,
                      sm: 2,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: COLORS.primary,
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.78rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    Trading & Retail
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.7,
                      color: COLORS.secondaryText,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.74rem",
                      },
                      lineHeight: 1.6,
                    }}
                  >
                    BHAGYAMMA ENTERPRISES operates Bhagyamma Hub
                    as a trading and retail business. We do not
                    represent ourselves as the manufacturer of
                    products manufactured by other companies.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
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
                      xs: 1.5,
                      sm: 2,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: COLORS.primary,
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.78rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    Product Information
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.7,
                      color: COLORS.secondaryText,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.74rem",
                      },
                      lineHeight: 1.6,
                    }}
                  >
                    Customers should review the product label,
                    ingredients, directions, warnings and
                    manufacturer details before use. Product
                    information on our website should not be
                    treated as a substitute for professional
                    medical advice.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
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
                      xs: 1.5,
                      sm: 2,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: COLORS.primary,
                      fontWeight: 700,
                      fontSize: {
                        xs: "0.78rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    Regulatory Compliance
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.7,
                      color: COLORS.secondaryText,
                      fontSize: {
                        xs: "0.62rem",
                        sm: "0.74rem",
                      },
                      lineHeight: 1.6,
                    }}
                  >
                    Products subject to specific licensing,
                    labelling or other regulatory requirements
                    should be offered only when the applicable
                    requirements are met. A general trading
                    registration does not replace any
                    product-specific licence or approval
                    required by law.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
            bgcolor: COLORS.primary,
            color: COLORS.white,
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            textAlign: "center",
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "1.05rem",
                sm: "1.35rem",
                md: "1.7rem",
              },
              lineHeight: 1.25,
            }}
          >
            Our Promise to Customers
          </Typography>

          <Typography
            sx={{
              mt: 1,
              maxWidth: 750,
              mx: "auto",
              color: "rgba(255,255,255,0.88)",
              fontSize: {
                xs: "0.65rem",
                sm: "0.76rem",
                md: "0.88rem",
              },
              lineHeight: 1.65,
            }}
          >
            We aim to provide accurate product information,
            transparent business practices, clear published
            policies and responsive customer support as
            Bhagyamma Hub grows its range of products and brands.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;