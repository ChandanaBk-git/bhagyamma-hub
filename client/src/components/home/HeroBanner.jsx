import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Link } from "react-router-dom";

import detanBanner from "../../assets/banner/detan-combo-banner.png";
import skinCareBanner from "../../assets/banner/skin-care-banner.png";
import painReliefBanner from "../../assets/banner/pain-relief-banner.png";

const slides = [
  {
    image: detanBanner,
    eyebrow: "KISRA SKINCARE",
    title: "Everyday Skin Care.",
    highlight: "A Fresh Start.",
    description:
      "Discover the Kisra De-Tan Magic Soap and Face Wash collection at Bhagyamma Hub.",
  },
  {
    image: skinCareBanner,
    eyebrow: "SKIN CARE COLLECTION",
    title: "Care for Your Skin.",
    highlight: "Feel Confident.",
    description:
      "Explore our skincare collection and discover products for your everyday routine.",
  },
  {
    image: painReliefBanner,
    eyebrow: "EVERYDAY WELLNESS",
    title: "Comfort in Every Day.",
    highlight: "Care You Can Trust.",
    description:
      "Discover Kisra Grass Oil and Mahishmati Adivasi Ayurvedic Pain Relief Oil.",
  },
];

const HeroBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const previous = () =>
    setActiveSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );

  const next = () =>
    setActiveSlide((current) => (current + 1) % slides.length);

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        bgcolor: "#fff",
        py: { xs: 0, sm: 1, md: 2 },
        px: { xs: 0, sm: 1.5, md: 2 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 230, sm: 340, md: 480 },
          overflow: "hidden",
          borderRadius: 0,
          bgcolor: "#F7F1E5",
          backgroundImage: `url("${slide.image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          isolation: "isolate",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            background:
              "linear-gradient(90deg, rgba(255,250,242,.78) 0%, rgba(255,250,242,.48) 38%, rgba(255,250,242,0) 68%)",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
          <Stack
            key={activeSlide}
            spacing={{ xs: 0.8, sm: 1.5, md: 2 }}
            sx={{
              width: { xs: "65%", sm: "52%", md: "45%" },
              maxWidth: 520,
              py: 1,
              animation: "heroTextIn .4s ease-out",
              "@keyframes heroTextIn": {
                from: { opacity: 0, transform: "translateY(5px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Typography
              sx={{
                color: "#65411F",
                fontSize: { xs: 7, sm: 10, md: 11 },
                fontWeight: 800,
                letterSpacing: { xs: 0.7, sm: 1.5 },
                textShadow: "0 1px 3px rgba(255,255,255,.9)",
              }}
            >
              {slide.eyebrow}
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: "#302316",
                fontSize: {
                  xs: "1.05rem",
                  sm: "2rem",
                  md: "3.1rem",
                },
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: { xs: "-0.3px", md: "-1px" },
                textShadow: "0 1px 4px rgba(255,255,255,.85)",
              }}
            >
              {slide.title}
              <Box
                component="span"
                sx={{
                  display: "block",
                  color: "#875526",
                  textShadow: "0 1px 4px rgba(255,255,255,.9)",
                }}
              >
                {slide.highlight}
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#3F3022",
                fontSize: { xs: 8, sm: 13, md: 15 },
                lineHeight: { xs: 1.45, sm: 1.65 },
                maxWidth: 390,
                textShadow: "0 1px 3px rgba(255,255,255,.95)",
              }}
            >
              {slide.description}
            </Typography>

            <Box>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#76502B",
                  color: "#fff",
                  px: { xs: 1.2, sm: 2, md: 2.5 },
                  py: { xs: 0.45, sm: 0.8, md: 1 },
                  minWidth: 0,
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: { xs: 8, sm: 11, md: 13 },
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#5E3E20",
                    boxShadow: "none",
                  },
                }}
              >
                Explore Products →
              </Button>
            </Box>
          </Stack>
        </Container>

        <IconButton
          aria-label="Previous banner"
          onClick={previous}
          size="small"
          sx={{
            position: "absolute",
            left: { xs: 4, sm: 12 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,.85)",
            color: "#76502B",
            "&:hover": { bgcolor: "#fff" },
          }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>

        <IconButton
          aria-label="Next banner"
          onClick={next}
          size="small"
          sx={{
            position: "absolute",
            right: { xs: 4, sm: 12 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,.85)",
            color: "#76502B",
            "&:hover": { bgcolor: "#fff" },
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>

        <Stack
          direction="row"
          spacing={0.7}
          sx={{
            position: "absolute",
            bottom: { xs: 7, sm: 12 },
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {slides.map((item, index) => (
            <Box
              key={item.eyebrow}
              component="button"
              aria-label={`Show banner ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              sx={{
                width: activeSlide === index ? 18 : 6,
                height: 6,
                p: 0,
                border: 0,
                borderRadius: 8,
                cursor: "pointer",
                bgcolor:
                  activeSlide === index
                    ? "#76502B"
                    : "rgba(118,80,43,.35)",
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default HeroBanner;