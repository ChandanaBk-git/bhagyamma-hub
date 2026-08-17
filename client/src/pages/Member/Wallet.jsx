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
      const data = await getWallet();

      setWalletData({
        wallet: data?.wallet || {},
        transactions: data?.transactions || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        height="70vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#F5F7FA",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Wallet
      </Typography>

      <WalletSummary wallet={walletData.wallet} />

      <WithdrawCard wallet={walletData.wallet} />

      <WalletTransactions
        transactions={walletData.transactions}
      />
    </Box>
  );
};

export default Wallet;