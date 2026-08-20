import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  getManagerProducts,
} from "../../services/manager.service";

import {
  getImageUrl,
} from "../../utils/imageUrl";


/* =====================================================
   HELPERS
===================================================== */

const money = (
  value
) => {

  const numericValue =
    Number(value);

  const safeValue =
    Number.isFinite(
      numericValue
    )
      ? numericValue
      : 0;

  return `₹${safeValue.toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }
  )}`;

};


const getProductName = (
  product
) => {

  return (
    product?.productName ||
    product?.name ||
    "Unnamed Product"
  );

};


const getProductCategory = (
  product
) => {

  return (
    product?.category ||
    product?.categoryName ||
    "Uncategorized"
  );

};


const getProductPrice = (
  product
) => {

  const value =
    Number(
      product?.price ??
      product?.sellingPrice ??
      0
    );

  return Number.isFinite(
    value
  )
    ? value
    : 0;

};


/* =====================================================
   STOCK
===================================================== */

const getProductStock = (
  product
) => {

  const value =
    Number(
      product?.stock ?? 0
    );

  return Number.isFinite(
    value
  )
    ? Math.max(
        value,
        0
      )
    : 0;

};


/* =====================================================
   SOLD ITEMS
===================================================== */

const getSoldItems = (
  product
) => {

  const value =
    Number(
      product?.soldItems ?? 0
    );

  return Number.isFinite(
    value
  )
    ? Math.max(
        value,
        0
      )
    : 0;

};


/* =====================================================
   STATUS
===================================================== */

const isProductActive = (
  product
) => {

  if (
    product?.isActive === false
  ) {

    return false;

  }


  return (
    String(
      product?.status ||
      "Active"
    ).toLowerCase() ===
    "active"
  );

};


/* =====================================================
   IMAGE
===================================================== */

const getProductImage = (
  product
) => {

  const image =
    Array.isArray(
      product?.images
    )
      ? product.images[0]
      : product?.image ||
        product?.images;


  if (!image) {

    return "";

  }


  if (
    String(
      image
    ).startsWith(
      "http"
    )
  ) {

    return image;

  }


  return getImageUrl(
    image
  );

};


/* =====================================================
   SUMMARY CARD
===================================================== */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {

  return (

    <Card
      elevation={0}
      sx={{
        width: "100%",

        height: "100%",

        border:
          "1px solid #E5E7EB",

        borderRadius: 3,
      }}
    >

      <Box
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
          },

          display: "flex",

          alignItems: "center",

          gap: 1.2,

          minWidth: 0,
        }}
      >

        <Box
          sx={{
            width: {
              xs: 40,
              sm: 46,
            },

            height: {
              xs: 40,
              sm: 46,
            },

            flexShrink: 0,

            borderRadius: 2,

            bgcolor:
              `${color}14`,

            color,

            display: "flex",

            alignItems: "center",

            justifyContent: "center",
          }}
        >

          {icon}

        </Box>


        <Box
          sx={{
            minWidth: 0,
          }}
        >

          <Typography
            fontSize={{
              xs: 10,
              sm: 11,
            }}
            color="text.secondary"
            noWrap
          >
            {title}
          </Typography>


          <Typography
            fontSize={{
              xs: 20,
              sm: 24,
            }}
            fontWeight={800}
            noWrap
          >
            {value}
          </Typography>


          <Typography
            fontSize={10}
            color="text.secondary"
            noWrap
          >
            {subtitle}
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

  const navigate =
    useNavigate();


  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    category,
    setCategory,
  ] = useState("ALL");


  const [
    status,
    setStatus,
  ] = useState("ALL");


  /* ===================================================
     LOAD PRODUCTS
  =================================================== */

  useEffect(
    () => {

      loadProducts();

    },
    []
  );


  const loadProducts =
    async () => {

      try {

        setLoading(
          true
        );

        setError("");


        const response =
          await getManagerProducts();


        /*
          Expected response:

          {
            success: true,
            data: [...]
          }
        */

        const data =
          Array.isArray(
            response
          )
            ? response
            : Array.isArray(
                response?.data
              )
              ? response.data
              : [];


        setProducts(
          data
        );

      } catch (
        requestError
      ) {

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

        setLoading(
          false
        );

      }

    };


  /* ===================================================
     CATEGORIES
  =================================================== */

  const categories =
    useMemo(
      () => {

        const values =
          products
            .map(
              (
                product
              ) =>
                getProductCategory(
                  product
                )
            )
            .filter(
              Boolean
            );


        return [
          ...new Set(
            values
          ),
        ];

      },
      [
        products,
      ]
    );


  /* ===================================================
     FILTERED PRODUCTS
  =================================================== */

  const filteredProducts =
    useMemo(
      () => {

        const searchValue =
          search
            .trim()
            .toLowerCase();


        return products.filter(
          (
            product
          ) => {

            const name =
              getProductName(
                product
              ).toLowerCase();


            const productCategory =
              getProductCategory(
                product
              ).toLowerCase();


            const active =
              isProductActive(
                product
              );


            const matchesSearch =
              !searchValue ||
              name.includes(
                searchValue
              ) ||
              productCategory.includes(
                searchValue
              );


            const matchesCategory =
              category ===
                "ALL" ||
              getProductCategory(
                product
              ) ===
                category;


            const matchesStatus =
              status ===
                "ALL" ||
              (
                status ===
                  "ACTIVE" &&
                active
              ) ||
              (
                status ===
                  "INACTIVE" &&
                !active
              );


            return (
              matchesSearch &&
              matchesCategory &&
              matchesStatus
            );

          }
        );

      },
      [
        products,
        search,
        category,
        status,
      ]
    );


  /* ===================================================
     SUMMARY VALUES
  =================================================== */

  const totalProducts =
    products.length;


  const activeProducts =
    products.filter(
      (
        product
      ) =>
        isProductActive(
          product
        )
    ).length;


  const inactiveProducts =
    totalProducts -
    activeProducts;


  const totalSold =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        getSoldItems(
          product
        ),
      0
    );


  const totalStock =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        getProductStock(
          product
        ),
      0
    );


  const categoriesCount =
    categories.length;


  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "60vh",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >

        <CircularProgress
          color="success"
        />

      </Box>

    );

  }


  return (

    <Box
      sx={{
        width: "100%",

        maxWidth: 1500,

        mx: "auto",

        minWidth: 0,

        overflowX: "hidden",

        boxSizing: "border-box",
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          alignItems: {
            xs: "stretch",
            sm: "center",
          },

          justifyContent:
            "space-between",

          gap: 1.5,

          mb: 2,
        }}
      >

        <Box
          sx={{
            minWidth: 0,
          }}
        >

          <Typography
            sx={{
              fontSize: {
                xs: 22,
                sm: 27,
                md: 30,
              },

              fontWeight: 800,
            }}
          >
            Products
          </Typography>


          <Typography
            sx={{
              mt: 0.4,

              fontSize: {
                xs: 12,
                sm: 13,
              },

              color:
                "text.secondary",
            }}
          >
            Product inventory overview
          </Typography>

        </Box>


        <Button
          variant="outlined"
          color="success"
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            navigate(
              "/manager/dashboard"
            )
          }
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },

            minHeight: 42,

            borderRadius: 2,

            textTransform:
              "none",

            fontWeight: 600,
          }}
        >
          Dashboard
        </Button>

      </Box>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,

            borderRadius: 2,
          }}
        >
          {error}
        </Alert>

      )}


      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm:
              "repeat(2, minmax(0, 1fr))",
            md:
              "repeat(4, minmax(0, 1fr))",
          },

          gap: {
            xs: 1.3,
            sm: 2,
          },

          mb: 2,
        }}
      >

        <SummaryCard
          title="Total Products"
          value={
            totalProducts
          }
          subtitle="Products"
          color="#2563EB"
          icon={
            <Inventory2Icon />
          }
        />


        <SummaryCard
          title="Active Products"
          value={
            activeProducts
          }
          subtitle="Currently active"
          color="#16A34A"
          icon={
            <CheckCircleIcon />
          }
        />


        <SummaryCard
          title="Sold Items"
          value={
            totalSold
          }
          subtitle="Total units sold"
          color="#EA580C"
          icon={
            <WarningIcon />
          }
        />


        <SummaryCard
          title="Available Stock"
          value={
            totalStock
          }
          subtitle={
            `${categoriesCount} categories`
          }
          color="#7C3AED"
          icon={
            <CategoryIcon />
          }
        />

      </Box>


      {/* =================================================
          FILTERS
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border:
            "1px solid #E5E7EB",

          borderRadius: 3,

          mb: 2,
        }}
      >

        <Box
          sx={{
            p: {
              xs: 1.5,
              sm: 2,
            },

            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm:
                "1fr 1fr",
              md:
                "2fr 1fr 1fr",
            },

            gap: 1.2,
          }}
        >

          {/* SEARCH */}

          <TextField
            fullWidth
            size="small"
            placeholder="Search product or category..."
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <SearchIcon
                    fontSize="small"
                  />
                </InputAdornment>
              ),
            }}
          />


          {/* CATEGORY */}

          <TextField
            select
            fullWidth
            size="small"
            label="Category"
            value={
              category
            }
            onChange={(
              event
            ) =>
              setCategory(
                event.target.value
              )
            }
          >

            <MenuItem
              value="ALL"
            >
              All Categories
            </MenuItem>


            {categories.map(
              (
                item
              ) => (

                <MenuItem
                  key={item}
                  value={item}
                >
                  {item}
                </MenuItem>

              )
            )}

          </TextField>


          {/* STATUS */}

          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={
              status
            }
            onChange={(
              event
            ) =>
              setStatus(
                event.target.value
              )
            }
          >

            <MenuItem
              value="ALL"
            >
              All Status
            </MenuItem>


            <MenuItem
              value="ACTIVE"
            >
              Active
            </MenuItem>


            <MenuItem
              value="INACTIVE"
            >
              Inactive
            </MenuItem>

          </TextField>

        </Box>

      </Card>


      {/* =================================================
          TABLE HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          mb: 1.2,

          gap: 1,
        }}
      >

        <Typography
          fontSize={{
            xs: 17,
            sm: 19,
          }}
          fontWeight={800}
        >
          Product Inventory
        </Typography>


        <Typography
          fontSize={12}
          color="text.secondary"
          sx={{
            flexShrink: 0,
          }}
        >
          {filteredProducts.length} result
          {filteredProducts.length !== 1
            ? "s"
            : ""}
        </Typography>

      </Box>


      {/* =================================================
          EMPTY
      ================================================= */}

      {filteredProducts.length === 0 ? (

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",

            borderRadius: 3,
          }}
        >

          <Box
            sx={{
              py: 6,

              px: 2,

              textAlign: "center",
            }}
          >

            <Inventory2Icon
              sx={{
                fontSize: 48,

                color:
                  "text.disabled",

                mb: 1,
              }}
            />


            <Typography
              fontWeight={800}
            >
              No products found
            </Typography>


            <Typography
              fontSize={12}
              color="text.secondary"
            >
              Try changing your search or filters.
            </Typography>

          </Box>

        </Card>

      ) : (

        /* =================================================
           TABLE
        ================================================= */

        <Card
          elevation={0}
          sx={{
            border:
              "1px solid #E5E7EB",

            borderRadius: 3,

            overflow: "hidden",

            width: "100%",
          }}
        >

          <TableContainer
            sx={{
              width: "100%",

              overflowX: "auto",

              "&::-webkit-scrollbar": {
                height: 7,
              },

              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  "#CBD5E1",

                borderRadius: 10,
              },
            }}
          >

            <Table
              sx={{
                minWidth: 900,

                tableLayout:
                  "fixed",
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
        width: 90,
        fontWeight: 800,
        fontSize: 12,
      }}
    >
      Image
    </TableCell>

    <TableCell
      sx={{
        width: 260,
        fontWeight: 800,
        fontSize: 12,
      }}
    >
      Product
    </TableCell>

    <TableCell
      sx={{
        width: 190,
        fontWeight: 800,
        fontSize: 12,
      }}
    >
      Category
    </TableCell>

    <TableCell
      align="right"
      sx={{
        width: 130,
        fontWeight: 800,
        fontSize: 12,
      }}
    >
      Price
    </TableCell>

    <TableCell
      align="center"
      sx={{
        width: 140,
        fontWeight: 800,
        fontSize: 12,
      }}
    >
      Sold Items
    </TableCell>
  </TableRow>
</TableHead>


              <TableBody>

                {filteredProducts.map(
                  (
                    product,
                    index
                  ) => {

                    const image =
                      getProductImage(
                        product
                      );


                    const stock =
                      getProductStock(
                        product
                      );


                    const sold =
                      getSoldItems(
                        product
                      );


                    const active =
                      isProductActive(
                        product
                      );


                    const outOfStock =
                      stock <= 0;


                    return (

                      <TableRow
                        key={
                          product?._id ||
                          index
                        }
                        hover
                        sx={{
                          "&:last-child td":
                            {
                              borderBottom: 0,
                            },
                        }}
                      >

                        {/* IMAGE */}

                        <TableCell>

                          <Box
                            sx={{
                              width: 54,

                              height: 54,

                              borderRadius: 2,

                              overflow:
                                "hidden",

                              bgcolor:
                                "#F1F5F9",

                              border:
                                "1px solid #E2E8F0",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",
                            }}
                          >

                            {image ? (

                              <Box
                                component="img"
                                src={image}
                                alt={
                                  getProductName(
                                    product
                                  )
                                }
                                sx={{
                                  width:
                                    "100%",

                                  height:
                                    "100%",

                                  objectFit:
                                    "cover",

                                  display:
                                    "block",
                                }}
                              />

                            ) : (

                              <Inventory2Icon
                                sx={{
                                  color:
                                    "text.disabled",
                                }}
                              />

                            )}

                          </Box>

                        </TableCell>


                        {/* PRODUCT */}

                        <TableCell>

                          <Typography
                            fontSize={13}
                            fontWeight={800}
                            sx={{
                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {
                              getProductName(
                                product
                              )
                            }
                          </Typography>


                          {product?.sku && (

                            <Typography
                              fontSize={10}
                              color="text.secondary"
                              noWrap
                            >
                              SKU:{" "}
                              {
                                product.sku
                              }
                            </Typography>

                          )}

                        </TableCell>


                        {/* CATEGORY */}

                        <TableCell>

                          <Typography
                            fontSize={12}
                            color="text.secondary"
                            noWrap
                            sx={{
                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {
                              getProductCategory(
                                product
                              )
                            }
                          </Typography>

                        </TableCell>


                        {/* PRICE */}

                        <TableCell
                          align="right"
                        >

                          <Typography
                            fontSize={13}
                            fontWeight={800}
                          >
                            {
                              money(
                                getProductPrice(
                                  product
                                )
                              )
                            }
                          </Typography>

                        </TableCell>


                        {/* SOLD */}

                        <TableCell
                          align="center"
                        >

                          <Typography
                            fontSize={14}
                            fontWeight={800}
                          >
                            {sold}
                          </Typography>


                          <Typography
                            fontSize={9}
                            color="text.secondary"
                          >
                            units
                          </Typography>

                        </TableCell>


                        {/* STOCK */}

                        <TableCell
                          align="center"
                        >

                          <Typography
                            fontSize={14}
                            fontWeight={800}
                            color={
                              outOfStock
                                ? "#DC2626"
                                : stock <= 5
                                  ? "#EA580C"
                                  : "#15803D"
                            }
                          >
                            {stock}
                          </Typography>


                          <Typography
                            fontSize={9}
                            color="text.secondary"
                          >
                            remaining
                          </Typography>

                        </TableCell>


                        {/* STATUS */}

                        <TableCell
                          align="center"
                        >

                          {!active ? (

                            <Chip
                              size="small"
                              label="Inactive"
                              color="default"
                              sx={{
                                fontSize: 10,
                              }}
                            />

                          ) : outOfStock ? (

                            <Chip
                              size="small"
                              label="Out of Stock"
                              color="error"
                              sx={{
                                fontSize: 10,
                              }}
                            />

                          ) : stock <= 5 ? (

                            <Chip
                              size="small"
                              label="Low Stock"
                              color="warning"
                              sx={{
                                fontSize: 10,
                              }}
                            />

                          ) : (

                            <Chip
                              size="small"
                              label="Active"
                              color="success"
                              sx={{
                                fontSize: 10,
                              }}
                            />

                          )}

                        </TableCell>

                      </TableRow>

                    );

                  }
                )}

              </TableBody>

            </Table>

          </TableContainer>

        </Card>

      )}


      {/* =================================================
          READ ONLY NOTICE
      ================================================= */}

      <Alert
        severity="info"
        sx={{
          mt: 2,

          borderRadius: 2,

          fontSize: {
            xs: 11,
            sm: 13,
          },
        }}
      >
        Manager access is read-only. Product details,
        inventory and sales information can be viewed,
        but managers cannot add, edit or delete products.
      </Alert>

    </Box>

  );

};


export default Products;