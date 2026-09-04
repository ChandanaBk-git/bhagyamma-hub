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

  /* =====================================================
     LOAD SELLING POINT DATA
  ===================================================== */

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

      /* =================================================
         API DATA
      ================================================= */

      const apiSummary =
        dashboard?.summary || {};

      const apiSellingPoints =
        dashboard?.sellingPoints || {};

      /* =================================================
         SELLING POINTS
      ================================================= */

      const sellingPoints = Number(
        apiSummary?.sellingPoints ??
          apiSellingPoints?.sellingPoints ??
          0
      );

      /* =================================================
         LIFETIME PURCHASE
      ================================================= */

      const lifetimePurchase = Number(
        apiSummary?.lifetimePurchase ??
          apiSellingPoints?.lifetimePurchase ??
          0
      );

      /* =================================================
         SUPERVISOR STATUS
      ================================================= */

      const isSupervisor =
        apiSellingPoints?.isSupervisor ??
        apiSummary?.isSupervisor ??
        false;

      /* =================================================
         SUPERVISOR TARGET
      ================================================= */

      const supervisorTarget = 500;

      /* =================================================
         REMAINING TARGET
      ================================================= */

      const remainingTarget = Math.max(
        supervisorTarget - sellingPoints,
        0
      );

      /* =================================================
         SELLING POINT TRANSACTIONS
      ================================================= */

      const transactions =
        Array.isArray(
          apiSellingPoints?.transactions
        )
          ? apiSellingPoints.transactions
          : [];

      /* =================================================
         NORMALIZED DATA
      ================================================= */

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

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "45vh",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          m: 0,
          p: 0,

          boxSizing: "border-box",

          backgroundColor: "#F5F7FA",
        }}
      >
        <CircularProgress
          color="success"
          size={24}
          thickness={4}
        />
      </Box>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minHeight: "65vh",

          m: 0,

          p: {
            xs: "10px 8px 20px",
            sm: "12px 14px 24px",
            md: "16px 8px 24px",
          },

          boxSizing: "border-box",

          backgroundColor: "#F5F7FA",

          overflowX: "hidden",

          borderRadius: 0,
        }}
      >
        {/* TITLE */}

        <Typography
          component="h1"
          sx={{
            m: 0,
            p: 0,

            mb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            fontSize: {
              xs: "18px",
              sm: "22px",
              md: "26px",
            },

            lineHeight: 1.25,

            fontWeight: 700,

            color: "#292929",
          }}
        >
          Selling Points
        </Typography>

        <Alert
          severity="error"
          sx={{
            width: "100%",

            boxSizing: "border-box",

            borderRadius: 0,

            fontSize: {
              xs: "10px",
              sm: "12px",
            },

            py: 0.5,
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  /* =====================================================
     SAFETY CHECK
  ===================================================== */

  if (!data) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minHeight: "65vh",

          m: 0,

          p: {
            xs: "10px 8px 20px",
            sm: "12px 14px 24px",
            md: "16px 8px 24px",
          },

          boxSizing: "border-box",

          backgroundColor: "#F5F7FA",

          overflowX: "hidden",

          borderRadius: 0,
        }}
      >
        <Typography
          component="h1"
          sx={{
            m: 0,

            mb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            fontSize: {
              xs: "18px",
              sm: "22px",
              md: "26px",
            },

            lineHeight: 1.25,

            fontWeight: 700,

            color: "#292929",
          }}
        >
          Selling Points
        </Typography>

        <Alert
          severity="warning"
          sx={{
            borderRadius: 0,

            fontSize: {
              xs: "10px",
              sm: "12px",
            },

            py: 0.5,
          }}
        >
          Selling Point data is not available.
        </Alert>
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
        minWidth: 0,

        minHeight: "100vh",

        m: 0,
        p: 0,

        backgroundColor: "#F5F7FA",

        boxSizing: "border-box",

        overflowX: "hidden",

        borderRadius: 0,

        /* Remove outer MUI curves */

        "& .MuiCard-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius:
            "0 !important",
        },

        "& .MuiAlert-root": {
          borderRadius:
            "0 !important",
        },
      }}
    >
      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <Box
        sx={{
          width: "100%",

          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "1400px",
          },

          minWidth: 0,

          m: {
            xs: 0,
            md: "0 auto",
          },

          p: {
            xs: "8px",
            sm: "12px",
            md: "16px 8px 24px",
          },

          boxSizing: "border-box",

          overflowX: "hidden",
        }}
      >
        {/* =================================================
            TITLE
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            m: 0,
            p: 0,

            mb: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            boxSizing: "border-box",
          }}
        >
          <Typography
            component="h1"
            sx={{
              m: 0,
              p: 0,

              fontSize: {
                xs: "18px",
                sm: "22px",
                md: "26px",
              },

              lineHeight: 1.25,

              fontWeight: 700,

              color: "#292929",
            }}
          >
            Selling Points
          </Typography>
        </Box>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,

            m: 0,
            p: 0,

            boxSizing: "border-box",

            overflowX: "hidden",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& .MuiCard-root": {
              borderRadius:
                "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius:
                "0 !important",
            },
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
            minWidth: 0,

            m: 0,

            mt: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            p: 0,

            boxSizing: "border-box",

            overflowX: "hidden",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& .MuiCard-root": {
              borderRadius:
                "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius:
                "0 !important",
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
            minWidth: 0,

            m: 0,

            mt: {
              xs: 1,
              sm: 1.25,
              md: 1.5,
            },

            p: 0,

            boxSizing: "border-box",

            overflowX: "auto",

            WebkitOverflowScrolling:
              "touch",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& .MuiCard-root": {
              borderRadius:
                "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius:
                "0 !important",
            },
          }}
        >
          <HistoryTable
            history={
              data.sellingPoints
                ?.transactions || []
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SellingPoints;