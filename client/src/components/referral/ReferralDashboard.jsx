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
      {/* Heading */}

      <Typography
        fontWeight="bold"
        sx={{
          mb: 3,
          fontSize: {
            xs: 28,
            sm: 34,
            md: 40,
          },
        }}
      >
        Referral Network
      </Typography>

      {/* Statistics */}

      <Grid
        container
        spacing={2}
        mb={3}
        alignItems="stretch"
      >
        {/* Total Members */}

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 8px 20px rgba(0,0,0,.08)",
              transition: ".3s",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow:
                  "0 15px 30px rgba(0,0,0,.12)",
              },
            }}
          >
            <People
              color="primary"
              sx={{
                fontSize: 42,
                mb: 1,
              }}
            />

            <Typography
              color="text.secondary"
            >
              Total Members
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {stats.totalMembers}
            </Typography>
          </Paper>
        </Grid>

        {/* Managers */}

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 8px 20px rgba(0,0,0,.08)",
              transition: ".3s",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow:
                  "0 15px 30px rgba(0,0,0,.12)",
              },
            }}
          >
            <Person
              color="success"
              sx={{
                fontSize: 42,
                mb: 1,
              }}
            />

            <Typography
              color="text.secondary"
            >
              Managers
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {stats.managers}
            </Typography>
          </Paper>
        </Grid>

        {/* Referral Levels */}

        <Grid
          item
          xs={12}
          sm={12}
          md={4}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 8px 20px rgba(0,0,0,.08)",
              transition: ".3s",

              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow:
                  "0 15px 30px rgba(0,0,0,.12)",
              },
            }}
          >
            <AccountTree
              color="warning"
              sx={{
                fontSize: 42,
                mb: 1,
              }}
            />

            <Typography
              color="text.secondary"
            >
              Referral Levels
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {stats.levels}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Search & Buttons */}

      <Grid
        container
        spacing={2}
        mb={4}
        alignItems="center"
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <TextField
            fullWidth
            size="medium"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by Name / User ID"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
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
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
          justifyContent={{
            xs: "center",
            md: "flex-end",
          }}
          alignItems="center"
          gap={2}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 180,
              },
              borderRadius: 3,
            }}
            onClick={expandAll}
          >
            Expand All
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              maxWidth: {
                xs: "100%",
                sm: 180,
              },
              borderRadius: 3,
            }}
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