import { useEffect, useState } from "react";

import {
  Box,
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
          height: { xs: 220, sm: 270, md: 300 },
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
            fontSize: { xs: "0.7rem", sm: "0.78rem" },
          }}
        >
          No Image Available
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column-reverse", sm: "row" },
        gap: 1,
      }}
    >
      {/* VERTICAL / HORIZONTAL THUMBNAIL STRIP */}
      {images.length > 1 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "column" },
            gap: 0.75,
            overflowX: { xs: "auto", sm: "visible" },
            overflowY: { xs: "visible", sm: "auto" },
            maxHeight: { sm: 280, md: 310 },
            flexShrink: 0,
          }}
        >
          {images.map((image, index) => {
            const imageUrl = getImageUrl(image);
            const isSelected = selectedImage === imageUrl;

            return (
              <Paper
                key={index}
                elevation={0}
                onClick={() => setSelectedImage(imageUrl)}
                sx={{
                  width: { xs: 48, sm: 54 },
                  height: { xs: 48, sm: 54 },
                  flexShrink: 0,
                  borderRadius: 0,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: isSelected
                    ? "2px solid #1B5E20"
                    : "1px solid #DDE3DE",
                  bgcolor: "#F7F8F7",
                  transition: "border-color 0.2s ease",
                  "&:hover": {
                    borderColor: "#2E7D32",
                  },
                }}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    p: 0.4,
                  }}
                />
              </Paper>
            );
          })}
        </Box>
      )}

      {/* MAIN IMAGE */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          minWidth: 0,
          height: { xs: 220, sm: 280, md: 310 },
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
            p: { xs: 1, sm: 1.5 },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ProductGallery;