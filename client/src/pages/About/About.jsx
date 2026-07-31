import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import {
  LocalShipping,
  VerifiedUser,
  Security,
  Favorite,
  ShoppingBag,
  WorkspacePremium,
  SupportAgent,
  Star,
} from "@mui/icons-material";

const features = [
  {
    icon: <Star color="success" sx={{ fontSize: 45 }} />,
    title: "Premium Ayurvedic Products",
    description:
      "Explore authentic herbal and wellness products carefully selected for everyday health and natural care.",
  },
  {
    icon: <VerifiedUser color="success" sx={{ fontSize: 45 }} />,
    title: "Trusted Quality",
    description:
      "Every product is chosen with quality, safety, and customer satisfaction in mind.",
  },
  {
    icon: <LocalShipping color="success" sx={{ fontSize: 45 }} />,
    title: "Fast Delivery",
    description:
      "Quick order processing and reliable delivery so your wellness products reach you on time.",
  },
  {
    icon: <Security color="success" sx={{ fontSize: 45 }} />,
    title: "Secure Shopping",
    description:
      "Enjoy a safe shopping experience with secure authentication and protected transactions.",
  },
];

const benefits = [
  "Premium Herbal Products",
  "Exclusive Member Discounts",
  "Selling Points (SP)",
  "Referral Rewards",
  "Secure Online Shopping",
  "Easy Order Tracking",
  "Dedicated Customer Support",
  "Future Member Benefits",
];

const steps = [
  "Browse our premium herbal products.",
  "Choose your favourite products.",
  "Place your order securely.",
  "Receive fast doorstep delivery.",
  "Enjoy a healthier lifestyle naturally.",
];

const About = () => {
  return (
    <Box sx={{ bgcolor: "#F8F9FA" }}>
      {/* Hero */}
      <Paper
        square
        sx={{
          py: 10,
          background: "linear-gradient(135deg,#1B5E20,#43A047)",
          color: "#fff",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            About Bhagyamma Hub
          </Typography>

          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              maxWidth: 900,
              mx: "auto",
              opacity: 0.95,
              lineHeight: 1.8,
            }}
          >
            Experience the goodness of Ayurveda with premium herbal products,
            trusted quality, secure shopping, and exclusive member benefits.
            Our mission is to make natural wellness simple, affordable, and
            accessible for every family.
          </Typography>
        </Container>
      </Paper>

      <Container maxWidth="lg">

        {/* What You Get */}
        <Box py={10}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            What You'll Get
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{
              maxWidth: 750,
              mx: "auto",
              mb: 6,
            }}
          >
            Bhagyamma Hub offers carefully selected Ayurvedic products designed
            to support your daily wellness with trusted quality and reliable
            customer service.
          </Typography>

          <Grid container spacing={4}>
            {features.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    textAlign: "center",
                    p: 2,
                    transition: ".3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent>
                    {item.icon}

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      mt={2}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      mt={2}
                      color="text.secondary"
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose */}
        <Box pb={10}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Why Choose Bhagyamma Hub?
          </Typography>

          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <ShoppingBag
                    color="success"
                    sx={{ fontSize: 50 }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mt={2}
                  >
                    Trusted Herbal Wellness
                  </Typography>

                  <Typography mt={2} lineHeight={2}>
                    We provide premium Ayurvedic products made to support
                    everyday wellness, helping customers choose natural
                    solutions with confidence.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                  <Favorite
                    color="success"
                    sx={{ fontSize: 50 }}
                  />

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    mt={2}
                  >
                    Customer First
                  </Typography>

                  <Typography mt={2} lineHeight={2}>
                    Your satisfaction is our priority. We focus on delivering
                    quality products, transparent pricing, and a smooth shopping
                    experience from order placement to delivery.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Member Benefits */}
        <Box pb={10}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Member Benefits
          </Typography>

          <Typography
            textAlign="center"
            color="text.secondary"
            mb={5}
          >
            Join Bhagyamma Hub and unlock exclusive advantages.
          </Typography>

          <Grid container spacing={3}>
            {benefits.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={item}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    height: 120,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <CardContent>
                    <WorkspacePremium
                      color="success"
                      sx={{ mb: 1 }}
                    />

                    <Typography fontWeight={600}>
                      {item}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Shopping Steps */}
        <Box pb={10}>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Simple Shopping Process
          </Typography>

          <Grid container spacing={3} mt={2}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: 4,
                    height: 180,
                    textAlign: "center",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="h3"
                      color="success.main"
                      fontWeight={700}
                    >
                      {index + 1}
                    </Typography>

                    <Typography
                      mt={2}
                      fontWeight={600}
                    >
                      {step}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Promise */}
        <Paper
          sx={{
            p: 6,
            borderRadius: 5,
            bgcolor: "#E8F5E9",
            mb: 10,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            color="success.main"
            gutterBottom
          >
            Our Promise
          </Typography>

          <Typography lineHeight={2}>
            We are committed to providing premium Ayurvedic products with
            trusted quality, affordable pricing, secure shopping, fast delivery,
            and excellent customer support. Every order is handled with care so
            you can shop confidently and enjoy a better wellness experience.
          </Typography>
        </Paper>

        {/* CTA */}
        <Paper
          sx={{
            p: 8,
            borderRadius: 5,
            textAlign: "center",
            bgcolor: "#2E7D32",
            color: "#fff",
            mb: 8,
          }}
        >
          <SupportAgent sx={{ fontSize: 60 }} />

          <Typography
            variant="h4"
            fontWeight={700}
            mt={2}
          >
            Start Your Wellness Journey Today
          </Typography>

          <Typography
            mt={2}
            sx={{
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Discover premium herbal products trusted by customers and enjoy a
            secure shopping experience with Bhagyamma Hub.
          </Typography>

          <Box mt={5}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="warning"
              size="large"
              sx={{
                mr: 2,
                px: 4,
                fontWeight: 700,
              }}
            >
              Shop Now
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "rgba(255,255,255,.1)",
                },
              }}
            >
              Become a Member
            </Button>
          </Box>
        </Paper>

      </Container>
    </Box>
  );
};

export default About;