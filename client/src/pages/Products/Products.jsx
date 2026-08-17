import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
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
      {/* =================================================
          PRODUCT HERO
      ================================================= */}

      <ProductBanner />

      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          py: {
            xs: 4,
            sm: 5,
            md: 6,
          },
        }}
      >
        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <Box
          sx={{
            textAlign: "center",
            maxWidth: 750,
            mx: "auto",
            mb: {
              xs: 3,
              md: 4,
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#222",

              fontSize: {
                xs: "1.7rem",
                sm: "2rem",
                md: "2.4rem",
              },
            }}
          >
            Our Products
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#666",

              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
              },

              lineHeight: 1.7,
            }}
          >
            Explore our collection of premium herbal, Ayurvedic,
            skincare and wellness products.
          </Typography>
        </Box>

        {/* =================================================
            SEARCH
        ================================================= */}

        <Box
          sx={{
            maxWidth: 700,
            mx: "auto",
            mb: {
              xs: 4,
              md: 5,
            },
          }}
        >
          <ProductSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Box>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <Box
            sx={{
              minHeight: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress color="success" />

            <Typography
              color="text.secondary"
              fontSize="0.9rem"
            >
              Loading products...
            </Typography>
          </Box>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <Box
            sx={{
              maxWidth: 650,
              mx: "auto",
              py: 5,
            }}
          >
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* =================================================
            NO PRODUCTS
        ================================================= */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <Box
              sx={{
                minHeight: 300,
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
                  fontSize: "1.2rem",
                  color: "#333",
                }}
              >
                No Products Found
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#777",
                  fontSize: "0.9rem",
                }}
              >
                Try searching with a different product name,
                category or brand.
              </Typography>
            </Box>
          )}

        {/* =================================================
            PRODUCT COUNT
        ================================================= */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2.5,
                }}
              >
                <Typography
                  sx={{
                    color: "#555",
                    fontSize: {
                      xs: "0.82rem",
                      sm: "0.9rem",
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

              {/* =================================================
                  PRODUCT GRID
              ================================================= */}

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