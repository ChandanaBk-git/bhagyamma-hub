
import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category.service";

const initialForm = {
  name: "",
  description: "",
  image: null,
  categoryType: "parent",
  parentCategory: "",
};

const getParentId = (category) => {
  if (!category?.parentCategory) return "";

  if (typeof category.parentCategory === "object") {
    return category.parentCategory._id || "";
  }

  return String(category.parentCategory);
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      showMessage(
        error.message || "Unable to load categories.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Only top-level categories appear in the parent dropdown.
  const parentCategories = categories.filter(
    (category) => !getParentId(category)
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);

    setForm({
      ...initialForm,
    });

    setOpen(true);
  };

  const handleOpenEdit = (category) => {
    const parentId = getParentId(category);

    setEditingCategory(category);

    setForm({
      name: category.name || "",
      description: category.description || "",
      image: null,
      categoryType: parentId ? "child" : "parent",
      parentCategory: parentId,
    });

    setOpen(true);
  };

  const handleClose = () => {
    if (saving) return;

    setOpen(false);
    setEditingCategory(null);
    setForm(initialForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCategoryTypeChange = (event) => {
    const categoryType = event.target.value;

    setForm((previous) => ({
      ...previous,
      categoryType,
      parentCategory:
        categoryType === "parent"
          ? ""
          : previous.parentCategory,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select a valid image.", "error");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Image must be smaller than 5 MB.", "error");
      event.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      image: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();

    if (name.length < 3) {
      showMessage(
        "Category name must contain at least 3 characters.",
        "error"
      );
      return;
    }

    if (
      form.categoryType === "child" &&
      !form.parentCategory
    ) {
      showMessage(
        "Please select a parent category.",
        "error"
      );
      return;
    }

    if (
      form.categoryType === "child" &&
      form.parentCategory === editingCategory?._id
    ) {
      showMessage(
        "A category cannot be its own parent.",
        "error"
      );
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append(
      "description",
      form.description.trim()
    );

    // Empty string represents a top-level parent category.
    // Backend service must normalize "" to null.
    formData.append(
      "parentCategory",
      form.categoryType === "child"
        ? form.parentCategory
        : ""
    );

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      setSaving(true);

      if (editingCategory) {
        await updateCategory(
          editingCategory._id,
          formData
        );

        showMessage("Category updated successfully.");
      } else {
        await createCategory(formData);

        showMessage("Category created successfully.");
      }

      setOpen(false);
      setEditingCategory(null);
      setForm(initialForm);

      await fetchCategories();
    } catch (error) {
      showMessage(
        error.message || "Unable to save category.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCategory(category._id);

      showMessage("Category deleted successfully.");

      await fetchCategories();
    } catch (error) {
      showMessage(
        error.message || "Unable to delete category.",
        "error"
      );
    }
  };

  const getParentName = (category) => {
    const parentId = getParentId(category);

    if (!parentId) return "—";

    const populatedName =
      typeof category.parentCategory === "object"
        ? category.parentCategory.name
        : "";

    if (populatedName) return populatedName;

    const parent = categories.find(
      (item) => item._id === parentId
    );

    return parent?.name || "Parent not found";
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Category Management
          </Typography>

          <Typography color="text.secondary" variant="body2">
            Create and manage parent and child categories.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add Category
        </Button>
      </Stack>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 7, px: 2 }}>
            <Typography fontWeight={600}>
              No categories found
            </Typography>

            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ mt: 1 }}
            >
              Add your first parent category to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "action.hover" }}>
                  <TableCell>
                    <b>Image</b>
                  </TableCell>

                  <TableCell>
                    <b>Category Name</b>
                  </TableCell>

                  <TableCell>
                    <b>Category Type</b>
                  </TableCell>

                  <TableCell>
                    <b>Parent Category</b>
                  </TableCell>

                  <TableCell>
                    <b>Description</b>
                  </TableCell>

                  <TableCell align="right">
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {categories.map((category) => {
                  const isChild = Boolean(
                    getParentId(category)
                  );

                  return (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        {category.image ? (
                          <Box
                            component="img"
                            src={category.image}
                            alt={category.name}
                            sx={{
                              width: 58,
                              height: 58,
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 58,
                              height: 58,
                              borderRadius: 1,
                              backgroundColor: "action.hover",
                              display: "grid",
                              placeItems: "center",
                              color: "text.secondary",
                              fontSize: 12,
                            }}
                          >
                            No image
                          </Box>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={600}>
                          {category.name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {isChild
                          ? "Child Category"
                          : "Parent Category"}
                      </TableCell>

                      <TableCell>
                        {getParentName(category)}
                      </TableCell>

                      <TableCell>
                        {category.description || "—"}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEdit(category)}
                          aria-label="Edit category"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(category)}
                          aria-label="Delete category"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCategory
              ? "Edit Category"
              : "Create Category"}

            <IconButton
              onClick={handleClose}
              disabled={saving}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel id="category-type-label">
                  Category Type
                </InputLabel>

                <Select
                  labelId="category-type-label"
                  name="categoryType"
                  value={form.categoryType}
                  label="Category Type"
                  onChange={handleCategoryTypeChange}
                >
                  <MenuItem value="parent">
                    Parent Category
                  </MenuItem>

                  <MenuItem value="child">
                    Child Category
                  </MenuItem>
                </Select>
              </FormControl>

              {form.categoryType === "child" && (
                <FormControl fullWidth required>
                  <InputLabel id="parent-category-label">
                    Select Parent Category
                  </InputLabel>

                  <Select
                    labelId="parent-category-label"
                    name="parentCategory"
                    value={form.parentCategory}
                    label="Select Parent Category"
                    onChange={handleChange}
                  >
                    {parentCategories
                      .filter(
                        (category) =>
                          category._id !== editingCategory?._id
                      )
                      .map((category) => (
                        <MenuItem
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                label={
                  form.categoryType === "parent"
                    ? "Parent Category Name"
                    : "Child Category Name"
                }
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ maxLength: 50 }}
              />

              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                inputProps={{ maxLength: 500 }}
              />

              {editingCategory?.image && !form.image && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Current Image
                  </Typography>

                  <Box
                    component="img"
                    src={editingCategory.image}
                    alt="Current category"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              )}

              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                {form.image
                  ? form.image.name
                  : "Choose Category Image"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Supported formats: JPG, PNG, WEBP, GIF.
                Maximum 5 MB.
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleClose}
              color="inherit"
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
            >
              {saving ? (
                <CircularProgress size={22} color="inherit" />
              ) : editingCategory ? (
                "Save Changes"
              ) : (
                form.categoryType === "parent"
                  ? "Create Parent Category"
                  : "Create Child Category"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotification((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((previous) => ({
              ...previous,
              open: false,
            }))
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Categories;