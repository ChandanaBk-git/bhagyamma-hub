import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  Typography,
} from "@mui/material";

import ProductBanner from "../../components/products/ProductBanner";
import ProductSearch from "../../components/products/ProductSearch";
import ProductCard from "../../components/products/ProductCard";
import { getProducts } from "../../services/product.service";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.productName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

const fetchProducts = async () => {
  try {
    setLoading(true);

const response = await getProducts();

const productList = response.data || [];

    console.log("Product List:", productList);

    setProducts(productList);
    setFilteredProducts(productList);
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <ProductBanner />

      <Container maxWidth="lg">
        <Box
          sx={{
            py: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ProductSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Typography align="center" sx={{ py: 5 }}>
            No products found.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredProducts.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product._id}
              >
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Products;