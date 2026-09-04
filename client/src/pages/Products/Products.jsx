import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";

import ProductBanner from "../../components/products/ProductBanner";
import ProductSearch from "../../components/products/ProductSearch";
import ProductGrid from "../../components/products/ProductGrid";

import { getProducts } from "../../services/product.service";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("PRODUCT FETCH ERROR:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) => {
      const productName =
        product?.productName?.toLowerCase() || "";

      const category =
        product?.category?.toLowerCase() || "";

      const brand =
        product?.brand?.toLowerCase() || "";

      const description =
        product?.description?.toLowerCase() || "";

      return (
        productName.includes(search) ||
        category.includes(search) ||
        brand.includes(search) ||
        description.includes(search)
      );
    });
  }, [products, searchTerm]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F8FAF8",
      }}
    >
      {/* PRODUCT BANNER */}
      <ProductBanner />

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          py: {
            xs: 2.5,
            sm: 3.5,
            md: 4.5,
          },
        }}
      >


        {/* SEARCH */}
        <Box
          sx={{
            maxWidth: 650,
            mx: "auto",
            mb: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          <ProductSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Box>

        {/* LOADING */}
        {loading && (
          <Box
            sx={{
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <CircularProgress
              color="success"
              size={28}
            />

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "0.62rem",
                  sm: "0.72rem",
                },
              }}
            >
              Loading products...
            </Typography>
          </Box>
        )}

        {/* ERROR */}
        {!loading && error && (
          <Box
            sx={{
              maxWidth: 600,
              mx: "auto",
              py: 3,
            }}
          >
            <Alert
              severity="error"
              sx={{
                borderRadius: 0,
                fontSize: {
                  xs: "0.65rem",
                  sm: "0.75rem",
                },
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* NO PRODUCTS */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <Box
              sx={{
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "0.85rem",
                    sm: "1rem",
                  },
                  color: "#333",
                }}
              >
                No Products Found
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  color: "#777",
                  fontSize: {
                    xs: "0.6rem",
                    sm: "0.7rem",
                  },
                }}
              >
                Try searching with a different product name,
                category or brand.
              </Typography>
            </Box>
          )}

        {/* PRODUCT COUNT + GRID */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: {
                    xs: 1,
                    sm: 1.5,
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#555",
                    fontSize: {
                      xs: "0.65rem",
                      sm: "0.75rem",
                    },
                    fontWeight: 600,
                  }}
                >
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "Product"
                    : "Products"}
                </Typography>
              </Box>

              <ProductGrid
                products={filteredProducts}
              />
            </>
          )}
      </Container>
    </Box>
  );
};

export default Products;