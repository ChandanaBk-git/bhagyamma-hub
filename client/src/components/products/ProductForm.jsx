
import { useEffect, useMemo, useState } from "react";

import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Card,
  CardMedia,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  FormHelperText,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { getCategories } from "../../services/category.service";

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || "");
  }

  return String(value);
};

const ProductForm = ({
  initialValues,
  onSubmit,
  loading,
  mode = "create",
}) => {
  const [form, setForm] = useState({
    productName: "",
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
    ...(initialValues || {}),
  });

  // =====================================================
  // CATEGORY STATE
  // =====================================================

  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedParentCategory, setSelectedParentCategory] =
    useState("");

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const parentCategories = useMemo(
    () =>
      categoryOptions.filter(
        (category) => !category.parentCategory
      ),
    [categoryOptions]
  );

  const childCategories = useMemo(
    () =>
      categoryOptions.filter(
        (category) =>
          getId(category.parentCategory) ===
          String(selectedParentCategory)
      ),
    [categoryOptions, selectedParentCategory]
  );

  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const [mainPreview, setMainPreview] = useState("");
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        setCategoryLoading(true);
        setCategoryError("");

        const response = await getCategories();

        if (!mounted) return;

        const categories = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        setCategoryOptions(categories);

        if (mode === "edit" && initialValues) {
          const parentId = getId(
            initialValues.parentCategory
          );

          setSelectedParentCategory(parentId);

          const existingCategories = Array.isArray(
            initialValues.categories
          )
            ? initialValues.categories
            : [];

          const childIds = existingCategories
            .map(getId)
            .filter(Boolean);

          setSelectedCategories(childIds);
        }
      } catch (error) {
        if (mounted) {
          setCategoryError(
            error.message || "Failed to load categories."
          );
        }
      } finally {
        if (mounted) {
          setCategoryLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [initialValues, mode]);

  // =====================================================
  // LOAD EXISTING IMAGES
  // =====================================================

  useEffect(() => {
    if (
      mode === "edit" &&
      initialValues &&
      Array.isArray(initialValues.images)
    ) {
      const images = initialValues.images.filter(Boolean);

      setMainPreview(images[0] || "");
      setAdditionalPreviews(images.slice(1, 4));
    }
  }, [initialValues, mode]);

  // =====================================================
  // NORMAL FIELD CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // PARENT CATEGORY CHANGE
  // =====================================================

  const handleParentCategoryChange = (event) => {
    setSelectedParentCategory(event.target.value);

    // Clear child selections when parent changes
    setSelectedCategories([]);
  };

  // =====================================================
  // CHILD CATEGORY CHANGE
  // =====================================================

  const handleChildCategoryChange = (event) => {
    const value = event.target.value;

    setSelectedCategories(
      typeof value === "string"
        ? value.split(",")
        : value
    );
  };

  // =====================================================
  // MAIN IMAGE
  // =====================================================

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Main image must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    if (mainPreview.startsWith("blob:")) {
      URL.revokeObjectURL(mainPreview);
    }

    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));

    event.target.value = "";
  };

  // =====================================================
  // ADDITIONAL IMAGES
  // =====================================================

  const handleAdditionalImagesChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      alert("Only image files are allowed.");
      event.target.value = "";
      return;
    }

    const largeFile = files.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (largeFile) {
      alert("Each image must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const remainingSlots = 3 - additionalImages.length;

    if (remainingSlots <= 0) {
      alert("Maximum 3 additional images are allowed.");
      event.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      alert(
        `Only ${remainingSlots} additional image(s) allowed.`
      );
    }

    const previews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setAdditionalImages((previous) => [
      ...previous,
      ...selectedFiles,
    ]);

    setAdditionalPreviews((previous) => [
      ...previous,
      ...previews,
    ]);

    event.target.value = "";
  };

  // =====================================================
  // REMOVE MAIN IMAGE
  // =====================================================

  const removeMainImage = () => {
    if (mainPreview.startsWith("blob:")) {
      URL.revokeObjectURL(mainPreview);
    }

    setMainImage(null);
    setMainPreview("");
  };

  // =====================================================
  // REMOVE ADDITIONAL IMAGE
  // =====================================================

  const removeAdditionalImage = (index) => {
    const preview = additionalPreviews[index];

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setAdditionalImages((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setAdditionalPreviews((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // SUBMIT PRODUCT
  // =====================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode !== "edit" && !mainImage) {
      alert("Please select the main product image.");
      return;
    }

    if (!selectedParentCategory) {
      alert("Please select a parent category.");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Please select at least one child category.");
      return;
    }

    const newImages = [];

    if (mainImage) {
      newImages.push(mainImage);
    }

    additionalImages.forEach((image) => {
      newImages.push(image);
    });

    if (newImages.length > 4) {
      alert("Maximum 4 product images are allowed.");
      return;
    }

    const selectedParent = parentCategories.find(
      (category) =>
        String(category._id) ===
        String(selectedParentCategory)
    );

    if (!selectedParent) {
      alert("Selected parent category is invalid.");
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (
        key === "images" ||
        key === "category" ||
        key === "categories" ||
        key === "parentCategory"
      ) {
        return;
      }

      const value = form[key];

      if (value !== undefined && value !== null) {
        formData.append(
          key,
          typeof value === "object"
            ? JSON.stringify(value)
            : String(value)
        );
      }
    });

    formData.set(
      "parentCategory",
      selectedParentCategory
    );

    // Legacy compatibility field
    formData.set("category", selectedParent.name);

    formData.set(
      "categories",
      JSON.stringify(selectedCategories)
    );

    newImages.forEach((image) => {
      formData.append("images", image);
    });

    console.log("========== PRODUCT FORM ==========");
    console.log("Parent:", selectedParent.name);
    console.log("Parent ID:", selectedParentCategory);
    console.log("Child IDs:", selectedCategories);
    console.log("New images:", newImages.length);
    console.log("==================================");

    onSubmit(formData);
  };

  // =====================================================
  // FIELD STYLE
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

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%" }}
    >
      <Grid container spacing={{ xs: 1.5, sm: 2 }}>

        {/* BASIC INFORMATION */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Product Name"
            name="productName"
            value={form.productName || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* PARENT CATEGORY */}

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            required
            label="Parent Category"
            value={selectedParentCategory}
            onChange={handleParentCategoryChange}
            disabled={categoryLoading}
            sx={fieldSx}
          >
            {parentCategories.map((category) => (
              <MenuItem
                key={category._id}
                value={String(category._id)}
              >
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* CHILD CATEGORIES */}

        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            required
            disabled={
              !selectedParentCategory ||
              childCategories.length === 0 ||
              categoryLoading
            }
            error={Boolean(categoryError)}
            sx={fieldSx}
          >
            <InputLabel id="product-child-categories-label">
              Child Categories
            </InputLabel>

            <Select
              labelId="product-child-categories-label"
              multiple
              value={selectedCategories}
              label="Child Categories"
              onChange={handleChildCategoryChange}
              renderValue={(selected) =>
                childCategories
                  .filter((category) =>
                    selected.includes(String(category._id))
                  )
                  .map((category) => category.name)
                  .join(", ")
              }
            >
              {childCategories.map((category) => (
                <MenuItem
                  key={category._id}
                  value={String(category._id)}
                >
                  <Checkbox
                    checked={selectedCategories.includes(
                      String(category._id)
                    )}
                  />

                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>

            <FormHelperText>
              {categoryError ||
                (categoryLoading
                  ? "Loading categories..."
                  : !selectedParentCategory
                  ? "Select a parent category first."
                  : childCategories.length === 0
                  ? "No child categories available."
                  : "Select one or more child categories.")}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Brand"
            name="brand"
            value={form.brand || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="SKU"
            name="sku"
            value={form.sku || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* DESCRIPTION */}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* PRODUCT DETAILS */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Benefits"
            name="benefits"
            value={form.benefits || ""}
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
            value={form.ingredients || ""}
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
            value={form.usage || ""}
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
            value={form.storage || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* SPECIFICATIONS */}

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Weight"
            name="weight"
            value={form.weight || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            value={form.quantity || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Shelf Life"
            name="shelfLife"
            value={form.shelfLife || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Manufacturer"
            name="manufacturer"
            value={form.manufacturer || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country Of Origin"
            name="countryOfOrigin"
            value={form.countryOfOrigin || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* PRICE AND STATUS */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Price"
            name="price"
            value={form.price ?? ""}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={form.status || "Active"}
            onChange={handleChange}
            sx={fieldSx}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Grid>

        {/* MAIN IMAGE */}

        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px solid #D8D8D8",
              p: { xs: 1.5, sm: 2 },
              bgcolor: "#FAFAFA",
            }}
          >
            <Typography fontWeight={700} mb={0.5}>
              Main Product Image
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1.5}
            >
              Select one image. Maximum size 5 MB.
            </Typography>

            <Button
              variant="outlined"
              component="label"
              sx={{
                minHeight: 42,
                borderRadius: 0,
                borderColor: "#2E7D32",
                color: "#2E7D32",
                textTransform: "none",
              }}
            >
              {mainImage || !mainPreview
                ? "Select Main Image"
                : "Change Main Image"}

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
              />
            </Button>

            {mainPreview && (
              <Box
                sx={{
                  mt: 2,
                  position: "relative",
                  width: { xs: 150, sm: 190 },
                  height: { xs: 150, sm: 190 },
                  border: "2px solid #2E7D32",
                  bgcolor: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  image={mainPreview}
                  alt="Main product"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(27,94,32,0.9)",
                    color: "#fff",
                    textAlign: "center",
                    py: 0.5,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  MAIN IMAGE
                </Box>

                {mainImage && (
                  <IconButton
                    type="button"
                    onClick={removeMainImage}
                    sx={{
                      position: "absolute",
                      top: 3,
                      right: 3,
                      bgcolor: "#fff",
                    }}
                  >
                    <DeleteOutlineIcon
                      sx={{ color: "#D32F2F" }}
                    />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
        </Grid>

        {/* ADDITIONAL IMAGES */}

        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px solid #D8D8D8",
              p: { xs: 1.5, sm: 2 },
              bgcolor: "#FAFAFA",
            }}
          >
            <Typography fontWeight={700} mb={0.5}>
              Other Product Images
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={1.5}
            >
              Maximum 3 additional images. Each must be under 5 MB.
            </Typography>

            <Button
              variant="outlined"
              component="label"
              disabled={additionalImages.length >= 3}
              sx={{
                minHeight: 42,
                borderRadius: 0,
                borderColor: "#2E7D32",
                color: "#2E7D32",
                textTransform: "none",
              }}
            >
              Select Other Images

              <input
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={handleAdditionalImagesChange}
              />
            </Button>

            <Typography
              mt={1}
              variant="caption"
              color="text.secondary"
            >
              {additionalImages.length}/3 additional images selected
            </Typography>

            {additionalPreviews.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                {additionalPreviews.map((image, index) => (
                  <Box
                    key={`${image}-${index}`}
                    sx={{ position: "relative" }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        width: { xs: 85, sm: 110 },
                        height: { xs: 85, sm: 110 },
                        borderRadius: 0,
                        border: "1px solid #D8D8D8",
                        overflow: "hidden",
                        bgcolor: "#fff",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={image}
                        alt={`Additional ${index + 1}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Card>

                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        bgcolor: "rgba(0,0,0,0.65)",
                        color: "#fff",
                        px: 0.8,
                        py: 0.25,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                      }}
                    >
                      Image {index + 2}
                    </Box>

                    {additionalImages[index] && (
                      <IconButton
                        type="button"
                        onClick={() =>
                          removeAdditionalImage(index)
                        }
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          width: 28,
                          height: 28,
                          bgcolor: "#fff",
                        }}
                      >
                        <DeleteOutlineIcon
                          sx={{
                            fontSize: 17,
                            color: "#D32F2F",
                          }}
                        />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* IMAGE SUMMARY */}

        <Grid item xs={12}>
          <Box
            sx={{
              p: 1.2,
              bgcolor: "#F1F8F2",
              border: "1px solid #C8E6C9",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#1B5E20",
              }}
            >
              Product Images:{" "}
              {(mainPreview ? 1 : 0) +
                additionalPreviews.length}{" "}
              / 4
            </Typography>
          </Box>
        </Grid>

        {/* SAVE BUTTON */}

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading || categoryLoading}
            sx={{
              minHeight: { xs: 40, sm: 44 },
              mt: 0.5,
              borderRadius: 0,
              bgcolor: "#1B5E20",
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#154A19",
                boxShadow: "none",
              },
            }}
          >
            {loading
              ? "Saving..."
              : mode === "edit"
              ? "Update Product"
              : "Save Product"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;