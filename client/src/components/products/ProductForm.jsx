import { useState } from "react";

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Card,
  CardMedia,
} from "@mui/material";

const ProductForm = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState(
    initialValues || {
      productName: "",
      category: "",
      brand: "Bhagyamma Hub",
      description: "",
      benefits: "",
      ingredients: "",
      usage: "",
      storage: "",
      weight: "",
      quantity: "",
      shelfLife: "",
      manufacturer: "Bhagyamma Hub",
      countryOfOrigin: "India",
      sku: "",
      price: "",
      status: "Active",
      images: [],
    }
  );

  const [previewImages, setPreviewImages] = useState([]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE IMAGE CHANGE
  // =====================================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    setForm((prev) => ({
      ...prev,
      images: files,
    }));

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "images") {
        formData.append(key, form[key]);
      }
    });

    form.images.forEach((image) => {
      formData.append("images", image);
    });

    console.log("============= FormData =============");

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    console.log("====================================");

    onSubmit(formData);
  };

  // =====================================================
  // COMMON FIELD STYLE
  // =====================================================

  const fieldSx = {
    "& .MuiInputBase-root": {
      fontSize: {
        xs: "0.75rem",
        sm: "0.8rem",
      },
    },

    "& .MuiInputLabel-root": {
      fontSize: {
        xs: "0.75rem",
        sm: "0.8rem",
      },
    },

    "& .MuiInputBase-input": {
      py: {
        xs: 1.15,
        sm: 1.25,
      },
    },
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={{
          xs: 1.5,
          sm: 2,
        }}
      >
        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Benefits"
            name="benefits"
            value={form.benefits}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Ingredients"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Usage"
            name="usage"
            value={form.usage}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Storage"
            name="storage"
            value={form.storage}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* =================================================
            PRODUCT SPECIFICATIONS
        ================================================= */}

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Weight"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Shelf Life"
            name="shelfLife"
            value={form.shelfLife}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Manufacturer"
            name="manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country Of Origin"
            name="countryOfOrigin"
            value={form.countryOfOrigin}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* =================================================
            PRICE + STATUS
        ================================================= */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            inputProps={{
              min: 0,
            }}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            sx={fieldSx}
          >
            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>
        </Grid>

        {/* =================================================
            IMAGE UPLOAD
        ================================================= */}

        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              minHeight: 42,
              borderRadius: 0,
              borderColor: "#2E7D32",
              color: "#2E7D32",
              textTransform: "none",
              fontSize: {
                xs: "0.7rem",
                sm: "0.78rem",
              },
              fontWeight: 600,

              "&:hover": {
                borderColor: "#1B5E20",
                bgcolor: "#F1F8F2",
              },
            }}
          >
            Upload Product Images

            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Grid>

        {/* =================================================
            IMAGE PREVIEW
        ================================================= */}

        {previewImages.length > 0 && (
          <Grid item xs={12}>
            <Typography
              sx={{
                mb: 1,
                fontWeight: 600,
                color: "#333",
                fontSize: {
                  xs: "0.72rem",
                  sm: "0.8rem",
                },
              }}
            >
              Image Preview ({previewImages.length})
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {previewImages.map((image, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    width: {
                      xs: 75,
                      sm: 90,
                    },
                    height: {
                      xs: 75,
                      sm: 90,
                    },
                    borderRadius: 0,
                    border: "1px solid #E0E0E0",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    alt={`Preview ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      bgcolor: "#F8F8F8",
                    }}
                  />
                </Card>
              ))}
            </Box>
          </Grid>
        )}

        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minHeight: {
                xs: 40,
                sm: 44,
              },
              mt: 0.5,
              borderRadius: 0,
              bgcolor: "#1B5E20",
              textTransform: "none",
              fontWeight: 700,
              fontSize: {
                xs: "0.72rem",
                sm: "0.8rem",
              },
              boxShadow: "none",

              "&:hover": {
                bgcolor: "#154A19",
                boxShadow: "none",
              },

              "&:disabled": {
                bgcolor: "#A5A5A5",
                color: "#fff",
              },
            }}
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;