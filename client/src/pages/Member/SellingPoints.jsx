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
  // LOAD SELLING POINT DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const dashboard = await getDashboard();

      console.log("SELLING POINTS DASHBOARD:", dashboard);

      // =================================================
      // API DATA
      // =================================================

      const apiSummary = dashboard?.summary || {};

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
      // SUPERVISOR STATUS
      // =================================================

      const isSupervisor =
        apiSellingPoints?.isSupervisor ??
        apiSummary?.isSupervisor ??
        false;

      // =================================================
      // SUPERVISOR TARGET
      // =================================================

      const supervisorTarget = 500;

      // =================================================
      // REMAINING TARGET
      // =================================================

      const remainingTarget = Math.max(
        supervisorTarget - sellingPoints,
        0
      );

      // =================================================
      // SELLING POINT TRANSACTIONS
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
    } catch (err) {
      console.error(
        "SELLING POINTS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
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
          width: "100%",
          minHeight: "70vh",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          bgcolor: "#F5F7FA",

          boxSizing: "border-box",
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
          width: "100%",
          maxWidth: "100%",

          minHeight: "70vh",

          boxSizing: "border-box",

          bgcolor: "#F5F7FA",

          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          overflowX: "hidden",
        }}
      >
        <Typography
          fontWeight={700}
          mb={{
            xs: 2,
            sm: 2.5,
            md: 3,
          }}
          sx={{
            fontSize: {
              xs: "1.45rem",
              sm: "1.8rem",
              md: "2.4rem",
            },
          }}
        >
          Selling Points
        </Typography>

        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // =====================================================
  // SAFETY CHECK
  // =====================================================

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",

          boxSizing: "border-box",

          bgcolor: "#F5F7FA",

          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          minHeight: "70vh",

          overflowX: "hidden",
        }}
      >
        <Alert
          severity="warning"
          sx={{
            borderRadius: 3,
          }}
        >
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
        width: "100%",
        maxWidth: "100%",

        minHeight: "100vh",

        boxSizing: "border-box",

        bgcolor: "#F5F7FA",

        p: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        overflowX: "hidden",
      }}
    >
      {/* =================================================
          TITLE
      ================================================= */}

      <Typography
        component="h1"
        fontWeight={700}
        sx={{
          mb: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          fontSize: {
            xs: "1.45rem",
            sm: "1.8rem",
            md: "2.4rem",
          },

          lineHeight: 1.25,

          color: "#292929",
        }}
      >
        Selling Points
      </Typography>

      {/* =================================================
          SUMMARY CARDS
          
          Mobile:
          1 card per row

          Tablet:
          2 cards per row

          Desktop:
          4 cards per row
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <SummaryCard
          summary={data.summary}
        />
      </Box>

      {/* =================================================
          SUPERVISOR PROGRESS
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",

          mt: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
        }}
      >
        <ProgressCard
          summary={data.summary}
        />
      </Box>

      {/* =================================================
          SELLING POINT HISTORY
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",

          mt: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          overflowX: "hidden",
        }}
      >
        <HistoryTable
          history={
            data.sellingPoints?.transactions || []
          }
        />
      </Box>
    </Box>
  );
};

export default SellingPoints;