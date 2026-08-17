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

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);

      const data = await getWallet();

      setWalletData({
        wallet: data?.wallet || {},
        transactions: Array.isArray(data?.transactions)
          ? data.transactions
          : [],
      });
    } catch (error) {
      console.error("WALLET LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",

        px: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },

        py: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        bgcolor: "#F5F7FA",
        minHeight: "100vh",

        overflowX: "hidden",
      }}
    >
      {/* PAGE TITLE */}

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
            xs: "1.5rem",
            sm: "1.8rem",
            md: "2.1rem",
          },

          lineHeight: 1.2,
        }}
      >
        Wallet
      </Typography>

      {/* SUMMARY */}

      <WalletSummary
        wallet={walletData.wallet}
      />

      {/* WITHDRAW */}

      <WithdrawCard
        wallet={walletData.wallet}
        onSuccess={loadWallet}
      />

      {/* TRANSACTIONS */}

      <WalletTransactions
        transactions={walletData.transactions}
      />
    </Box>
  );
};

export default Wallet;