import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { useNavigate } from "react-router-dom";

import {
  getManagerPackagingTeams,
} from "../../services/manager.service";

/* =====================================================
   MANAGER PACKAGING TEAMS
===================================================== */

const ManagerPackagingTeams = () => {
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* =====================================================
     LOAD TEAMS
  ===================================================== */

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getManagerPackagingTeams();

      /*
       Support different backend response formats
      */

      const data =
        response?.data?.teams ||
        response?.data ||
        response?.teams ||
        [];

      setTeams(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load packaging teams:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load packaging teams"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const getTeamId = (team) => {
    return (
      team?._id ||
      team?.id ||
      team?.teamId ||
      team?.staffId
    );
  };

  const getTeamName = (team) => {
    return (
      team?.name ||
      team?.teamName ||
      team?.staffName ||
      "Packaging Team"
    );
  };

  const getLoginId = (team) => {
    return (
      team?.loginId ||
      "-"
    );
  };

  const getBranch = (team) => {
    return (
      team?.branchName ||
      team?.branch ||
      "-"
    );
  };

  const getBranchMemberNumber = (
    team
  ) => {
    return (
      team?.branchMemberNumber ||
      "-"
    );
  };

  const getCount = (
    team,
    key
  ) => {
    return Number(
      team?.[key] || 0
    );
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredTeams = useMemo(() => {
    const value =
      search
        .trim()
        .toLowerCase();

    if (!value) {
      return teams;
    }

    return teams.filter(
      (team) => {
        const searchableText = [
          getTeamName(team),
          getLoginId(team),
          getBranch(team),
          getBranchMemberNumber(team),
          getTeamId(team),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          value
        );
      }
    );
  }, [
    teams,
    search,
  ]);

  /* =====================================================
     TOTALS
  ===================================================== */

  const totals = useMemo(() => {
    return teams.reduce(
      (acc, team) => {
        acc.teams += 1;

        acc.assigned +=
          getCount(
            team,
            "assigned"
          );

        acc.packing +=
          getCount(
            team,
            "packing"
          );

        acc.packed +=
          getCount(
            team,
            "packed"
          );

        acc.readyForDispatch +=
          getCount(
            team,
            "readyForDispatch"
          );

        return acc;
      },
      {
        teams: 0,
        assigned: 0,
        packing: 0,
        packed: 0,
        readyForDispatch: 0,
      }
    );
  }, [teams]);

  /* =====================================================
     OPEN TEAM ORDERS
  ===================================================== */

  const openOrders = (
    team
  ) => {
    const teamId =
      getTeamId(team);

    if (!teamId) {
      return;
    }

    navigate(
      `/manager/packaging-teams/${teamId}/orders`
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",

        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },

        py: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
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
            md: "row",
          },

          justifyContent:
            "space-between",

          alignItems: {
            xs: "stretch",
            md: "center",
          },

          gap: {
            xs: 1.5,
            md: 2,
          },

          mb: {
            xs: 2,
            md: 3,
          },
        }}
      >

        {/* TITLE */}

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              fontSize: {
                xs: "1.25rem",
                sm: "1.5rem",
              },
            }}
          >
            Packaging Teams
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.4,
              fontSize: {
                xs: 12,
                sm: 14,
              },
            }}
          >
            View packaging teams
            and their assigned
            orders
          </Typography>
        </Box>

        {/* SEARCH */}

        <TextField
          size="small"
          fullWidth
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search packaging team..."
          sx={{
            width: {
              xs: "100%",
              sm: 280,
              md: 300,
            },

            "& .MuiInputBase-root":
              {
                borderRadius: 2,
                minHeight: 40,
              },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  fontSize="small"
                />
              </InputAdornment>
            ),
          }}
        />
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
          SUMMARY CARDS
      ================================================= */}

      <Grid
        container
        spacing={{
          xs: 1,
          sm: 1.5,
          md: 2,
        }}
        sx={{
          mb: {
            xs: 2,
            md: 3,
          },
        }}
      >

        <Grid
          item
          xs={6}
          sm={6}
          md={3}
        >
          <SummaryCard
            title="Teams"
            value={totals.teams}
            icon={
              <GroupsIcon />
            }
          />
        </Grid>

        <Grid
          item
          xs={6}
          sm={6}
          md={3}
        >
          <SummaryCard
            title="Assigned"
            value={totals.assigned}
            icon={
              <AssignmentIcon />
            }
          />
        </Grid>

        <Grid
          item
          xs={6}
          sm={6}
          md={3}
        >
          <SummaryCard
            title="Packing"
            value={totals.packing}
            icon={
              <InventoryIcon />
            }
          />
        </Grid>

        <Grid
          item
          xs={6}
          sm={6}
          md={3}
        >
          <SummaryCard
            title="Ready"
            value={
              totals.readyForDispatch
            }
            icon={
              <LocalShippingIcon />
            }
          />
        </Grid>

      </Grid>

      {/* =================================================
          DESKTOP TABLE
      ================================================= */}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",

          display: {
            xs: "none",
            md: "block",
          },
        }}
      >

        {/* TABLE HEADER */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns:
              "1.4fr 1fr 1.2fr 1.1fr .8fr .8fr .8fr .9fr .7fr",

            gap: 1,

            px: 2,
            py: 1.5,

            bgcolor: "grey.100",

            fontWeight: 700,
            fontSize: 13,
          }}
        >
          <Box>Team</Box>

          <Box>
            Login ID
          </Box>

          <Box>
            Branch
          </Box>

          <Box>
            Member No.
          </Box>

          <Box>
            Assigned
          </Box>

          <Box>
            Packing
          </Box>

          <Box>
            Packed
          </Box>

          <Box>
            Ready
          </Box>

          <Box>
            View
          </Box>
        </Box>

        {/* EMPTY */}

        {filteredTeams.length ===
        0 ? (
          <EmptyState />
        ) : (
          filteredTeams.map(
            (team) => (
              <DesktopTeamRow
                key={String(
                  getTeamId(team)
                )}
                team={team}
                getTeamName={
                  getTeamName
                }
                getLoginId={
                  getLoginId
                }
                getBranch={
                  getBranch
                }
                getBranchMemberNumber={
                  getBranchMemberNumber
                }
                getCount={
                  getCount
                }
                openOrders={
                  openOrders
                }
              />
            )
          )
        )}

      </Paper>

      {/* =================================================
          MOBILE TEAM CARDS
      ================================================= */}

      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },

          width: "100%",
        }}
      >

        {filteredTeams.length ===
        0 ? (
          <EmptyState />
        ) : (
          filteredTeams.map(
            (team) => (
              <MobileTeamCard
                key={String(
                  getTeamId(team)
                )}
                team={team}
                getTeamName={
                  getTeamName
                }
                getLoginId={
                  getLoginId
                }
                getBranch={
                  getBranch
                }
                getBranchMemberNumber={
                  getBranchMemberNumber
                }
                getCount={
                  getCount
                }
                openOrders={
                  openOrders
                }
              />
            )
          )
        )}

      </Box>

    </Box>
  );
};

/* =====================================================
   DESKTOP TEAM ROW
===================================================== */

const DesktopTeamRow = ({
  team,
  getTeamName,
  getLoginId,
  getBranch,
  getBranchMemberNumber,
  getCount,
  openOrders,
}) => {
  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns:
          "1.4fr 1fr 1.2fr 1.1fr .8fr .8fr .8fr .9fr .7fr",

        gap: 1,

        px: 2,
        py: 1.7,

        alignItems: "center",

        borderTop: "1px solid",
        borderColor: "divider",

        fontSize: 13,
      }}
    >

      {/* TEAM */}

      <Box
        sx={{
          minWidth: 0,
        }}
      >
        <Typography
          fontWeight={600}
          fontSize={14}
          noWrap
        >
          {getTeamName(team)}
        </Typography>

        <Chip
          size="small"
          label={
            team?.isActive
              ? "Active"
              : "Inactive"
          }
          color={
            team?.isActive
              ? "success"
              : "default"
          }
          sx={{
            mt: 0.5,
            height: 22,
          }}
        />
      </Box>

      {/* LOGIN */}

      <Box>
        {getLoginId(team)}
      </Box>

      {/* BRANCH */}

      <Box>
        {getBranch(team)}
      </Box>

      {/* MEMBER NUMBER */}

      <Box>
        {getBranchMemberNumber(
          team
        )}
      </Box>

      {/* ASSIGNED */}

      <Box>
        {getCount(
          team,
          "assigned"
        )}
      </Box>

      {/* PACKING */}

      <Box>
        {getCount(
          team,
          "packing"
        )}
      </Box>

      {/* PACKED */}

      <Box>
        {getCount(
          team,
          "packed"
        )}
      </Box>

      {/* READY */}

      <Box>
        {getCount(
          team,
          "readyForDispatch"
        )}
      </Box>

      {/* VIEW */}

      <Box>
        <Tooltip title="View Orders">
          <IconButton
            size="small"
            onClick={() =>
              openOrders(team)
            }
          >
            <VisibilityIcon
              fontSize="small"
            />
          </IconButton>
        </Tooltip>
      </Box>

    </Box>
  );
};

/* =====================================================
   MOBILE TEAM CARD
===================================================== */

const MobileTeamCard = ({
  team,
  getTeamName,
  getLoginId,
  getBranch,
  getBranchMemberNumber,
  getCount,
  openOrders,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        boxSizing: "border-box",

        p: {
          xs: 1.5,
          sm: 2,
        },

        mb: 1.5,

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 2,

        overflow: "hidden",
      }}
    >

      {/* ================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          alignItems:
            "flex-start",

          justifyContent:
            "space-between",

          gap: 1,

          minWidth: 0,
        }}
      >

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >

          <Typography
            fontSize={{
              xs: 15,
              sm: 16,
            }}
            fontWeight={700}
            sx={{
              overflow: "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace:
                "nowrap",
            }}
          >
            {getTeamName(team)}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.3,
              fontSize: 12,
              overflow: "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace:
                "nowrap",
            }}
          >
            Login ID:{" "}
            {getLoginId(team)}
          </Typography>

        </Box>

        <Chip
          size="small"
          label={
            team?.isActive
              ? "Active"
              : "Inactive"
          }
          color={
            team?.isActive
              ? "success"
              : "default"
          }
          sx={{
            height: 24,
            flexShrink: 0,
            fontSize: 11,
          }}
        />

      </Box>

      {/* ================================================
          BRANCH DETAILS
      ================================================= */}

      <Box
        sx={{
          mt: 1.5,

          p: 1.25,

          borderRadius: 1.5,

          bgcolor: "grey.50",
        }}
      >

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns:
              "minmax(0, 1fr) auto",

            gap: 1.5,

            alignItems: "center",
          }}
        >

          {/* BRANCH */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              fontSize={11}
              color="text.secondary"
            >
              Branch
            </Typography>

            <Typography
              fontSize={13}
              fontWeight={600}
              sx={{
                overflow: "hidden",
                textOverflow:
                  "ellipsis",
                whiteSpace:
                  "nowrap",
              }}
            >
              {getBranch(team)}
            </Typography>
          </Box>

          {/* MEMBER NUMBER */}

          <Box
            sx={{
              minWidth: 70,
              textAlign: "right",
            }}
          >
            <Typography
              fontSize={11}
              color="text.secondary"
            >
              Member No.
            </Typography>

            <Typography
              fontSize={13}
              fontWeight={600}
            >
              {getBranchMemberNumber(
                team
              )}
            </Typography>
          </Box>

        </Box>

      </Box>

      {/* ================================================
          COUNTS
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",

          gap: 1,

          mt: 1.5,
        }}
      >

        <MiniCount
          label="Assigned"
          value={getCount(
            team,
            "assigned"
          )}
        />

        <MiniCount
          label="Packing"
          value={getCount(
            team,
            "packing"
          )}
        />

        <MiniCount
          label="Packed"
          value={getCount(
            team,
            "packed"
          )}
        />

        <MiniCount
          label="Ready"
          value={getCount(
            team,
            "readyForDispatch"
          )}
        />

      </Box>

      {/* ================================================
          VIEW ORDERS
      ================================================= */}

      <Box
        component="button"
        type="button"
        onClick={() =>
          openOrders(team)
        }
        sx={{
          width: "100%",

          minHeight: 42,

          mt: 1.5,

          px: 2,

          border: "1px solid",
          borderColor: "divider",

          borderRadius: 1.5,

          bgcolor: "transparent",

          color: "text.primary",

          fontSize: 13,

          fontWeight: 600,

          cursor: "pointer",

          transition:
            "background-color 0.2s, transform 0.1s",

          "&:hover": {
            bgcolor: "grey.100",
          },

          "&:active": {
            transform:
              "scale(0.98)",
          },
        }}
      >
        View Orders
      </Box>

    </Paper>
  );
};

/* =====================================================
   SUMMARY CARD
===================================================== */

const SummaryCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",

        boxSizing: "border-box",

        p: {
          xs: 1.25,
          sm: 1.75,
          md: 2,
        },

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 2,
      }}
    >

      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          gap: {
            xs: 1,
            sm: 1.5,
          },
        }}
      >

        <Box
          sx={{
            width: {
              xs: 34,
              sm: 40,
            },

            height: {
              xs: 34,
              sm: 40,
            },

            flexShrink: 0,

            borderRadius: 1.5,

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            bgcolor: "grey.100",

            "& svg": {
              fontSize: {
                xs: 18,
                sm: 22,
              },
            },
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
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: {
                xs: 10,
                sm: 12,
              },

              whiteSpace:
                "nowrap",

              overflow: "hidden",

              textOverflow:
                "ellipsis",
            }}
          >
            {title}
          </Typography>

          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: 18,
                sm: 22,
              },

              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>

        </Box>

      </Box>

    </Paper>
  );
};

/* =====================================================
   MINI COUNT
===================================================== */

const MiniCount = ({
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,

        p: {
          xs: 1,
          sm: 1.2,
        },

        borderRadius: 1.5,

        bgcolor: "grey.100",
      }}
    >

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",

          fontSize: {
            xs: 10,
            sm: 11,
          },

          overflow: "hidden",

          textOverflow:
            "ellipsis",

          whiteSpace:
            "nowrap",
        }}
      >
        {label}
      </Typography>

      <Typography
        fontWeight={700}
        sx={{
          fontSize: {
            xs: 16,
            sm: 18,
          },
        }}
      >
        {value}
      </Typography>

    </Box>
  );
};

/* =====================================================
   EMPTY STATE
===================================================== */

const EmptyState = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 3,
          sm: 4,
        },

        textAlign: "center",

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 2,
      }}
    >
      <Typography
        color="text.secondary"
        fontSize={14}
      >
        No packaging teams found
      </Typography>
    </Paper>
  );
};

export default ManagerPackagingTeams;