import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProductTable = ({ products }) => {
  const navigate = useNavigate();

  console.log("Products received in table:", products);

  return (
    <Table>

      <TableHead>

        <TableRow>

          <TableCell>Image</TableCell>

          <TableCell>Product</TableCell>

          <TableCell>Category</TableCell>

          <TableCell>MRP</TableCell>

          <TableCell>Selling Price</TableCell>

          <TableCell>Stock</TableCell>

          <TableCell>Status</TableCell>

          <TableCell align="center">
            Actions
          </TableCell>

        </TableRow>

      </TableHead>

      <TableBody>

        {products.map((product) => (

          <TableRow key={product._id}>

            <TableCell>

              <Avatar
src={
  product.images?.length
    ? `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${product.images[0]}`
    : ""
}
                variant="rounded"
              />

            </TableCell>

            <TableCell>
              {product.productName}
            </TableCell>

            <TableCell>
              {product.category}
            </TableCell>

            <TableCell>
              ₹{product.mrp}
            </TableCell>

            <TableCell>
              ₹{product.sellingPrice}
            </TableCell>

            {/* <TableCell>
              {product.stock}
            </TableCell> */}

            <TableCell>

              <Chip
                label={product.status}
                color={
                  product.status === "Active"
                    ? "success"
                    : "default"
                }
              />

            </TableCell>

            <TableCell>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
              >

                <Button
                  startIcon={<Edit />}
                  onClick={() =>
                    navigate(
                      `/admin/products/edit/${product._id}`
                    )
                  }
                >
                  Edit
                </Button>

                <Button
                  color="error"
                  startIcon={<Delete />}
                >
                  Delete
                </Button>

              </Stack>

            </TableCell>

          </TableRow>

        ))}

      </TableBody>

    </Table>
  );
};

export default ProductTable;