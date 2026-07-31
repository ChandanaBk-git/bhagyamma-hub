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

const ProductForm = ({ initialValues, onSubmit, loading }) => {
  const [form, setForm] = useState(
    initialValues || {
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
      images: [],
    }
  );

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    console.log("Selected Images:", files);

    setForm((prev) => ({
      ...prev,
      images: files,
    }));

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(previews);
  };

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

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    console.log("====================================");

    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Benefits"
            name="benefits"
            value={form.benefits}
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
            value={form.ingredients}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            required
            type="number"
            label="MRP"
            name="mrp"
            value={form.mrp}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            required
            type="number"
            label="Selling Price"
            name="sellingPrice"
            value={form.sellingPrice}
            onChange={handleChange}
          />
        </Grid>

        {/* <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            required
            type="number"
            label="Stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />
        </Grid> */}

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={6}>

          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            Upload Images

            <input
              hidden
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

          </Button>

        </Grid>

        {previewImages.length > 0 && (

          <Grid item xs={12}>

            <Typography
              variant="h6"
              gutterBottom
            >
              Image Preview ({previewImages.length})
            </Typography>

            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
            >
              {previewImages.map((image, index) => (

                <Card
                  key={index}
                  sx={{
                    width: 150,
                    height: 150,
                  }}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Card>

              ))}
            </Box>

          </Grid>

        )}

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </Grid>

      </Grid>

    </Box>
  );
};

export default ProductForm;