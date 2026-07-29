import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import {
  getProductById,
  updateProduct,
} from "../../services/product.service";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    brand: "",
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

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);

      const product = response.data;

      setFormData({
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        description: product.description,
        benefits: product.benefits,
        ingredients: product.ingredients,
        mrp: product.mrp,
        sellingPrice: product.sellingPrice,
        stock: product.stock,
        status: product.status,
      });

      setPreviewImages(product.images || []);
    } catch (error) {
      console.error(error);
    }
  };

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

      await updateProduct(id, data);

      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Unable to update product.");
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
            color="success.main"
            fontWeight="bold"
            mb={4}
          >
            Edit Product
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
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
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
                  value={formData.description}
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
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                >
                  Change Images

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
                        src={
                          image.startsWith("/uploads")
                            ? `http://localhost:5000${image}`
                            : image
                        }
                        alt=""
                        width={140}
                        height={140}
                        style={{
                          borderRadius: 10,
                          objectFit: "cover",
                        }}
                      />

                    </Grid>

                  ))}

                </Grid>
              </Grid>

              <Grid item xs={12}>

                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Updating..."
                    : "Update Product"}
                </Button>

              </Grid>

            </Grid>

          </Box>

        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
      >
        <Alert severity="success" variant="filled">
          Product Updated Successfully
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default EditProduct;