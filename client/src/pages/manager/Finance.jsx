import { useCallback, useEffect, useState } from "react";
import API from "../../api";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWallet,
  AddCard,
  DeleteForever,
  Edit,
  ReceiptLong,
  Refresh,
  TrendingUp,
} from "@mui/icons-material";

const categories = [
  "Packaging",
  "Shipping",
  "Inventory",
  "Marketing",
  "Rent",
  "Salaries",
  "Software",
  "Utilities",
  "Travel",
  "Maintenance",
  "Other",
];

const paymentMethods = ["Cash", "Bank", "UPI", "Card", "Other"];

const today = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const dateInputValue = (value) => {
  if (!value) return today();

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return today();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

const emptyForm = () => ({
  amount: "",
  category: "Packaging",
  expenseDate: today(),
  paymentMethod: "UPI",
  description: "",
  receiptReference: "",
});

const Finance = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [ledger, setLedger] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingExpense, setEditingExpense] = useState(null);

  const [editReason, setEditReason] = useState("");
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // --------------------------------------------------
  // LOAD FINANCE DATA
  // --------------------------------------------------

  const loadFinance = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (from) params.from = from;
      if (to) params.to = to;

      const [
        summaryResponse,
        expensesResponse,
        ledgerResponse,
      ] = await Promise.all([
        API.get("/manager/finance/summary", { params }),

        API.get("/manager/finance/expenses", {
          params: {
            ...params,
            page: 1,
            limit: 100,
          },
        }),

        API.get("/manager/finance/ledger", {
          params: {
            ...params,
            page: 1,
            limit: 100,
          },
        }),
      ]);

      setSummary(summaryResponse.data?.data || null);
      setExpenses(expensesResponse.data?.data || []);
      setLedger(ledgerResponse.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load finance data. Check your Manager login and backend."
      );
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  // --------------------------------------------------
  // FORM HANDLING
  // --------------------------------------------------

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // OPEN EDIT DIALOG
  // --------------------------------------------------

  const openEditDialog = (expense) => {
    setError("");
    setNotice("");
    setEditingExpense(expense);
    setEditReason("");

    setForm({
      amount: String(expense.amount ?? ""),
      category: expense.category || "Other",
      expenseDate: dateInputValue(expense.expenseDate),
      paymentMethod: expense.paymentMethod || "Other",
      description: expense.description || "",
      receiptReference: expense.receiptReference || "",
    });
  };

  const closeEditDialog = () => {
    if (saving) return;

    setEditingExpense(null);
    setEditReason("");
    setForm(emptyForm());
  };

  // --------------------------------------------------
  // OPEN DELETE DIALOG
  // --------------------------------------------------

  const openDeleteDialog = (expense) => {
    setError("");
    setNotice("");

    setDeletingExpense(expense);
    setDeleteReason("");
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeletingExpense(null);
    setDeleteReason("");
  };

  // --------------------------------------------------
  // CREATE OR UPDATE EXPENSE
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.amount ||
      !Number.isFinite(Number(form.amount)) ||
      Number(form.amount) <= 0
    ) {
      setError("Enter an expense amount greater than zero.");
      return;
    }

    if (!form.expenseDate) {
      setError("Select an expense date.");
      return;
    }

    if (editingExpense && !editReason.trim()) {
      setError("A reason for editing the expense is required.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingExpense) {
        payload.reason = editReason.trim();

        await API.put(
          `/manager/finance/expenses/${editingExpense._id}`,
          payload
        );

        setNotice("Expense updated successfully.");
        setEditingExpense(null);
        setEditReason("");
        setForm(emptyForm());
      } else {
        await API.post(
          "/manager/finance/expenses",
          payload
        );

        setNotice("Expense recorded successfully.");
        setForm(emptyForm());
      }

      await loadFinance();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingExpense
            ? "Unable to update expense."
            : "Unable to record the expense.")
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // SOFT DELETE EXPENSE
  // --------------------------------------------------

  const handleDeleteExpense = async () => {
    const reason = deleteReason.trim();

    if (!deletingExpense) return;

    if (!reason) {
      setError("A deletion reason is required.");
      return;
    }

    setDeleting(true);
    setError("");
    setNotice("");

    try {
      await API.delete(
        `/manager/finance/expenses/${deletingExpense._id}`,
        {
          data: { reason },
        }
      );

      setDeletingExpense(null);
      setDeleteReason("");

      setNotice(
        "Expense deleted and audit history recorded."
      );

      await loadFinance();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the expense."
      );
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------------------------
  // SUMMARY CARDS
  // --------------------------------------------------

  const cards = [
    {
      title: "Website Income",
      value: currency(summary?.totalWebsiteIncome),
      subtitle: `${
        summary?.totalProductOrders || 0
      } paid product orders`,
      icon: <TrendingUp />,
      color: "#15803D",
    },
    {
      title: "Recorded Expenses",
      value: currency(summary?.totalExpenses),
      subtitle: `${
        summary?.totalExpenseEntries || 0
      } expense entries`,
      icon: <ReceiptLong />,
      color: "#D97706",
    },
    {
      title: "Provisional Net Result",
      value: currency(summary?.netResult),
      subtitle: "Income minus expenses and withdrawals",
      icon: <AccountBalanceWallet />,
      color: "#2563EB",
    },
  ];

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2.5 },
        minWidth: 0,
      }}
    >
      {/* HEADER */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            color="#172033"
          >
            Finance Management
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Track website income, business expenses and
            financial records.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadFinance}
          disabled={loading}
        >
          Refresh
        </Button>
      </Stack>

      {/* NOTIFICATIONS */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {notice && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setNotice("")}
        >
          {notice}
        </Alert>
      )}

      {summary?.note && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {summary.note}
        </Alert>
      )}

      {/* DATE FILTERS */}

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Typography fontWeight={700} sx={{ mb: 2 }}>
          Filter by date
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
        >
          <TextField
            label="From date"
            type="date"
            size="small"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            fullWidth
          />

          <TextField
            label="To date"
            type="date"
            size="small"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            fullWidth
          />

          <Button
            variant="text"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            Clear
          </Button>
        </Stack>
      </Paper>

      {loading && !summary ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* SUMMARY CARDS */}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                key={card.title}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: 2,
                          bgcolor: `${card.color}15`,
                          color: card.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {card.icon}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {card.title}
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {card.value}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {card.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ADD EXPENSE FORM */}

          <Paper
            component="form"
            onSubmit={handleSubmit}
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <AddCard color="primary" />

              <Typography variant="h6" fontWeight={800}>
                Record Business Expense
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Amount (₹)"
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleFormChange}
                  inputProps={{
                    min: 0.01,
                    step: 0.01,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  required
                  label="Expense date"
                  name="expenseDate"
                  type="date"
                  value={form.expenseDate}
                  onChange={handleFormChange}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Payment method"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleFormChange}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Receipt reference"
                  name="receiptReference"
                  value={form.receiptReference}
                  onChange={handleFormChange}
                  inputProps={{ maxLength: 150 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  inputProps={{ maxLength: 1000 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={
                    saving ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <AddCard />
                    )
                  }
                >
                  {saving ? "Saving..." : "Record Expense"}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* EXPENSE HISTORY */}

          <Paper
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={800}>
                Expense History
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Edit or soft-delete recorded expenses. Every
                change requires a reason for audit review.
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">
                      Amount
                    </TableCell>
                    <TableCell align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {expenses.length ? (
                    expenses.map((expense) => (
                      <TableRow key={expense._id}>
                        <TableCell>
                          {new Date(
                            expense.expenseDate
                          ).toLocaleDateString("en-IN")}
                        </TableCell>

                        <TableCell>
                          {expense.category}
                        </TableCell>

                        <TableCell>
                          {expense.description || "—"}

                          {expense.receiptReference && (
                            <Typography
                              variant="caption"
                              display="block"
                              color="text.secondary"
                            >
                              Ref: {expense.receiptReference}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {expense.paymentMethod}
                        </TableCell>

                        <TableCell align="right">
                          {currency(expense.amount)}
                        </TableCell>

                        <TableCell align="center">
                          {expense.status === "VOID" ? (
                            <Chip
                              size="small"
                              label="Deleted"
                              color="default"
                            />
                          ) : (
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Edit />}
                                onClick={() =>
                                  openEditDialog(expense)
                                }
                              >
                                Edit
                              </Button>

                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteForever />}
                                onClick={() =>
                                  openDeleteDialog(expense)
                                }
                              >
                                Delete
                              </Button>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                      >
                        No expenses found for this period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* PROFIT AND LOSS LEDGER */}

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={800}>
                Profit & Loss Ledger
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Verified product payments and recorded business
                expenses.
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Particulars</TableCell>
                    <TableCell align="right">
                      Income
                    </TableCell>
                    <TableCell align="right">
                      Expense
                    </TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ledger.length ? (
                    ledger.map((entry, index) => (
                      <TableRow
                        key={`${entry.reference}-${index}`}
                      >
                        <TableCell>
                          {new Date(
                            entry.date
                          ).toLocaleDateString("en-IN")}
                        </TableCell>

                        <TableCell>
                          {entry.reference}
                        </TableCell>

                        <TableCell>
                          {entry.particulars}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{ color: "#15803D" }}
                        >
                          {entry.income
                            ? currency(entry.income)
                            : "—"}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{ color: "#B45309" }}
                        >
                          {entry.expense
                            ? currency(entry.expense)
                            : "—"}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={entry.status}
                            color={
                              ["PAID", "RECORDED"].includes(
                                entry.status
                              )
                                ? "success"
                                : "default"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        align="center"
                      >
                        No ledger entries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* EDIT EXPENSE DIALOG */}

      <Dialog
        open={Boolean(editingExpense)}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Business Expense</DialogTitle>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                fullWidth
                required
                label="Amount (₹)"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleFormChange}
                inputProps={{
                  min: 0.01,
                  step: 0.01,
                }}
              />

              <TextField
                fullWidth
                select
                required
                label="Category"
                name="category"
                value={form.category}
                onChange={handleFormChange}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                required
                label="Expense date"
                name="expenseDate"
                type="date"
                value={form.expenseDate}
                onChange={handleFormChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <TextField
                fullWidth
                select
                required
                label="Payment method"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleFormChange}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                inputProps={{ maxLength: 1000 }}
              />

              <TextField
                fullWidth
                label="Receipt reference"
                name="receiptReference"
                value={form.receiptReference}
                onChange={handleFormChange}
                inputProps={{ maxLength: 150 }}
              />

              <TextField
                fullWidth
                required
                label="Reason for editing"
                value={editReason}
                onChange={(event) =>
                  setEditReason(event.target.value)
                }
                multiline
                minRows={2}
                inputProps={{ maxLength: 1000 }}
                helperText="This reason will be saved in the audit history."
              />

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={closeEditDialog}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving || !editReason.trim()}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}

      <Dialog
        open={Boolean(deletingExpense)}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Delete Business Expense
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="warning">
              This expense will be marked as VOID, not
              permanently removed. The deletion will be
              recorded for Super Admin review.
            </Alert>

            {deletingExpense && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Expense
                </Typography>

                <Typography fontWeight={700}>
                  {deletingExpense.category} ·{" "}
                  {currency(deletingExpense.amount)}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {deletingExpense.description ||
                    deletingExpense.receiptReference ||
                    "No description"}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              required
              label="Reason for deletion"
              value={deleteReason}
              onChange={(event) =>
                setDeleteReason(event.target.value)
              }
              multiline
              minRows={2}
              inputProps={{ maxLength: 1000 }}
              helperText="Required. This reason will be saved in the audit history."
            />

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteExpense}
            disabled={deleting || !deleteReason.trim()}
            startIcon={
              deleting ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <DeleteForever />
              )
            }
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Finance;