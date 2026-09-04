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

  const [commissions, setCommissions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD COMMISSIONS
  ===================================================== */

  useEffect(() => {
    loadCommissions();
  }, []);


  const loadCommissions = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getMyCommissions();

      console.log(
        "MY COMMISSIONS:",
        data
      );

      setCommissions(
        Array.isArray(data)
          ? data
          : []
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
          justifyContent: "center",
          alignItems: "center",

          margin: 0,
          padding: 0,

          boxSizing: "border-box",

          bgcolor: "#F5F7FA",
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
          minHeight: "70vh",

          margin: 0,

          padding: {
            xs: "10px 8px 20px",
            sm: "14px 14px 24px",
            md: "20px 8px 30px",
          },

          boxSizing: "border-box",

          bgcolor: "#F5F7FA",

          overflowX: "hidden",
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

            lineHeight: 1.25,

            fontWeight: 800,

            color: "#292929",
          }}
        >
          Commission
        </Typography>


        <Alert
          severity="error"
          sx={{
            width: "100%",

            boxSizing: "border-box",

            borderRadius: "0 !important",

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

        boxSizing: "border-box",

        bgcolor: "#F5F7FA",

        overflowX: "hidden",

        borderRadius: "0 !important",
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

          boxSizing: "border-box",

          overflowX: "hidden",
        }}
      >


        {/* =================================================
            TITLE
        ================================================= */}

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

            color: "#292929",
          }}
        >
          Commission
        </Typography>


        {/* =================================================
            COMMISSION SUMMARY
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,

            margin: 0,
            padding: 0,

            boxSizing: "border-box",

            overflow: "hidden",

            /* =============================================
               MOBILE CARD SIZE
            ============================================= */

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            },


            /* =============================================
               REMOVE LARGE CARD HEIGHT
            ============================================= */

            "& .MuiCard-root": {

              minHeight: {
                xs: "0 !important",
                sm: "0 !important",
              },

              height: {
                xs: "auto !important",
                sm: "auto",
              },

              boxSizing: "border-box",

              borderRadius: {
                xs: "0 !important",
                sm: "0 !important",
              },

              marginBottom: {
                xs: "8px !important",
                sm: "12px",
              },
            },


            /* =============================================
               REDUCE CARD CONTENT PADDING
            ============================================= */

            "& .MuiCardContent-root": {

              padding: {
                xs: "12px 14px !important",
                sm: "18px !important",
              },

              paddingBottom: {
                xs: "12px !important",
                sm: "18px !important",
              },

              minHeight: "0 !important",

              boxSizing: "border-box",
            },


            /* =============================================
               REDUCE TYPOGRAPHY SPACING
            ============================================= */

            "& .MuiCardContent-root .MuiTypography-root": {

              marginTop: {
                xs: "2px",
                sm: "4px",
              },

              marginBottom: {
                xs: "2px",
                sm: "4px",
              },

              lineHeight: {
                xs: 1.25,
                sm: 1.35,
              },
            },


            /* =============================================
               REDUCE LARGE ICON CIRCLE
            ============================================= */

            "& .MuiCardContent-root .MuiBox-root": {

              boxSizing: "border-box",
            },


            /* =============================================
               MOBILE FONT SIZES
            ============================================= */

            "@media (max-width:600px)": {

              "& .MuiCardContent-root": {
                padding: "12px 14px !important",
                minHeight: "0 !important",
              },

              "& .MuiCardContent-root .MuiTypography-root": {
                fontSize: "13px",
                lineHeight: 1.25,
              },

              "& .MuiCardContent-root .MuiTypography-h6": {
                fontSize: "17px",
                lineHeight: 1.25,
              },

              "& .MuiCardContent-root .MuiTypography-body1": {
                fontSize: "13px",
              },

              "& .MuiCardContent-root .MuiTypography-body2": {
                fontSize: "12px",
              },

              /* Icon */

              "& .MuiCardContent-root svg": {
                fontSize: "24px",
              },

            },
          }}
        >

          <CommissionSummary
            commissions={commissions}
          />

        </Box>


        {/* =================================================
            COMMISSION HISTORY
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,

            margin: 0,

            marginTop: {
              xs: "8px",
              sm: "14px",
              md: "18px",
            },

            padding: 0,

            boxSizing: "border-box",

            overflowX: "auto",
            overflowY: "hidden",

            borderRadius: "0 !important",

            "& > *": {
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            },

            "& .MuiCard-root": {
              borderRadius: "0 !important",
            },

            "& .MuiPaper-root": {
              borderRadius: "0 !important",
            },
          }}
        >

          <CommissionTable
            commissions={commissions}
          />

        </Box>


      </Box>

    </Box>
  );

};


export default Commission;