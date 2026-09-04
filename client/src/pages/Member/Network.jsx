import { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { getReferralTree } from "../../services/network.service";

import NetworkSummary from "../../components/members/network/NetworkSummary";
import ReferralTree from "../../components/members/network/ReferralTree";

const Network = () => {
  const [network, setNetwork] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD REFERRAL TREE
  ===================================================== */

  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    try {
      setLoading(true);

      const data = await getReferralTree();

      console.log("MY NETWORK:", data);

      setNetwork(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Network loading error:",
        error
      );

      setNetwork([]);
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
          alignItems: "center",
          justifyContent: "center",
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
     MAIN PAGE
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
        boxSizing: "border-box",
        backgroundColor: "#F5F7FA",
        overflowX: "hidden",

        borderRadius: 0,

        "& .MuiCard-root": {
          borderRadius: "0 !important",
        },

        "& .MuiPaper-root": {
          borderRadius: "0 !important",
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
            PAGE TITLE
        ================================================= */}

        <Box
          sx={{
            width: "100%",
            m: 0,
            p: 0,
            mb: {
              xs: 8 / 16,
              sm: 1,
              md: 1.25,
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
            My Network
          </Typography>
        </Box>

        {/* =================================================
            NETWORK SUMMARY
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
          <NetworkSummary
            network={network}
          />
        </Box>

        {/* =================================================
            REFERRAL TREE
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
            overflowY: "hidden",

            WebkitOverflowScrolling: "touch",

            "& > *": {
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
          <ReferralTree
            data={network}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Network;