import { useEffect, useState } from "react";

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
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ProductForm = ({
  initialValues,
  onSubmit,
  loading,
  mode = "create",
}) => {
  const [form, setForm] = useState(
    initialValues || {
      productName: "",
      category: "",
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
      images: [],
    }
  );

  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [mainImage, setMainImage] = useState(null);

  const [additionalImages, setAdditionalImages] =
    useState([]);

  const [mainPreview, setMainPreview] = useState("");

  const [additionalPreviews, setAdditionalPreviews] =
    useState([]);

  // =====================================================
  // LOAD EXISTING PRODUCT IMAGES
  // EDIT MODE
  // =====================================================

  useEffect(() => {
    if (
      mode === "edit" &&
      initialValues &&
      Array.isArray(initialValues.images)
    ) {
      const existingImages =
        initialValues.images.filter(Boolean);

      if (existingImages.length > 0) {
        setMainPreview(existingImages[0]);

        setAdditionalPreviews(
          existingImages.slice(1, 4)
        );
      }
    }
  }, [initialValues, mode]);

  // =====================================================
  // HANDLE NORMAL FIELD CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // MAIN IMAGE
  // ONLY ONE IMAGE
  // =====================================================

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate image
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    // Validate size - 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Main image must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    // Revoke previous object URL
    if (
      mainPreview &&
      mainPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(mainPreview);
    }

    const preview = URL.createObjectURL(file);

    setMainImage(file);
    setMainPreview(preview);

    // Clear input so same image can be selected again
    e.target.value = "";
  };

  // =====================================================
  // ADDITIONAL IMAGES
  // MAXIMUM 3
  // =====================================================

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    // Validate image files
    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      alert("Only image files are allowed.");
      e.target.value = "";
      return;
    }

    // Validate file sizes
    const largeFile = files.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (largeFile) {
      alert(
        "Each additional image must be less than 5 MB."
      );
      e.target.value = "";
      return;
    }

    // Maximum 3 additional images
    const remainingSlots =
      3 - additionalImages.length;

    if (remainingSlots <= 0) {
      alert(
        "You can upload a maximum of 3 additional images."
      );
      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(
      0,
      remainingSlots
    );

    if (files.length > remainingSlots) {
      alert(
        `Only ${remainingSlots} additional image${
          remainingSlots > 1 ? "s are" : " is"
        } allowed.`
      );
    }

    const newPreviews =
      selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setAdditionalImages((prev) => [
      ...prev,
      ...selectedFiles,
    ]);

    setAdditionalPreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    e.target.value = "";
  };

  // =====================================================
  // REMOVE MAIN IMAGE
  // =====================================================

  const removeMainImage = () => {
    if (
      mainPreview &&
      mainPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(mainPreview);
    }

    setMainImage(null);
    setMainPreview("");
  };

  // =====================================================
  // REMOVE ADDITIONAL IMAGE
  // =====================================================

  const removeAdditionalImage = (index) => {
    const preview =
      additionalPreviews[index];

    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(preview);
    }

    setAdditionalImages((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );

    setAdditionalPreviews((prev) =>
      prev.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    // ===================================================
    // CREATE MODE
    // ===================================================

    if (mode !== "edit" && !mainImage) {
      alert(
        "Please select the main product image."
      );

      return;
    }

    // ===================================================
    // IF NEW MAIN IMAGE IS SELECTED
    // TOTAL MAXIMUM = 4
    // ===================================================

    const newImages = [];

    if (mainImage) {
      newImages.push(mainImage);
    }

    additionalImages.forEach((image) => {
      newImages.push(image);
    });

    if (newImages.length > 4) {
      alert(
        "Maximum 4 product images are allowed."
      );

      return;
    }

    const formData = new FormData();

    // ===================================================
    // NORMAL PRODUCT FIELDS
    // ===================================================

    Object.keys(form).forEach((key) => {
      if (key !== "images") {
        formData.append(
          key,
          form[key] ?? ""
        );
      }
    });

    // ===================================================
    // IMAGE ORDER
    //
    // IMAGE 1 = MAIN IMAGE
    // IMAGE 2 = ADDITIONAL
    // IMAGE 3 = ADDITIONAL
    // IMAGE 4 = ADDITIONAL
    // ===================================================

    newImages.forEach((image) => {
      formData.append(
        "images",
        image
      );
    });

    // ===================================================
    // DEBUG
    // ===================================================

    console.log(
      "========== PRODUCT FORM =========="
    );

    console.log(
      "Main image:",
      mainImage?.name || "Existing image"
    );

    console.log(
      "Additional images:",
      additionalImages.map(
        (image) => image.name
      )
    );

    console.log(
      "Total new images:",
      newImages.length
    );

    console.log(
      "=================================="
    );

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
      sx={{
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={{
          xs: 1.5,
          sm: 2,
        }}
      >
        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

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

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Category"
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            sx={fieldSx}
          />
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

        {/* =================================================
            DESCRIPTION
        ================================================= */}

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

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

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

        {/* =================================================
            PRODUCT SPECIFICATIONS
        ================================================= */}

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
            value={
              form.countryOfOrigin || ""
            }
            onChange={handleChange}
            sx={fieldSx}
          />
        </Grid>

        {/* =================================================
            PRICE + STATUS
        ================================================= */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Price"
            name="price"
            value={form.price || ""}
            onChange={handleChange}
            inputProps={{
              min: 0,
            }}
            sx={fieldSx}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={
              form.status || "Active"
            }
            onChange={handleChange}
            sx={fieldSx}
          >
            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>
        </Grid>

        {/* =================================================
            MAIN IMAGE
        ================================================= */}

        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px solid #D8D8D8",
              p: {
                xs: 1.5,
                sm: 2,
              },
              bgcolor: "#FAFAFA",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.9rem",
                },
                mb: 0.5,
              }}
            >
              Main Product Image
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "0.68rem",
                  sm: "0.75rem",
                },
                color: "#777",
                mb: 1.5,
              }}
            >
              Select 1 image. This will be the
              main product image.
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
                fontWeight: 600,

                "&:hover": {
                  borderColor: "#1B5E20",
                  bgcolor: "#F1F8F2",
                },
              }}
            >
              {mainImage ||
              !mainPreview
                ? "Select Main Image"
                : "Change Main Image"}

              <input
                hidden
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={
                  handleMainImageChange
                }
              />
            </Button>

            {/* MAIN PREVIEW */}

            {mainPreview && (
              <Box
                sx={{
                  mt: 2,
                  position: "relative",
                  width: {
                    xs: 150,
                    sm: 190,
                  },
                  height: {
                    xs: 150,
                    sm: 190,
                  },
                  border:
                    "2px solid #2E7D32",
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
                    bgcolor:
                      "rgba(27,94,32,0.9)",
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
                    onClick={
                      removeMainImage
                    }
                    sx={{
                      position:
                        "absolute",
                      top: 3,
                      right: 3,
                      bgcolor:
                        "rgba(255,255,255,0.9)",
                      width: 30,
                      height: 30,

                      "&:hover": {
                        bgcolor: "#fff",
                      },
                    }}
                  >
                    <DeleteOutlineIcon
                      sx={{
                        fontSize: 18,
                        color: "#D32F2F",
                      }}
                    />
                  </IconButton>
                )}
              </Box>
            )}
          </Box>
        </Grid>

        {/* =================================================
            ADDITIONAL IMAGES
        ================================================= */}

        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px solid #D8D8D8",
              p: {
                xs: 1.5,
                sm: 2,
              },
              bgcolor: "#FAFAFA",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: "0.82rem",
                  sm: "0.9rem",
                },
                mb: 0.5,
              }}
            >
              Other Product Images
            </Typography>

            <Typography
              sx={{
                fontSize: {
                  xs: "0.68rem",
                  sm: "0.75rem",
                },
                color: "#777",
                mb: 1.5,
              }}
            >
              Select up to 3 additional images.
              Total product images: maximum 4.
            </Typography>

            <Button
              variant="outlined"
              component="label"
              disabled={
                additionalImages.length >= 3
              }
              sx={{
                minHeight: 42,
                borderRadius: 0,
                borderColor: "#2E7D32",
                color: "#2E7D32",
                textTransform: "none",
                fontWeight: 600,

                "&:hover": {
                  borderColor: "#1B5E20",
                  bgcolor: "#F1F8F2",
                },

                "&:disabled": {
                  borderColor: "#BDBDBD",
                  color: "#999",
                },
              }}
            >
              Select Other Images
              <input
                hidden
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={
                  handleAdditionalImagesChange
                }
              />
            </Button>

            <Typography
              sx={{
                mt: 1,
                fontSize: "0.68rem",
                color: "#777",
              }}
            >
              {additionalImages.length}/3
              additional images selected
            </Typography>

            {/* ADDITIONAL PREVIEWS */}

            {additionalPreviews.length >
              0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  mt: 2,
                }}
              >
                {additionalPreviews.map(
                  (image, index) => (
                    <Box
                      key={`${image}-${index}`}
                      sx={{
                        position:
                          "relative",
                      }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          width: {
                            xs: 85,
                            sm: 110,
                          },
                          height: {
                            xs: 85,
                            sm: 110,
                          },
                          borderRadius: 0,
                          border:
                            "1px solid #D8D8D8",
                          overflow: "hidden",
                          bgcolor: "#fff",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={image}
                          alt={`Additional ${
                            index + 1
                          }`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit:
                              "contain",
                          }}
                        />
                      </Card>

                      {/* NUMBER */}

                      <Box
                        sx={{
                          position:
                            "absolute",
                          left: 0,
                          bottom: 0,
                          bgcolor:
                            "rgba(0,0,0,0.65)",
                          color: "#fff",
                          px: 0.8,
                          py: 0.25,
                          fontSize:
                            "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        Image {index + 2}
                      </Box>

                      {/* DELETE */}

                      {additionalImages[
                        index
                      ] && (
                        <IconButton
                          type="button"
                          onClick={() =>
                            removeAdditionalImage(
                              index
                            )
                          }
                          sx={{
                            position:
                              "absolute",
                            top: 2,
                            right: 2,
                            width: 28,
                            height: 28,
                            bgcolor:
                              "rgba(255,255,255,0.9)",

                            "&:hover": {
                              bgcolor:
                                "#fff",
                            },
                          }}
                        >
                          <DeleteOutlineIcon
                            sx={{
                              fontSize: 17,
                              color:
                                "#D32F2F",
                            }}
                          />
                        </IconButton>
                      )}
                    </Box>
                  )
                )}
              </Box>
            )}
          </Box>
        </Grid>

        {/* =================================================
            IMAGE SUMMARY
        ================================================= */}

        <Grid item xs={12}>
          <Box
            sx={{
              p: 1.2,
              bgcolor: "#F1F8F2",
              border:
                "1px solid #C8E6C9",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.78rem",
                },
                fontWeight: 600,
                color: "#1B5E20",
              }}
            >
              Product Images:{" "}
              {mainPreview ? 1 : 0}
              {" + "}
              {additionalPreviews.length}
              {" = "}
              {(mainPreview ? 1 : 0) +
                additionalPreviews.length}
              / 4
            </Typography>
          </Box>
        </Grid>

        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              minHeight: {
                xs: 40,
                sm: 44,
              },
              mt: 0.5,
              borderRadius: 0,
              bgcolor: "#1B5E20",
              textTransform: "none",
              fontWeight: 700,
              fontSize: {
                xs: "0.72rem",
                sm: "0.8rem",
              },
              boxShadow: "none",

              "&:hover": {
                bgcolor: "#154A19",
                boxShadow: "none",
              },

              "&:disabled": {
                bgcolor: "#A5A5A5",
                color: "#fff",
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