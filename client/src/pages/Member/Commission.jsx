import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getMyCommissions } from "../../services/commission.service";

import CommissionSummary from "../../components/members/commission/CommissionSummary";
import CommissionTable from "../../components/members/commission/CommissionTable";

const Commission = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD COMMISSIONS
  // =====================================================

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyCommissions();

      console.log("MY COMMISSIONS:", data);

      setCommissions(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "COMMISSION LOAD ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load commission data."
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
          component="h1"
          fontWeight={700}
          sx={{
            mb: 2,
            fontSize: {
              xs: "1.45rem",
              sm: "1.8rem",
              md: "2.4rem",
            },
          }}
        >
          Commission
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
        Commission
      </Typography>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <CommissionSummary
          commissions={commissions}
        />
      </Box>

      {/* =================================================
          HISTORY
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
        <CommissionTable
          commissions={commissions}
        />
      </Box>
    </Box>
  );
};

export default Commission;