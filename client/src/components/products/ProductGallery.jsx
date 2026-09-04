import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import { getImageUrl } from "../../utils/imageUrl";

const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(getImageUrl(images[0]));
    } else {
      setSelectedImage(null);
    }
  }, [images]);

  // =====================================================
  // NO IMAGE
  // =====================================================

  if (!images.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: {
            xs: 280,
            sm: 350,
            md: 420,
          },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 0,
          border: "1px solid #E1E6E2",
          bgcolor: "#F7F8F7",
        }}
      >
        <Typography
          sx={{
            color: "#888",
            fontSize: {
              xs: "0.65rem",
              sm: "0.75rem",
            },
          }}
        >
          No Image Available
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* =================================================
          MAIN IMAGE
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: {
            xs: 280,
            sm: 350,
            md: 420,
          },
          borderRadius: 0,
          overflow: "hidden",
          border: "1px solid #E1E6E2",
          bgcolor: "#F7F8F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={selectedImage}
          alt="Product"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
            },
          }}
        />
      </Paper>

      {/* =================================================
          THUMBNAILS
      ================================================= */}

      <Grid
        container
        spacing={{
          xs: 0.8,
          sm: 1,
        }}
        sx={{
          mt: {
            xs: 1,
            sm: 1.5,
          },
        }}
      >
        {images.map((image, index) => {
          const imageUrl = getImageUrl(image);
          const isSelected =
            selectedImage === imageUrl;

          return (
            <Grid
              item
              xs={3}
              sm={2}
              md={2}
              key={index}
            >
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  height: {
                    xs: 62,
                    sm: 72,
                    md: 80,
                  },

                  borderRadius: 0,
                  overflow: "hidden",
                  cursor: "pointer",

                  border: isSelected
                    ? "2px solid #1B5E20"
                    : "1px solid #DDE3DE",

                  bgcolor: "#F7F8F7",

                  transition:
                    "border-color 0.2s ease",

                  "&:hover": {
                    borderColor: "#2E7D32",
                  },
                }}
                onClick={() =>
                  setSelectedImage(imageUrl)
                }
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    p: 0.5,
                  }}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProductGallery;