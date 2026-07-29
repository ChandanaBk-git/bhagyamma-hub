import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
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

import {
  getProducts,
  deleteProduct,
} from "../../services/product.service";

const ProductList = () => {

const [products,setProducts]=useState([]);

const [filteredProducts,setFilteredProducts]=useState([]);

const [loading,setLoading]=useState(true);

const [search,setSearch]=useState("");
const loadProducts = async () => {

try{

const response = await getProducts();

const data = response.data || [];

setProducts(data);

setFilteredProducts(data);

}catch(error){

console.error(error);

}finally{

setLoading(false);

}

};

useEffect(()=>{

loadProducts();

},[]);

useEffect(()=>{

const result = products.filter((product)=>

product.productName
.toLowerCase()
.includes(search.toLowerCase())

);

setFilteredProducts(result);

},[search,products]);

const handleDelete = async(id)=>{

const confirmDelete = window.confirm(
"Delete this product?"
);

if(!confirmDelete) return;

try{

await deleteProduct(id);

loadProducts();

}catch(error){

console.error(error);

}

};

if(loading){

return(

<Box
display="flex"
justifyContent="center"
mt={10}
>

<CircularProgress/>

</Box>

);

}

return (
  <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, px: 2 }}>
    <Card elevation={4}>
      <CardContent>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="success.main"
          mb={3}
        >
          Product Management
        </Typography>

        <TextField
          fullWidth
          label="Search Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Stock</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Products Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img
                        src={
                          product.images?.length
                            ? `http://localhost:5000${product.images[0]}`
                            : "https://via.placeholder.com/80"
                        }
                        alt={product.productName}
                        width={80}
                        height={80}
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </TableCell>

                    <TableCell>{product.productName}</TableCell>

                    <TableCell>{product.category}</TableCell>

                    <TableCell>
                      ₹{product.sellingPrice}
                    </TableCell>

                    <TableCell>{product.stock}</TableCell>

                    <TableCell>
                      <Chip
                        label={product.status}
                        color={
                          product.status === "Active"
                            ? "success"
                            : "error"
                        }
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </Box>
);

};
export default ProductList;
