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
    }
  }, [images]);

  if (!images.length) {
    return (
      <Paper
        elevation={2}
        sx={{
          height: 450,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 3,
        }}
      >
        <Typography>No Image Available</Typography>
      </Paper>
    );
  }

  return (
    <>
      {/* Main Image */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={selectedImage}
          alt="Product"
          sx={{
            width: "100%",
            height: 500,
            objectFit: "cover",
          }}
        />
      </Paper>

      {/* Thumbnail Images */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((image, index) => {
          const imageUrl = getImageUrl(image);

          return (
            <Grid
              item
              xs={4}
              key={index}
            >
              <Paper
                elevation={selectedImage === imageUrl ? 6 : 2}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  border:
                    selectedImage === imageUrl
                      ? "2px solid #2E7D32"
                      : "1px solid #ddd",
                }}
                onClick={() => setSelectedImage(imageUrl)}
              >
                <Box
                  component="img"
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: 100,
                    objectFit: "cover",
                  }}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ProductGallery;