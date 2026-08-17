import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getDashboard } from "../../services/dashboard.service";

import SummaryCard from "../../components/members/sellingPoints/SummaryCard";
import ProgressCard from "../../components/members/sellingPoints/ProgressCard";
import HistoryTable from "../../components/members/sellingPoints/HistoryTable";

const SellingPoints = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const dashboard = await getDashboard();

      console.log(
        "SELLING POINTS DASHBOARD:",
        dashboard
      );

      // =================================================
      // GET API DATA
      // =================================================

      const apiSummary =
        dashboard?.summary || {};

      const apiSellingPoints =
        dashboard?.sellingPoints || {};

      // =================================================
      // SELLING POINTS
      // =================================================

      const sellingPoints = Number(
        apiSummary?.sellingPoints ??
          apiSellingPoints?.sellingPoints ??
          0
      );

      // =================================================
      // LIFETIME PURCHASE
      // =================================================

      const lifetimePurchase = Number(
        apiSummary?.lifetimePurchase ??
          apiSellingPoints?.lifetimePurchase ??
          0
      );

      // =================================================
      // SUPERVISOR
      // =================================================

      const isSupervisor =
        apiSellingPoints?.isSupervisor ??
        apiSummary?.isSupervisor ??
        false;

      // =================================================
      // TARGET
      // =================================================

      const supervisorTarget = 500;

      // =================================================
      // REMAINING
      // =================================================

      const remainingTarget = Math.max(
        supervisorTarget - sellingPoints,
        0
      );

      // =================================================
      // TRANSACTIONS
      // =================================================

      const transactions = Array.isArray(
        apiSellingPoints?.transactions
      )
        ? apiSellingPoints.transactions
        : [];

      // =================================================
      // NORMALIZED DATA
      // =================================================

      const normalizedData = {
        summary: {
          sellingPoints,
          lifetimePurchase,
          isSupervisor,
          supervisorTarget,
          remainingTarget,
        },

        sellingPoints: {
          ...apiSellingPoints,

          sellingPoints,
          lifetimePurchase,
          isSupervisor,

          transactions,
        },
      };

      console.log(
        "NORMALIZED SELLING POINT DATA:",
        normalizedData
      );

      setData(normalizedData);
    } catch (error) {
      console.error(
        "SELLING POINTS ERROR:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load Selling Points."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Box
        sx={{
          p: 3,
          minHeight: "70vh",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          Selling Points
        </Typography>

        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // =====================================================
  // SAFETY
  // =====================================================

  if (!data) {
    return (
      <Box
        sx={{
          p: 3,
        }}
      >
        <Alert severity="warning">
          Selling Point data is not available.
        </Alert>
      </Box>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        bgcolor: "#F5F7FA",

        minHeight: "100vh",

        width: "100%",
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          fontSize: {
            xs: "1.8rem",
            sm: "2.1rem",
            md: "2.4rem",
          },
        }}
      >
        Selling Points
      </Typography>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <SummaryCard
        summary={data.summary}
      />

      {/* =================================================
          SUPERVISOR PROGRESS
      ================================================= */}

      <ProgressCard
        summary={data.summary}
      />

      {/* =================================================
          HISTORY
      ================================================= */}

      <HistoryTable
        history={
          data.sellingPoints?.transactions || []
        }
      />
    </Box>
  );
};

export default SellingPoints;