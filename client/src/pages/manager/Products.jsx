import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { getManagerProducts } from "../../services/manager.service";
import { getImageUrl } from "../../utils/imageUrl";

/* =====================================================
   HELPERS
===================================================== */

const getProductName = (product) =>
  product?.productName || product?.name || "Unnamed Product";

const getProductImage = (product) => {
  let image = "";

  if (Array.isArray(product?.images)) {
    image = product.images[0];
  } else {
    image = product?.image || product?.images || "";
  }

  // Support image objects
  if (image && typeof image === "object") {
    image = image.url || image.path || image.src || "";
  }

  if (!image) return "";

  const imageString = String(image);

  if (
    imageString.startsWith("http://") ||
    imageString.startsWith("https://") ||
    imageString.startsWith("data:")
  ) {
    return imageString;
  }

  return getImageUrl(imageString);
};

const getSoldItems = (product) => {
  const sold = Number(product?.soldItems ?? 0);

  return Number.isFinite(sold) && sold > 0 ? sold : 0;
};

/* =====================================================
   PRODUCT IMAGE
===================================================== */

const ProductImage = ({ product, size = 64 }) => {
  const image = getProductImage(product);
  const name = getProductName(product);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #E5E7EB",
        bgcolor: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Inventory2Icon sx={{ color: "#94A3B8" }} />
      )}
    </Box>
  );
};

/* =====================================================
   MOBILE PRODUCT CARD
===================================================== */

const MobileProductCard = ({ product }) => {
  const sold = getSoldItems(product);

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 2.5,
        p: 1.4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.4,
          minWidth: 0,
        }}
      >
        <ProductImage product={product} size={64} />

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            fontSize={14}
            fontWeight={700}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getProductName(product)}
          </Typography>
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            minWidth: 58,
            textAlign: "center",
            borderLeft: "1px solid #E5E7EB",
            pl: 1.2,
          }}
        >
          <Typography fontSize={20} fontWeight={800} lineHeight={1.1}>
            {sold}
          </Typography>

          <Typography fontSize={9} color="text.secondary">
            SOLD
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

/* =====================================================
   PAGE
===================================================== */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* ===================================================
     LOAD PRODUCTS
  =================================================== */

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getManagerProducts();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setProducts(data);
    } catch (requestError) {
      console.error(
        "Manager products error:",
        requestError
      );

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================
     SEARCH
  =================================================== */

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return products;
    }

    return products.filter((product) =>
      getProductName(product)
        .toLowerCase()
        .includes(value)
    );
  }, [products, search]);

  /* ===================================================
     TOTAL SOLD
  =================================================== */

  const totalSold = useMemo(
    () =>
      filteredProducts.reduce(
        (total, product) =>
          total + getSoldItems(product),
        0
      ),
    [filteredProducts]
  );

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={32} />
      </Box>
    );
  }

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        px: {
          xs: 1,
          sm: 2,
          md: 2.5,
        },
        py: {
          xs: 1.5,
          sm: 2,
        },
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: 20,
                sm: 24,
              },
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Products
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: 11,
                sm: 12,
              },
              color: "#6B7280",
              mt: 0.3,
            }}
          >
            Product-wise delivered sales
          </Typography>
        </Box>

        <TextField
          size="small"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search product..."
          sx={{
            width: {
              xs: "100%",
              sm: 280,
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#FFFFFF",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* SUMMARY */}

      <Card
        elevation={0}
        sx={{
          mb: 2,
          border: "1px solid #E5E7EB",
          borderRadius: 2.5,
          px: 2,
          py: 1.3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            fontSize={10}
            color="text.secondary"
          >
            PRODUCTS
          </Typography>

          <Typography
            fontSize={18}
            fontWeight={800}
          >
            {filteredProducts.length}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            fontSize={10}
            color="text.secondary"
          >
            TOTAL SOLD
          </Typography>

          <Typography
            fontSize={18}
            fontWeight={800}
          >
            {totalSold}
          </Typography>
        </Box>
      </Card>

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
          action={
            <Typography
              component="button"
              onClick={loadProducts}
              sx={{
                border: 0,
                bgcolor: "transparent",
                cursor: "pointer",
                fontWeight: 700,
                color: "inherit",
              }}
            >
              Retry
            </Typography>
          }
        >
          {error}
        </Alert>
      )}

      {/* EMPTY */}

      {!error &&
        filteredProducts.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 2.5,
              py: 6,
              textAlign: "center",
            }}
          >
            <Inventory2Icon
              sx={{
                fontSize: 42,
                color: "#CBD5E1",
              }}
            />

            <Typography
              mt={1}
              fontWeight={700}
            >
              No products found
            </Typography>

            <Typography
              fontSize={12}
              color="text.secondary"
            >
              Try a different product name.
            </Typography>
          </Card>
        )}

      {/* =================================================
          MOBILE
      ================================================= */}

      {filteredProducts.length > 0 && (
        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
            flexDirection: "column",
            gap: 1,
          }}
        >
          {filteredProducts.map(
            (product) => (
              <MobileProductCard
                key={
                  product?._id ||
                  product?.id ||
                  getProductName(product)
                }
                product={product}
              />
            )
          )}
        </Box>
      )}

      {/* =================================================
          DESKTOP TABLE
          ONLY IMAGE + PRODUCT NAME + SOLD
      ================================================= */}

      {filteredProducts.length > 0 && (
        <Card
          elevation={0}
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            width: "100%",
            border: "1px solid #E5E7EB",
            borderRadius: 2.5,
            overflow: "hidden",
          }}
        >
          <Table
            sx={{
              width: "100%",
              tableLayout: "fixed",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#F8FAFC",
                }}
              >
                <TableCell
                  sx={{
                    width: 100,
                    fontWeight: 800,
                    fontSize: 11,
                    color: "#475569",
                    borderBottom:
                      "1px solid #E5E7EB",
                  }}
                >
                  IMAGE
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    fontSize: 11,
                    color: "#475569",
                    borderBottom:
                      "1px solid #E5E7EB",
                  }}
                >
                  PRODUCT NAME
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    width: 150,
                    fontWeight: 800,
                    fontSize: 11,
                    color: "#475569",
                    borderBottom:
                      "1px solid #E5E7EB",
                  }}
                >
                  SOLD
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.map(
                (product) => {
                  const sold =
                    getSoldItems(product);

                  return (
                    <TableRow
                      key={
                        product?._id ||
                        product?.id ||
                        getProductName(
                          product
                        )
                      }
                      hover
                      sx={{
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      {/* IMAGE */}

                      <TableCell
                        sx={{
                          py: 1.2,
                        }}
                      >
                        <ProductImage
                          product={product}
                          size={58}
                        />
                      </TableCell>

                      {/* NAME */}

                      <TableCell
                        sx={{
                          py: 1.2,
                          fontWeight: 700,
                          fontSize: 13,
                          overflow: "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                        title={getProductName(
                          product
                        )}
                      >
                        {getProductName(
                          product
                        )}
                      </TableCell>

                      {/* SOLD */}

                      <TableCell
                        align="center"
                        sx={{
                          py: 1.2,
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontSize: 17,
                            fontWeight: 800,
                          }}
                        >
                          {sold}
                        </Typography>

                        <Typography
                          component="span"
                          sx={{
                            ml: 0.6,
                            fontSize: 10,
                            color: "#64748B",
                            fontWeight: 600,
                          }}
                        >
                          sold
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  );
};

export default Products;