import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const ProductSearch = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <TextField
        fullWidth
        placeholder="Search products, category, brand..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="success" />
            </InputAdornment>
          ),

          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setSearchTerm("")
                }
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};

export default ProductSearch;