import {
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

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    try {
      const data = await getMyCommissions();
      setCommissions(data);
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
        Commission
      </Typography>

      <CommissionSummary
        commissions={commissions}
      />

      <CommissionTable
        commissions={commissions}
      />

    </Box>
  );
};

export default Commission;