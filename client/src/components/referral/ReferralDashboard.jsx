import {
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import {
  People,
  Person,
  AccountTree,
  Search,
} from "@mui/icons-material";

const ReferralDashboard = ({
  stats,
  search,
  setSearch,
  expandAll,
  collapseAll,
}) => {
  return (
    <>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Referral Network
      </Typography>

      <Grid container spacing={2} mb={3}>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <People
              color="primary"
              sx={{ fontSize: 35 }}
            />

            <Typography variant="h6">
              Total Members
            </Typography>

            <Typography variant="h4">
              {stats.totalMembers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Person
              color="success"
              sx={{ fontSize: 35 }}
            />

            <Typography variant="h6">
              Managers
            </Typography>

            <Typography variant="h4">
              {stats.managers}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <AccountTree
              color="warning"
              sx={{ fontSize: 35 }}
            />

            <Typography variant="h6">
              Referral Levels
            </Typography>

            <Typography variant="h4">
              {stats.levels}
            </Typography>
          </Paper>
        </Grid>

      </Grid>

      <Grid
        container
        spacing={2}
        mb={4}
      >
        <Grid item xs={12} md={6}>

          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name / User ID"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent="flex-end"
          gap={2}
        >
          <Button
            variant="contained"
            onClick={expandAll}
          >
            Expand All
          </Button>

          <Button
            variant="outlined"
            onClick={collapseAll}
          >
            Collapse All
          </Button>

        </Grid>
      </Grid>
    </>
  );
};

export default ReferralDashboard;