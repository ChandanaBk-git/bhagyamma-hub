import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
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

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const productList = await getProducts(false);

      console.log("Products:", productList);

      setProducts(productList || []);
      setFilteredProducts(productList || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================================
  // SEARCH
  // =========================================

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase().trim();

    const filtered = products.filter((product) => {
      return (
        product.productName
          ?.toLowerCase()
          .includes(value) ||
        product.category
          ?.toLowerCase()
          .includes(value)
      );
    });

    setFilteredProducts(filtered);
  };

  // =========================================
  // DELETE
  // =========================================

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

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "150px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={26} />
      </Box>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        margin: 0,

        padding: {
          xs: "12px 8px 20px",
          sm: "16px 14px 24px",
          md: "20px 0 30px",
        },

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >
      {/* =====================================
          HEADER
      ===================================== */}

      <Box
        sx={{
          width: "100%",

          display: "flex",

          alignItems: {
            xs: "flex-start",
            sm: "center",
          },

          justifyContent: "space-between",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          gap: {
            xs: "10px",
            sm: "0",
          },

          marginBottom: {
            xs: "12px",
            sm: "16px",
            md: "20px",
          },
        }}
      >
        {/* TITLE */}

        <Typography
          component="h1"
          sx={{
            margin: 0,

            fontSize: {
              xs: "21px",
              sm: "24px",
              md: "28px",
            },

            lineHeight: {
              xs: "26px",
              sm: "30px",
              md: "34px",
            },

            fontWeight: 700,

            color: "#292929",
          }}
        >
          Product Management
        </Typography>

        {/* ADD PRODUCT */}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/admin/products/add")
          }
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },

            minHeight: {
              xs: "38px",
              sm: "40px",
            },

            padding: {
              xs: "6px 13px",
              sm: "7px 16px",
            },

            fontSize: {
              xs: "12px",
              sm: "13px",
            },

            textTransform: "none",

            borderRadius: "7px",
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* =====================================
          SEARCH
      ===================================== */}

      <Box
        sx={{
          width: "100%",

          margin: 0,

          marginBottom: {
            xs: "10px",
            sm: "12px",
            md: "16px",
          },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search Product"
          onChange={handleSearch}
          sx={{
            width: "100%",

            "& .MuiOutlinedInput-root": {
              width: "100%",

              height: {
                xs: "48px",
                sm: "50px",
                md: "52px",
              },

              borderRadius: {
                xs: "10px",
                sm: "11px",
                md: "12px",
              },

              backgroundColor: "#FFFFFF",

              "& fieldset": {
                borderColor: "#CFCFCF",
              },

              "&:hover fieldset": {
                borderColor: "#B5B5B5",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#2E7D32",
              },
            },

            "& .MuiInputBase-input": {
              fontSize: {
                xs: "13px",
                sm: "14px",
                md: "15px",
              },

              padding: {
                xs: "0 13px",
                sm: "0 14px",
                md: "0 15px",
              },
            },
          }}
        />
      </Box>

      {/* =====================================
          PRODUCT TABLE
      ===================================== */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "100%",

          margin: 0,
          padding: 0,

          border: "1px solid #D0D0D0",

          borderRadius: {
            xs: "9px",
            sm: "10px",
            md: "12px",
          },

          backgroundColor: "#FFFFFF",

          boxShadow: "none",

          overflowX: "auto",
          overflowY: "hidden",

          WebkitOverflowScrolling: "touch",

          "&::-webkit-scrollbar": {
            height: "3px",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#BDBDBD",
            borderRadius: "10px",
          },
        }}
      >
        <Table
          sx={{
            /*
             * Keep the table compact.
             * It can horizontally scroll on very
             * small screens instead of clipping
             * the first column.
             */
            minWidth: {
              xs: "680px",
              sm: "760px",
              md: "900px",
            },

            width: "max-content",

            tableLayout: "auto",

            borderCollapse: "collapse",

            // ===================================
            // ALL CELLS
            // ===================================

            "& .MuiTableCell-root": {
              border: "1px solid #D6D6D6",

              padding: {
                xs: "6px 10px",
                sm: "7px 12px",
                md: "9px 14px",
              },

              fontSize: {
                xs: "12px",
                sm: "13px",
                md: "14px",
              },

              lineHeight: {
                xs: "1.2",
                sm: "1.25",
                md: "1.3",
              },

              color: "#222222",

              verticalAlign: "middle",
            },

            // ===================================
            // HEADER
            // ===================================

            "& .MuiTableHead-root .MuiTableCell-root": {
              backgroundColor: "#F8F8F8",

              fontWeight: 700,

              whiteSpace: "nowrap",

              height: {
                xs: "40px",
                sm: "43px",
                md: "47px",
              },

              padding: {
                xs: "5px 10px",
                sm: "6px 12px",
                md: "8px 14px",
              },
            },

            // ===================================
            // ROW HEIGHT
            // ===================================

            "& .MuiTableBody-root .MuiTableRow-root": {
              height: {
                xs: "54px",
                sm: "58px",
                md: "64px",
              },
            },

            // ===================================
            // HOVER
            // ===================================

            "& .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root":
              {
                backgroundColor: "#FAFAFA",
              },
          }}
        >
          {/* ===================================
              TABLE HEADER
          =================================== */}

          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  minWidth: {
                    xs: "75px",
                    sm: "85px",
                  },

                  width: {
                    xs: "75px",
                    sm: "85px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Image
              </TableCell>

              <TableCell
                sx={{
                  minWidth: {
                    xs: "135px",
                    sm: "150px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Name
              </TableCell>

              <TableCell
                sx={{
                  minWidth: {
                    xs: "120px",
                    sm: "135px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Category
              </TableCell>

              <TableCell
                sx={{
                  minWidth: {
                    xs: "80px",
                    sm: "90px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Price
              </TableCell>

              <TableCell
                sx={{
                  minWidth: {
                    xs: "90px",
                    sm: "100px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Status
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  minWidth: {
                    xs: "80px",
                    sm: "90px",
                  },

                  whiteSpace: "nowrap",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          {/* ===================================
              TABLE BODY
          =================================== */}

          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  {/* IMAGE */}

                  <TableCell>
                    <Box
                      component="img"
                      src={
                        product.images?.length
                          ? getImageUrl(
                              product.images[0]
                            )
                          : "/no-image.png"
                      }
                      alt={
                        product.productName ||
                        "Product"
                      }
                      sx={{
                        width: {
                          xs: "38px",
                          sm: "42px",
                          md: "50px",
                        },

                        height: {
                          xs: "38px",
                          sm: "42px",
                          md: "50px",
                        },

                        display: "block",

                        borderRadius: {
                          xs: "5px",
                          sm: "6px",
                          md: "8px",
                        },

                        objectFit: "cover",

                        border: "1px solid #E0E0E0",
                      }}
                    />
                  </TableCell>

                  {/* NAME */}

                  <TableCell
                    sx={{
                      minWidth: {
                        xs: "135px",
                        sm: "150px",
                      },

                      maxWidth: {
                        xs: "180px",
                        sm: "200px",
                      },

                      whiteSpace: "normal",

                      wordBreak: "break-word",
                    }}
                  >
                    {product.productName || "-"}
                  </TableCell>

                  {/* CATEGORY */}

                  <TableCell
                    sx={{
                      minWidth: {
                        xs: "120px",
                        sm: "135px",
                      },

                      maxWidth: {
                        xs: "150px",
                        sm: "170px",
                      },

                      whiteSpace: "normal",

                      wordBreak: "break-word",
                    }}
                  >
                    {product.category || "-"}
                  </TableCell>

                  {/* PRICE */}

                  <TableCell
                    sx={{
                      minWidth: {
                        xs: "80px",
                        sm: "90px",
                      },

                      whiteSpace: "nowrap",
                    }}
                  >
                    ₹ {product.price}
                  </TableCell>

                  {/* STATUS */}

                  <TableCell
                    sx={{
                      minWidth: {
                        xs: "90px",
                        sm: "100px",
                      },
                    }}
                  >
                    <Chip
                      label={
                        product.status || "Inactive"
                      }
                      color={
                        product.status === "Active"
                          ? "success"
                          : "error"
                      }
                      size="small"
                      sx={{
                        height: {
                          xs: "24px",
                          sm: "26px",
                          md: "28px",
                        },

                        fontSize: {
                          xs: "10px",
                          sm: "11px",
                          md: "12px",
                        },

                        "& .MuiChip-label": {
                          padding: {
                            xs: "0 8px",
                            sm: "0 9px",
                          },
                        },
                      }}
                    />
                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell
                    align="center"
                    sx={{
                      minWidth: {
                        xs: "80px",
                        sm: "90px",
                      },

                      padding: {
                        xs: "3px 5px !important",
                        sm: "4px 7px !important",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        gap: {
                          xs: "1px",
                          sm: "2px",
                        },
                      }}
                    >
                      {/* EDIT */}

                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/admin/products/edit/${product._id}`
                          )
                        }
                        sx={{
                          width: {
                            xs: "30px",
                            sm: "34px",
                            md: "38px",
                          },

                          height: {
                            xs: "30px",
                            sm: "34px",
                            md: "38px",
                          },

                          padding: {
                            xs: "4px",
                            sm: "5px",
                          },
                        }}
                      >
                        <EditIcon
                          sx={{
                            fontSize: {
                              xs: "18px",
                              sm: "20px",
                              md: "22px",
                            },
                          }}
                        />
                      </IconButton>

                      {/* DELETE */}

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(
                            product._id
                          )
                        }
                        sx={{
                          width: {
                            xs: "30px",
                            sm: "34px",
                            md: "38px",
                          },

                          height: {
                            xs: "30px",
                            sm: "34px",
                            md: "38px",
                          },

                          padding: {
                            xs: "4px",
                            sm: "5px",
                          },
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            fontSize: {
                              xs: "18px",
                              sm: "20px",
                              md: "22px",
                            },
                          }}
                        />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    padding:
                      "20px !important",

                    fontSize:
                      "12px !important",
                  }}
                >
                  No Products Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductList;