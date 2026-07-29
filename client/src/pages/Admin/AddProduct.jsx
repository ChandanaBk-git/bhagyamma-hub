import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from "@mui/material";

import { createProduct } from "../../services/product.service";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    brand: "Bhagyamma Hub",
    description: "",
    benefits: "",
    ingredients: "",
    mrp: "",
    sellingPrice: "",
    stock: "",
    status: "Active",
  });

  const [images, setImages] = useState([]);

  const [previewImages, setPreviewImages] = useState([]);

    const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      alert("Maximum 3 images allowed.");
      return;
    }

    setImages(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      images.forEach((image) => {
        data.append("images", image);
      });

      await createProduct(data);

      setOpenSnackbar(true);

      setFormData({
        productName: "",
        category: "",
        brand: "Bhagyamma Hub",
        description: "",
        benefits: "",
        ingredients: "",
        mrp: "",
        sellingPrice: "",
        stock: "",
        status: "Active",
      });

      setImages([]);
      setPreviewImages([]);

    } catch (error) {
      console.error(error);
      alert("Unable to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Box
    sx={{
      maxWidth: 1200,
      mx: "auto",
      mt: 4,
      px: 2,
    }}
  >
    <Card elevation={4}>
      <CardContent>

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          color="success.main"
        >
          Add New Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>

          <Grid container spacing={3}>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="MRP"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Selling Price"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="Active">
                  Active
                </MenuItem>

                <MenuItem value="Inactive">
                  Inactive
                </MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                color="primary"
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

            <Grid item xs={12}>
              <Grid container spacing={2}>

                {previewImages.map((image, index) => (

                  <Grid item key={index}>

                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #ddd",
                      }}
                    />

                  </Grid>

                ))}

              </Grid>
            </Grid>

            <Grid item xs={12}>

              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Product"}
              </Button>

            </Grid>

          </Grid>

        </Box>

      </CardContent>
    </Card>

    <Snackbar
      open={openSnackbar}
      autoHideDuration={3000}
      onClose={() => setOpenSnackbar(false)}
    >
      <Alert severity="success" variant="filled">
        Product Added Successfully
      </Alert>
    </Snackbar>

  </Box>
);

};

export default AddProduct;