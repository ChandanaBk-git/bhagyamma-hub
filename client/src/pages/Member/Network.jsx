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

  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    try {
      const data = await getReferralTree();

      setNetwork(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        My Network
      </Typography>

      <NetworkSummary
        network={network}
      />

      <ReferralTree
        data={network}
      />

    </Box>
  );
};

export default Network;