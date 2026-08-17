import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";

import {
  getProducts,
  deleteProduct,
} from "../../services/product.service";

import { getImageUrl } from "../../utils/imageUrl";

const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchProducts = async () => {
  try {
    setLoading(true);

    const productList = await getProducts();

    console.log("Products:", productList);

    setProducts(productList);
    setFilteredProducts(productList);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value)
    );

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Unable to delete product.");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

    console.log("Filtered Products:", filteredProducts);

  return (
    <Container maxWidth="xl">

      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Product Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/products/add")}
        >
          Add Product
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Product"
        sx={{ mb: 3 }}
        onChange={handleSearch}
      />

      <TableContainer component={Paper}>

        <Table>

<TableHead>
  <TableRow>
    <TableCell>Image</TableCell>
    <TableCell>Name</TableCell>
    <TableCell>Category</TableCell>
    <TableCell>Price</TableCell>
    <TableCell>Status</TableCell>
    <TableCell align="center">Actions</TableCell>
  </TableRow>
</TableHead>

          <TableBody>

            {filteredProducts.map((product) => (

              <TableRow key={product._id}>

                <TableCell>
                  <img
                    src={
                      product.images?.length
                        ? getImageUrl(product.images[0])
                        : "/no-image.png"
                    }
                    alt={product.productName}
                    width={60}
                    height={60}
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                </TableCell>

                <TableCell>{product.productName}</TableCell>

                <TableCell>{product.category}</TableCell>

<TableCell>
  ₹ {product.price}
</TableCell>
                <TableCell>
                  <Chip
                    label={product.status}
                    color={
                      product.status === "Active"
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>

                <TableCell align="center">

                  <IconButton
                    color="primary"
                    onClick={() =>
                      navigate(
                        `/admin/products/edit/${product._id}`
                      )
                    }
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </TableContainer>

    </Container>
  );
};

export default ProductList;