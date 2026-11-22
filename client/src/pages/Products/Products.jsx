import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TuneIcon from "@mui/icons-material/Tune";

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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedParent, setSelectedParent] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [expandedParent, setExpandedParent] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // =====================================================
  // LOAD PRODUCTS AND CATEGORIES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
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
          const result = productResult.value;
          setProducts(Array.isArray(result) ? result : []);
        } else {
          throw productResult.reason;
        }

        if (categoryResult.status === "fulfilled") {
          const result = categoryResult.value;
          setCategories(Array.isArray(result) ? result : []);
        } else {
          setCategoryError(
            categoryResult.reason?.message ||
              "Unable to load categories."
          );
        }
      } catch (err) {
        if (!mounted) return;
        console.error("PRODUCT FETCH ERROR:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load products."
        );
      } finally {
        if (mounted) {
          setLoading(false);
          setCategoryLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // PARENT AND CHILD CATEGORIES
  // =====================================================

  const parentCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        !category.parentCategory ||
        getId(category.parentCategory) === ""
    );
  }, [categories]);

  const childCategories = useMemo(() => {
    if (!expandedParent) return [];

    return categories.filter(
      (category) =>
        getId(category.parentCategory) === expandedParent
    );
  }, [categories, expandedParent]);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      const productName = product?.productName?.toLowerCase() || "";
      const categoryName = product?.category?.toLowerCase() || "";
      const brand = product?.brand?.toLowerCase() || "";
      const description = product?.description?.toLowerCase() || "";

      const searchMatch =
        !search ||
        productName.includes(search) ||
        categoryName.includes(search) ||
        brand.includes(search) ||
        description.includes(search);

      if (!searchMatch) return false;

      if (selectedParent) {
        const productParent = getId(product.parentCategory);
        const selectedParentName = parentCategories.find(
          (item) => String(item._id) === selectedParent
        )?.name;

        const parentMatch =
          productParent === selectedParent ||
          (!productParent &&
            selectedParentName &&
            product.category?.toLowerCase() ===
              selectedParentName.toLowerCase());

        if (!parentMatch) return false;
      }

      if (selectedChild) {
        const productCategories = Array.isArray(product.categories)
          ? product.categories.map(getId)
          : [];

        if (!productCategories.includes(selectedChild)) {
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

  // =====================================================
  // HANDLERS
  // =====================================================

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

  const activeFilterCount =
    (selectedParent ? 1 : 0) +
    (selectedChild ? 1 : 0) +
    (minPrice !== "" || maxPrice !== "" ? 1 : 0);

  const hasFilters =
    searchTerm.trim() !== "" || activeFilterCount > 0;

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
      <ProductBanner />

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 2, sm: 3, md: 3.5 },
        }}
      >
        {/* SEARCH + MINIMISED FILTER BAR */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: 1.25,
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ProductSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Button
              variant={filtersOpen || activeFilterCount > 0 ? "contained" : "outlined"}
              color="success"
              size="small"
              startIcon={<TuneIcon fontSize="small" />}
              endIcon={
                filtersOpen ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )
              }
              onClick={() => setFiltersOpen((prev) => !prev)}
              sx={{
                height: 40,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                whiteSpace: "nowrap",
              }}
            >
              Filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>

            {hasFilters && (
              <Button
                size="small"
                color="inherit"
                startIcon={<RestartAltIcon fontSize="small" />}
                onClick={clearFilters}
                sx={{
                  height: 40,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Reset
              </Button>
            )}
          </Box>
        </Box>

        {/* COLLAPSIBLE COMPACT FILTER DRAWER */}
        <Collapse in={filtersOpen}>
          <Box
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8E2",
              borderRadius: 2,
              p: { xs: 1.5, sm: 2 },
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "flex-start" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* COMPACT CATEGORIES */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="#263C2B"
                  sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Categories
                </Typography>

                {categoryLoading ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} color="success" />
                    <Typography variant="caption" color="text.secondary">
                      Loading...
                    </Typography>
                  </Box>
                ) : categoryError ? (
                  <Alert severity="warning" sx={{ py: 0, fontSize: "0.75rem" }}>
                    {categoryError}
                  </Alert>
                ) : parentCategories.length === 0 ? (
                  <Typography color="text.secondary" variant="caption">
                    No categories available.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75,
                    }}
                  >
                    {parentCategories.map((parent) => {
                      const parentId = String(parent._id);
                      const isExpanded = expandedParent === parentId;
                      const isSelected = selectedParent === parentId;

                      return (
                        <Chip
                          key={parentId}
                          label={parent.name}
                          size="small"
                          clickable
                          color={isSelected ? "success" : "default"}
                          variant={isSelected ? "filled" : "outlined"}
                          onClick={() => handleParentClick(parentId)}
                          onDelete={() => handleParentClick(parentId)}
                          deleteIcon={
                            isExpanded ? (
                              <ExpandMoreIcon fontSize="small" />
                            ) : (
                              <ChevronRightIcon fontSize="small" />
                            )
                          }
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.78rem",
                          }}
                        />
                      );
                    })}
                  </Box>
                )}

                {/* SUBCATEGORIES ROW */}
                {expandedParent && (
                  <Box
                    sx={{
                      mt: 1,
                      pt: 1,
                      borderTop: "1px dashed #E5E9E5",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 0.6,
                    }}
                  >
                    <Chip
                      label="All"
                      size="small"
                      clickable
                      color={!selectedChild ? "success" : "default"}
                      variant={!selectedChild ? "filled" : "outlined"}
                      onClick={() => setSelectedChild("")}
                      sx={{ height: 24, fontSize: "0.72rem" }}
                    />

                    {childCategories.map((child) => {
                      const childId = String(child._id);
                      return (
                        <Chip
                          key={childId}
                          label={child.name}
                          size="small"
                          clickable
                          color={selectedChild === childId ? "success" : "default"}
                          variant={selectedChild === childId ? "filled" : "outlined"}
                          onClick={() => handleChildClick(childId)}
                          sx={{ height: 24, fontSize: "0.72rem" }}
                        />
                      );
                    })}

                    {childCategories.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        No subcategories
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: "none", md: "block" } }}
              />

              {/* COMPACT PRICE RANGE */}
              <Box sx={{ width: { xs: "100%", md: 250 }, flexShrink: 0 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="#263C2B"
                  sx={{ display: "block", mb: 0.75, textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Price Range
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                  }}
                >
                  <TextField
                    placeholder="Min"
                    type="number"
                    size="small"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    inputProps={{ min: 0 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-root": { height: 34, fontSize: "0.82rem" },
                    }}
                  />

                  <TextField
                    placeholder="Max"
                    type="number"
                    size="small"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    inputProps={{ min: 0 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-root": { height: 34, fontSize: "0.82rem" },
                    }}
                  />
                </Box>

                {minPrice !== "" &&
                  maxPrice !== "" &&
                  Number(minPrice) > Number(maxPrice) && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ display: "block", mt: 0.5, fontSize: "0.7rem" }}
                    >
                      Min price cannot exceed Max price.
                    </Typography>
                  )}
              </Box>
            </Box>
          </Box>
        </Collapse>

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
            <CircularProgress color="success" size={28} />
            <Typography color="text.secondary" variant="body2">
              Loading products...
            </Typography>
          </Box>
        )}

        {/* ERROR */}
        {!loading && error && (
          <Box sx={{ maxWidth: 600, mx: "auto", py: 3 }}>
            <Alert severity="error" sx={{ borderRadius: 0 }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* EMPTY RESULTS */}
        {!loading && !error && filteredProducts.length === 0 && (
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
        )}

        {/* PRODUCT COUNT + GRID */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1.5,
              }}
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

            <ProductGrid products={filteredProducts} />
          </>
        )}
      </Container>
    </Box>
  );
};

export default Products;