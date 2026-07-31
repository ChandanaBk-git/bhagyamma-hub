import { Grid, TextField } from "@mui/material";
import { useState } from "react";

const MemberSearch = ({ members, setFilteredMembers }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);

    const keyword = value.toLowerCase();

    const filtered = members.filter((member) => {
      return (
        member.name?.toLowerCase().includes(keyword) ||
        member.userId?.toLowerCase().includes(keyword) ||
        member.mobile?.includes(keyword)
      );
    });

    setFilteredMembers(filtered);
  };

  return (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Search by User ID / Name / Mobile"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default MemberSearch;