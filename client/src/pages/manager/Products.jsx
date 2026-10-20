
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import ProductBanner from "../../components/products/ProductBanner";
import ProductSearch from "../../components/products/ProductSearch";
import ProductGrid from "../../components/products/ProductGrid";

import { getProducts } from "../../services/product.service";
import { getCategories } from "../../services/category.service";

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getName = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return value.name || "";
  }

  return String(value);
};

const getResponseArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  return [];
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [expandedParent, setExpandedParent] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setCategoryLoading(true);
      setError("");
      setCategoryError("");

      const [productResult, categoryResult] =
        await Promise.allSettled([
          getProducts(),
          getCategories(),
        ]);

      if (!mounted) return;

      if (productResult.status === "fulfilled") {
        setProducts(getResponseArray(productResult.value));
      } else {
        console.error(
          "Manager product catalog error:",
          productResult.reason
        );

        setError(
          productResult.reason?.response?.data?.message ||
            productResult.reason?.message ||
            "Unable to load products."
        );
      }

      if (categoryResult.status === "fulfilled") {
        setCategories(getResponseArray(categoryResult.value));
      } else {
        console.error(
          "Manager category error:",
          categoryResult.reason
        );

        setCategoryError(
          categoryResult.reason?.response?.data?.message ||
            categoryResult.reason?.message ||
            "Unable to load categories."
        );
      }

      setLoading(false);
      setCategoryLoading(false);
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const parentCategories = useMemo(
    () =>
      categories.filter(
        (category) => !getId(category.parentCategory)
      ),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      const productName = String(
        product?.productName || product?.name || ""
      ).toLowerCase();

      const categoryName = getName(product?.category).toLowerCase();
      const brand = String(product?.brand || "").toLowerCase();
      const description = String(
        product?.description || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        productName.includes(search) ||
        categoryName.includes(search) ||
        brand.includes(search) ||
        description.includes(search);

      if (!matchesSearch) return false;

      if (selectedParent) {
        const parentId = getId(product.parentCategory);

        const parentName = parentCategories.find(
          (category) => getId(category) === selectedParent
        )?.name;

        const matchesParent =
          parentId === selectedParent ||
          (!parentId &&
            parentName &&
            categoryName === parentName.toLowerCase());

        if (!matchesParent) return false;
      }

      if (selectedChild) {
        const productCategoryIds = Array.isArray(product.categories)
          ? product.categories.map(getId)
          : [];

        if (!productCategoryIds.includes(selectedChild)) {
          return false;
        }
      }

      const price = Number(product.price);

      if (!Number.isFinite(price)) return false;
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      return true;
    });
  }, [
    products,
    searchTerm,
    selectedParent,
    selectedChild,
    minPrice,
    maxPrice,
    parentCategories,
  ]);

  const handleParentClick = (parentId) => {
    if (expandedParent === parentId) {
      setExpandedParent("");
      setSelectedParent("");
      setSelectedChild("");
      return;
    }

    setExpandedParent(parentId);
    setSelectedParent(parentId);
    setSelectedChild("");
  };

  const handleChildClick = (childId) => {
    setSelectedChild((previous) =>
      previous === childId ? "" : childId
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedParent("");
    setSelectedChild("");
    setExpandedParent("");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters = Boolean(
    searchTerm.trim() ||
      selectedParent ||
      selectedChild ||
      minPrice !== "" ||
      maxPrice !== ""
  );

  const invalidPriceRange =
    minPrice !== "" &&
    maxPrice !== "" &&
    Number(minPrice) > Number(maxPrice);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F8FAF8",
        overflowX: "hidden",
      }}
    >
      <ProductBanner />

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 2.5, sm: 3.5, md: 4.5 },
        }}
      >
        {/* SEARCH */}
        <Box sx={{ maxWidth: 650, mx: "auto", mb: 3 }}>
          <ProductSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Box>

        {/* CATEGORIES AND FILTERS */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            border: "1px solid #E7ECE7",
            borderRadius: { xs: 2, sm: 3 },
            p: { xs: 1.5, sm: 2.5, md: 3 },
            mb: { xs: 2.5, sm: 3 },
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
            mb={2}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color="#263C2B"
            >
              Browse Categories
            </Typography>

            {hasFilters && (
              <Button
                size="small"
                color="inherit"
                startIcon={<RestartAltIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {categoryLoading ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={18} color="success" />
              <Typography variant="body2" color="text.secondary">
                Loading categories...
              </Typography>
            </Box>
          ) : categoryError ? (
            <Alert severity="warning">{categoryError}</Alert>
          ) : parentCategories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No categories available.
            </Typography>
          ) : (
            <Box
              sx={{
                display: { xs: "flex", sm: "grid" },
                flexWrap: { xs: "nowrap", sm: "initial" },
                overflowX: { xs: "auto", sm: "visible" },
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                gridTemplateColumns: {
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1, sm: 1.5 },
                alignItems: "start",
              }}
            >
              {parentCategories.map((parent) => {
                const parentId = getId(parent);
                const expanded = expandedParent === parentId;
                const selected = selectedParent === parentId;

                const children = categories.filter(
                  (category) =>
                    getId(category.parentCategory) === parentId
                );

                return (
                  <Box
                    key={parentId}
                    sx={{
                      border: "1px solid",
                      borderColor: selected ? "#8AA88D" : "#E5E9E5",
                      borderRadius: 2,
                      overflow: "hidden",
                      minWidth: { xs: 142, sm: 0 },
                      flex: { xs: "0 0 142px", sm: "initial" },
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={() => handleParentClick(parentId)}
                      endIcon={
                        expanded ? (
                          <ExpandMoreIcon />
                        ) : (
                          <ChevronRightIcon />
                        )
                      }
                      sx={{
                        justifyContent: "space-between",
                        px: { xs: 1, sm: 1.75 },
                        py: { xs: 0.8, sm: 1.5 },
                        minHeight: { xs: 40, sm: 48 },
                        color: "#344238",
                        fontWeight: 600,
                        fontSize: { xs: "0.72rem", sm: "0.95rem" },
                        lineHeight: 1.2,
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        textTransform: "none",
                        textAlign: "left",
                      }}
                    >
                      {parent.name}
                    </Button>

                    {expanded && (
                      <>
                        <Divider />

                        <Box
                          sx={{
                            p: { xs: 1.25, sm: 1.5 },
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.75,
                          }}
                        >
                          <Chip
                            label="All"
                            size="small"
                            clickable
                            color={!selectedChild ? "success" : "default"}
                            variant={!selectedChild ? "filled" : "outlined"}
                            onClick={() => setSelectedChild("")}
                          />

                          {children.map((child) => {
                            const childId = getId(child);

                            return (
                              <Chip
                                key={childId}
                                label={child.name}
                                size="small"
                                clickable
                                color={
                                  selectedChild === childId
                                    ? "success"
                                    : "default"
                                }
                                variant={
                                  selectedChild === childId
                                    ? "filled"
                                    : "outlined"
                                }
                                onClick={() => handleChildClick(childId)}
                              />
                            );
                          })}

                          {children.length === 0 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              No subcategories yet.
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}

          <Divider sx={{ my: 2.5 }} />

          <Typography fontWeight={700} color="#263C2B" mb={1.5}>
            Filter by Price
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 220px))",
              },
              gap: 1.25,
            }}
          >
            <TextField
              label="Minimum Price (₹)"
              type="number"
              size="small"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              inputProps={{ min: 0 }}
              fullWidth
            />

            <TextField
              label="Maximum Price (₹)"
              type="number"
              size="small"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Box>

          {invalidPriceRange && (
            <Typography
              color="error"
              variant="caption"
              sx={{ display: "block", mt: 1 }}
            >
              Minimum price cannot be greater than maximum price.
            </Typography>
          )}
        </Box>

        {/* PRODUCT LOADING */}
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
            <CircularProgress color="success" size={28} />
            <Typography color="text.secondary" variant="body2">
              Loading products...
            </Typography>
          </Box>
        )}

        {/* PRODUCT ERROR */}
        {!loading && error && (
          <Alert severity="error">{error}</Alert>
        )}

        {/* PRODUCT GRID */}
        {!loading && !error && (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1.5}
            >
              <Typography
                color="#555"
                fontSize={{ xs: "0.75rem", sm: "0.85rem" }}
                fontWeight={600}
              >
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"}
              </Typography>
            </Box>

            {filteredProducts.length === 0 ? (
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
                <Typography fontWeight={700} color="#333">
                  No Products Found
                </Typography>

                <Typography mt={0.5} color="#777" variant="body2">
                  Try changing your search or filters.
                </Typography>

                {hasFilters && (
                  <Button
                    onClick={clearFilters}
                    color="success"
                    sx={{ mt: 1 }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Box>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Products;
