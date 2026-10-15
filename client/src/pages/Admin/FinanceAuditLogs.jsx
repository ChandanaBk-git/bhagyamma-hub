import { Fragment, useCallback, useEffect, useState } from "react";
import API from "../../api";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  ExpandLess,
  ExpandMore,
  Refresh,
  Shield,
} from "@mui/icons-material";

const ACTIONS = ["CREATED", "EDITED", "DELETED"];

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const getActorName = (actor) => {
  if (!actor) return "Unknown user";
  if (typeof actor === "string") return actor;

  return (
    actor.name ||
    actor.email ||
    actor.userId ||
    "Unknown user"
  );
};

const actionColor = (action) => {
  if (action === "CREATED") return "success";
  if (action === "EDITED") return "info";
  if (action === "DELETED") return "error";
  return "default";
};

const AuditDetails = ({ value }) => {
  if (!value || typeof value !== "object") {
    return (
      <Typography variant="body2" color="text.secondary">
        No previous or updated values.
      </Typography>
    );
  }

  const entries = Object.entries(value);

  if (!entries.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No details available.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        overflowX: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Table size="small" sx={{ minWidth: 220 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>Field</TableCell>
            <TableCell sx={{ fontWeight: 800 }}>Value</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {entries.map(([key, fieldValue]) => {
            let displayValue = fieldValue;

            if (
              fieldValue === null ||
              fieldValue === undefined ||
              fieldValue === ""
            ) {
              displayValue = "—";
            } else if (key === "amount") {
              displayValue = currency(fieldValue);
            } else if (
              key.toLowerCase().includes("date") ||
              key === "voidedAt"
            ) {
              displayValue = formatDate(fieldValue);
            } else if (typeof fieldValue === "object") {
              displayValue = JSON.stringify(fieldValue);
            }

            return (
              <TableRow key={key}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    width: "40%",
                    overflowWrap: "anywhere",
                  }}
                >
                  {key}
                </TableCell>

                <TableCell
                  sx={{
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {String(displayValue)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

const FinanceAuditLogs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [logs, setLogs] = useState([]);

  const [pagination, setPagination] = useState({
    page: 0,
    limit: 20,
    total: 0,
  });

  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [expanded, setExpanded] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: pagination.page + 1,
        limit: pagination.limit,
      };

      if (action) params.action = action;
      if (from) params.from = from;
      if (to) params.to = to;

      const response = await API.get(
        "/admin/finance/audit-logs",
        { params }
      );

      setLogs(response.data?.data || []);

      setPagination((previous) => ({
        ...previous,
        total: Number(response.data?.pagination?.total || 0),
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load finance audit logs. Check the Super Admin login and backend route."
      );
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    action,
    from,
    to,
  ]);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const resetFilters = () => {
    setAction("");
    setFrom("");
    setTo("");
    setExpanded({});

    setPagination((previous) => ({
      ...previous,
      page: 0,
    }));
  };

  const toggleDetails = (id) => {
    setExpanded((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  const renderDetails = (log) => {
    const id = log._id;

    return (
      <Collapse in={Boolean(expanded[id])} unmountOnExit>
        <Box
          sx={{
            p: { xs: 1.25, sm: 2.5 },
            bgcolor: "grey.50",
            minWidth: 0,
          }}
        >
          <Typography fontWeight={800} sx={{ mb: 1.5 }}>
            Expense Change Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Before
              </Typography>
              <AuditDetails value={log.before} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                After
              </Typography>
              <AuditDetails value={log.after} />
            </Grid>
          </Grid>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 1.5,
              overflowWrap: "anywhere",
            }}
          >
            Audit ID: {id}
            {log.ipAddress ? ` · IP: ${log.ipAddress}` : ""}
          </Typography>
        </Box>
      </Collapse>
    );
  };

  const renderMobileCards = () => {
    if (!logs.length) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ py: 4 }}
        >
          No audit records found.
        </Typography>
      );
    }

    return logs.map((log) => {
      const id = log._id;

      const expenseNumber =
        log.expenseNumber ||
        log.expense?.expenseNumber ||
        (log.expense?._id
          ? String(log.expense._id).slice(-8)
          : typeof log.expense === "string"
            ? log.expense.slice(-8)
            : "") ||
        "Expense";

      return (
        <Card
          key={id}
          variant="outlined"
          sx={{
            mb: 1.5,
            width: "100%",
            minWidth: 0,
            borderRadius: 2,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              p: 1.5,
              "&:last-child": { pb: 1.5 },
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={1}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  fontWeight={800}
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {expenseNumber}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {formatDate(log.createdAt)}
                </Typography>

                {log.expense?.category && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    {log.expense.category}
                  </Typography>
                )}
              </Box>

              <Chip
                size="small"
                label={log.action || "UNKNOWN"}
                color={actionColor(log.action)}
                sx={{ flexShrink: 0 }}
              />
            </Stack>

            <Divider sx={{ my: 1.25 }} />

            <Typography
              variant="body2"
              sx={{ overflowWrap: "anywhere" }}
            >
              <strong>Performed by:</strong>{" "}
              {getActorName(log.performedBy)}
            </Typography>

            {log.performedBy?.email && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.25,
                  overflowWrap: "anywhere",
                }}
              >
                {log.performedBy.email}
              </Typography>
            )}

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.25 }}
            >
              Role: {log.performedByRole || "MANAGER"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              <strong>Reason:</strong> {log.reason || "—"}
            </Typography>

            <Button
              fullWidth
              size="small"
              variant="outlined"
              sx={{ mt: 1.5, minHeight: 40 }}
              startIcon={
                expanded[id] ? <ExpandLess /> : <ExpandMore />
              }
              onClick={() => toggleDetails(id)}
            >
              {expanded[id] ? "Hide Details" : "View Details"}
            </Button>

            {renderDetails(log)}
          </CardContent>
        </Card>
      );
    });
  };

  const renderDesktopTable = () => (
    <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Expense</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Performed by</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell align="center">Details</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.length ? (
            logs.map((log) => {
              const id = log._id;

              const expenseNumber =
                log.expenseNumber ||
                log.expense?.expenseNumber ||
                (log.expense?._id
                  ? String(log.expense._id).slice(-8)
                  : typeof log.expense === "string"
                    ? log.expense.slice(-8)
                    : "") ||
                "—";

              return (
                <Fragment key={id}>
                  <TableRow hover>
                    <TableCell sx={{ minWidth: 160 }}>
                      {formatDate(log.createdAt)}
                    </TableCell>

                    <TableCell
                      sx={{
                        minWidth: 130,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {expenseNumber}

                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {log.expense?.category || ""}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={log.action || "UNKNOWN"}
                        color={actionColor(log.action)}
                      />
                    </TableCell>

                    <TableCell sx={{ minWidth: 160 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {getActorName(log.performedBy)}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        {log.performedBy?.email || ""}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {log.performedByRole || "MANAGER"}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        minWidth: 180,
                        maxWidth: 280,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {log.reason || "—"}
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        size="small"
                        onClick={() => toggleDetails(id)}
                        endIcon={
                          expanded[id] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )
                        }
                      >
                        {expanded[id] ? "Hide" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{
                        p: 0,
                        borderBottom: expanded[id] ? undefined : 0,
                      }}
                    >
                      {renderDetails(log)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                No audit records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflowX: "clip",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2.5, minWidth: 0 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ minWidth: 0 }}
          >
            <Shield color="primary" />

            <Typography
              variant="h5"
              fontWeight={800}
              color="#172033"
              sx={{
                fontSize: { xs: "1.15rem", sm: "1.5rem" },
                overflowWrap: "anywhere",
              }}
            >
              Finance Audit Logs
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75 }}
          >
            Review expense activity and recorded changes.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadAuditLogs}
          disabled={loading}
          fullWidth={isMobile}
          sx={{ flexShrink: 0, minHeight: 40 }}
        >
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, overflowWrap: "anywhere" }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.25, sm: 2 },
          mb: 2,
          borderRadius: 2,
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <Typography fontWeight={800} sx={{ mb: 1.5 }}>
          Filter audit history
        </Typography>

        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Action"
              value={action}
              onChange={(event) => {
                setAction(event.target.value);
                setPagination((previous) => ({
                  ...previous,
                  page: 0,
                }));
              }}
            >
              <MenuItem value="">All actions</MenuItem>

              {ACTIONS.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="From date"
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                setPagination((previous) => ({
                  ...previous,
                  page: 0,
                }));
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="To date"
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                setPagination((previous) => ({
                  ...previous,
                  page: 0,
                }));
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={resetFilters}
              sx={{ height: 40 }}
            >
              Clear filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
          minWidth: 0,
        }}
      >
        <Box sx={{ p: { xs: 1.25, sm: 2 } }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Activity History
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {pagination.total} audit records
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : isMobile ? (
          <Box sx={{ px: 1, pb: 0.5, minWidth: 0 }}>
            {renderMobileCards()}
          </Box>
        ) : (
          renderDesktopTable()
        )}

        <Divider />

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          rowsPerPage={pagination.limit}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={(_, page) => {
            setPagination((previous) => ({
              ...previous,
              page,
            }));
          }}
          onRowsPerPageChange={(event) => {
            setPagination({
              page: 0,
              limit: Number(event.target.value),
              total: pagination.total,
            });
          }}
          sx={{
            width: "100%",
            minWidth: 0,
            overflow: "hidden",
            ".MuiTablePagination-toolbar": {
              px: { xs: 1, sm: 2 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
              justifyContent: { xs: "center", sm: "flex-end" },
              rowGap: 1,
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              },
          }}
        />
      </Paper>
    </Box>
  );
};

export default FinanceAuditLogs;