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

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


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

      const dashboard =
        await getDashboard();

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

      const sellingPoints =
        Number(
          apiSummary?.sellingPoints ??
          apiSellingPoints?.sellingPoints ??
          0
        );


      /* =================================================
         LIFETIME PURCHASE
      ================================================= */

      const lifetimePurchase =
        Number(
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

      const supervisorTarget =
        500;


      /* =================================================
         REMAINING TARGET
      ================================================= */

      const remainingTarget =
        Math.max(
          supervisorTarget -
          sellingPoints,
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


      setData(
        normalizedData
      );

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

          minHeight: "60vh",

          display: "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          margin: 0,

          padding: 0,

          boxSizing:
            "border-box",

          backgroundColor:
            "#F5F7FA",
        }}
      >

        <CircularProgress
          color="success"
          size={28}
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

          minHeight: "70vh",

          margin: 0,

          padding: {
            xs: "10px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing:
            "border-box",

          backgroundColor:
            "#F5F7FA",

          overflowX:
            "hidden",

          borderRadius:
            "0 !important",
        }}
      >

        {/* TITLE */}

        <Typography
          component="h1"
          sx={{
            margin: 0,

            padding: 0,

            marginBottom: {
              xs: "12px",
              sm: "18px",
              md: "22px",
            },

            fontSize: {
              xs: "20px",
              sm: "25px",
              md: "30px",
            },

            lineHeight: {
              xs: "25px",
              sm: "31px",
              md: "36px",
            },

            fontWeight: 800,

            color:
              "#292929",
          }}
        >
          Selling Points
        </Typography>


        <Alert
          severity="error"
          sx={{
            width: "100%",

            boxSizing:
              "border-box",

            borderRadius:
              "0 !important",

            fontSize: {
              xs: "12px",
              sm: "13px",
            },
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

          minHeight: "70vh",

          margin: 0,

          padding: {
            xs: "10px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing:
            "border-box",

          backgroundColor:
            "#F5F7FA",

          overflowX:
            "hidden",

          borderRadius:
            "0 !important",
        }}
      >

        <Typography
          component="h1"
          sx={{
            margin: 0,

            padding: 0,

            marginBottom: {
              xs: "12px",
              sm: "18px",
              md: "22px",
            },

            fontSize: {
              xs: "20px",
              sm: "25px",
              md: "30px",
            },

            fontWeight: 800,
          }}
        >
          Selling Points
        </Typography>


        <Alert
          severity="warning"
          sx={{
            borderRadius:
              "0 !important",
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

        margin: 0,

        padding: 0,

        backgroundColor:
          "#F5F7FA",

        boxSizing:
          "border-box",

        overflowX:
          "hidden",

        borderRadius:
          "0 !important",

        /* ==========================================
           REMOVE OUTER MUI CURVES
        ========================================== */

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

          margin: {
            xs: 0,
            md: "0 auto",
          },

          padding: {
            xs: "8px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing:
            "border-box",

          overflowX:
            "hidden",

          borderRadius:
            "0 !important",
        }}
      >


        {/* =================================================
            TITLE
        ================================================= */}

        <Box
          sx={{
            width: "100%",

            margin: 0,

            padding: 0,

            marginBottom: {
              xs: "12px",
              sm: "18px",
              md: "22px",
            },

            boxSizing:
              "border-box",
          }}
        >

          <Typography
            component="h1"
            sx={{
              margin: 0,

              padding: 0,

              fontSize: {
                xs: "20px",
                sm: "25px",
                md: "30px",
              },

              lineHeight: {
                xs: "25px",
                sm: "31px",
                md: "36px",
              },

              fontWeight: 800,

              color:
                "#292929",
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

            margin: 0,

            padding: 0,

            boxSizing:
              "border-box",

            overflowX:
              "hidden",

            borderRadius:
              "0 !important",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing:
                "border-box",
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
            summary={
              data.summary
            }
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

            margin: 0,

            marginTop: {
              xs: "10px",
              sm: "14px",
              md: "18px",
            },

            padding: 0,

            boxSizing:
              "border-box",

            overflowX:
              "hidden",

            borderRadius:
              "0 !important",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing:
                "border-box",
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
            summary={
              data.summary
            }
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

            margin: 0,

            marginTop: {
              xs: "10px",
              sm: "14px",
              md: "18px",
            },

            padding: 0,

            boxSizing:
              "border-box",

            overflowX:
              "auto",

            borderRadius:
              "0 !important",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing:
                "border-box",
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