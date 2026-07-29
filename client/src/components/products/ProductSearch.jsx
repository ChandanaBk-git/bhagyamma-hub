import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ProductSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        p: "4px 12px",
        width: "100%",
        maxWidth: 500,
        borderRadius: 3,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <IconButton>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default ProductSearch;