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
        maxWidth: 650,
        mx: "auto",
      }}
    >
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products, category, brand..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: "#2E7D32",
                  fontSize: {
                    xs: 20,
                    sm: 22,
                  },
                }}
              />
            </InputAdornment>
          ),

          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchTerm("")}
                sx={{
                  color: "#777",
                  p: 0.5,
                }}
              >
                <ClearIcon
                  sx={{
                    fontSize: 17,
                  }}
                />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: {
              xs: 42,
              sm: 46,
            },

            bgcolor: "#fff",

            borderRadius: 0,

            fontSize: {
              xs: "0.68rem",
              sm: "0.75rem",
            },

            color: "#333",

            "& fieldset": {
              borderColor: "#D5DCD6",
            },

            "&:hover fieldset": {
              borderColor: "#A5C9A8",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#2E7D32",
              borderWidth: "1px",
            },
          },

          "& .MuiInputBase-input": {
            py: 0,

            "&::placeholder": {
              color: "#999",
              opacity: 1,
            },
          },
        }}
      />
    </Box>
  );
};

export default ProductSearch;