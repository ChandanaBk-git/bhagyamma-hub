import { Box, CircularProgress, Button, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Download } from "@mui/icons-material";

import ReportsSummary from "../../components/members/reports/ReportsSummary";
import EarningsChart from "../../components/members/reports/EarningsChart";
import OrdersChart from "../../components/members/reports/OrdersChart";
import SellingPointChart from "../../components/members/reports/SellingPointChart";
import NetworkChart from "../../components/members/reports/NetworkChart";

import { getDashboard } from "../../services/dashboard.service";
import { getWallet } from "../../services/wallet.service";
import { getMyOrders } from "../../services/order.service";
import { getReferralTree } from "../../services/network.service";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ dashboard: null, wallet: null, orders: [], network: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboard, wallet, orders, network] = await Promise.all([
          getDashboard(),
          getWallet(),
          getMyOrders(),
          getReferralTree(),
        ]);

        setData({
          dashboard,
          wallet: wallet?.wallet || wallet || {},
          orders: orders || [],
          network: network || [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const summary = useMemo(() => {
    const dashboardSummary = data.dashboard?.summary || {};
    const walletBalance = data.wallet?.balance || data.dashboard?.wallet?.balance || 0;
    const totalOrders = data.orders?.length || dashboardSummary.totalOrders || 0;
    const totalNetworkMembers = data.network?.length || dashboardSummary.totalReferrals || 0;

    return {
      totalSellingPoints: dashboardSummary.sellingPoints || 0,
      totalOrders,
      totalNetworkMembers,
      totalMembers: totalNetworkMembers,
      directMembers: data.network?.length || 0,
      level1Members: data.network?.filter((member) => member.children?.length).length || 0,
      level2Members: 0,
      level3Members: 0,
    };
  }, [data]);

  const exportReport = () => {
    const content = [
      "Bhagyamma Hub Member Report",
      `Wallet Balance: ₹${data.wallet?.balance || 0}`,
      `Selling Points: ${summary.totalSellingPoints}`,
      `Orders: ${summary.totalOrders}`,
      `Network Members: ${summary.totalNetworkMembers}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "member-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: 6 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={3}>
        <Box>
          <h2 style={{ margin: 0 }}>Reports</h2>
          <p style={{ margin: "4px 0 0", color: "#616161" }}>Track performance across wallet, orders, selling points, and your network.</p>
        </Box>
        <Button variant="contained" color="success" startIcon={<Download />} onClick={exportReport}>
          Export Report
        </Button>
      </Stack>

      <ReportsSummary summary={summary} wallet={data.wallet || {}} />
      <EarningsChart commissions={data.dashboard?.recentCommissions || []} />
      <OrdersChart orders={data.orders} />
      <SellingPointChart summary={summary} />
      <NetworkChart summary={summary} />
    </Box>
  );
};

export default Reports;