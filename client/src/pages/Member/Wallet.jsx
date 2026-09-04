import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getWallet } from "../../services/wallet.service";

import WalletSummary from "../../components/members/Wallet/WalletSummary";
import WalletTransactions from "../../components/members/Wallet/WalletTransactions";
import WithdrawCard from "../../components/members/Wallet/WithdrawCard";

const Wallet = () => {
  const [walletData, setWalletData] = useState({
    wallet: {},
    transactions: [],
  });

  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD WALLET
  ===================================================== */

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);

      const data = await getWallet();

      setWalletData({
        wallet: data?.wallet || {},
        transactions: Array.isArray(
          data?.transactions
        )
          ? data.transactions
          : [],
      });
    } catch (error) {
      console.error(
        "WALLET LOAD ERROR:",
        error
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
          Wallet
        </Typography>

        {/* =================================================
            WALLET SUMMARY
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
          <WalletSummary
            wallet={walletData.wallet}
          />
        </Box>

        {/* =================================================
            WITHDRAW
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
          <WithdrawCard
            wallet={walletData.wallet}
            onSuccess={loadWallet}
          />
        </Box>

        {/* =================================================
            TRANSACTIONS
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
          <WalletTransactions
            transactions={
              walletData.transactions
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Wallet;