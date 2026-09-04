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
      {/* =================================================
          HEADING
      ================================================= */}

      <Typography
        fontWeight="bold"
        sx={{
          mb: {
            xs: 1,
            sm: 1.5,
          },

          fontSize: {
            xs: "16px",
            sm: "19px",
            md: "22px",
          },

          lineHeight: 1.25,
        }}
      >
        Referral Network
      </Typography>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <Grid
        container
        spacing={{
          xs: 0.75,
          sm: 1,
          md: 1.5,
        }}
        mb={{
          xs: 1.25,
          sm: 1.5,
        }}
        alignItems="stretch"
      >

        {/* TOTAL MEMBERS */}

        <Grid
          item
          xs={6}
          sm={6}
          md={4}
        >
          <Paper
            elevation={0}
            sx={{
              height: "100%",

              p: {
                xs: 1,
                sm: 1.25,
                md: 1.5,
              },

              borderRadius: 0,

              border:
                "1px solid #E0E0E0",

              boxShadow: "none",

              boxSizing: "border-box",

              transition:
                "border-color 0.2s ease",

              "&:hover": {
                borderColor:
                  "#1565C0",
              },
            }}
          >
            <People
              color="primary"
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 27,
                  md: 30,
                },

                mb: {
                  xs: 0.25,
                  sm: 0.5,
                },
              }}
            />

            <Typography
              sx={{
                color:
                  "text.secondary",

                fontSize: {
                  xs: "8px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,
              }}
            >
              Total Members
            </Typography>

            <Typography
              sx={{
                mt: 0.25,

                fontSize: {
                  xs: "19px",
                  sm: "22px",
                  md: "25px",
                },

                lineHeight: 1.1,

                fontWeight: 800,
              }}
            >
              {stats.totalMembers}
            </Typography>
          </Paper>
        </Grid>


        {/* MANAGERS */}

        <Grid
          item
          xs={6}
          sm={6}
          md={4}
        >
          <Paper
            elevation={0}
            sx={{
              height: "100%",

              p: {
                xs: 1,
                sm: 1.25,
                md: 1.5,
              },

              borderRadius: 0,

              border:
                "1px solid #E0E0E0",

              boxShadow: "none",

              boxSizing: "border-box",

              transition:
                "border-color 0.2s ease",

              "&:hover": {
                borderColor:
                  "#2E7D32",
              },
            }}
          >
            <Person
              color="success"
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 27,
                  md: 30,
                },

                mb: {
                  xs: 0.25,
                  sm: 0.5,
                },
              }}
            />

            <Typography
              sx={{
                color:
                  "text.secondary",

                fontSize: {
                  xs: "8px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,
              }}
            >
              Managers
            </Typography>

            <Typography
              sx={{
                mt: 0.25,

                fontSize: {
                  xs: "19px",
                  sm: "22px",
                  md: "25px",
                },

                lineHeight: 1.1,

                fontWeight: 800,
              }}
            >
              {stats.managers}
            </Typography>
          </Paper>
        </Grid>


        {/* REFERRAL LEVELS */}

        <Grid
          item
          xs={12}
          sm={12}
          md={4}
        >
          <Paper
            elevation={0}
            sx={{
              height: "100%",

              p: {
                xs: 1,
                sm: 1.25,
                md: 1.5,
              },

              borderRadius: 0,

              border:
                "1px solid #E0E0E0",

              boxShadow: "none",

              boxSizing: "border-box",

              transition:
                "border-color 0.2s ease",

              "&:hover": {
                borderColor:
                  "#F9A825",
              },
            }}
          >
            <AccountTree
              color="warning"
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 27,
                  md: 30,
                },

                mb: {
                  xs: 0.25,
                  sm: 0.5,
                },
              }}
            />

            <Typography
              sx={{
                color:
                  "text.secondary",

                fontSize: {
                  xs: "8px",
                  sm: "10px",
                  md: "11px",
                },

                lineHeight: 1.3,
              }}
            >
              Referral Levels
            </Typography>

            <Typography
              sx={{
                mt: 0.25,

                fontSize: {
                  xs: "19px",
                  sm: "22px",
                  md: "25px",
                },

                lineHeight: 1.1,

                fontWeight: 800,
              }}
            >
              {stats.levels}
            </Typography>
          </Paper>
        </Grid>

      </Grid>


      {/* =================================================
          SEARCH & BUTTONS
      ================================================= */}

      <Grid
        container
        spacing={{
          xs: 0.75,
          sm: 1,
        }}
        mb={{
          xs: 1.5,
          sm: 2,
        }}
        alignItems="center"
      >

        {/* SEARCH */}

        <Grid
          item
          xs={12}
          md={6}
        >
          <TextField
            fullWidth

            size="small"

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder="Search by Name / User ID"

            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,

                minHeight: {
                  xs: 36,
                  sm: 38,
                },
              },

              "& .MuiInputBase-input": {
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },

                py: {
                  xs: 0.75,
                  sm: 0.9,
                },
              },

              "& .MuiInputBase-input::placeholder": {
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                },
              },

              "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                fontSize: {
                  xs: 17,
                  sm: 19,
                },
              },
            }}

            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>


        {/* BUTTONS */}

        <Grid
          item
          xs={12}
          md={6}

          display="flex"

          flexDirection={{
            xs: "row",
            sm: "row",
          }}

          justifyContent={{
            xs: "stretch",
            md: "flex-end",
          }}

          alignItems="center"

          gap={{
            xs: 0.75,
            sm: 1,
          }}
        >

          <Button
            variant="contained"

            fullWidth

            sx={{
              maxWidth: {
                xs: "100%",
                sm: 150,
              },

              minHeight: {
                xs: 32,
                sm: 36,
              },

              borderRadius: 0,

              textTransform: "none",

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 700,

              boxShadow: "none",

              "&:hover": {
                boxShadow: "none",
              },
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
                sm: 150,
              },

              minHeight: {
                xs: 32,
                sm: 36,
              },

              borderRadius: 0,

              textTransform: "none",

              fontSize: {
                xs: "9px",
                sm: "10px",
              },

              fontWeight: 700,

              boxShadow: "none",
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