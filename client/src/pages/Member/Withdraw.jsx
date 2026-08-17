import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { AccountBalanceWallet } from "@mui/icons-material";

import { useEffect, useState } from "react";

import { getWallet } from "../../services/wallet.service";

import {
  requestWithdraw,
  getMyWithdraws,
} from "../../services/withdraw.service";

const Withdraw = () => {
  const [wallet, setWallet] = useState({});
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const walletData = await getWallet();
      setWallet(walletData?.wallet || {});

      const withdrawData = await getMyWithdraws();
      setHistory(withdrawData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return alert("Enter valid amount");
    }

    if (numericAmount > Number(wallet.balance || 0)) {
      return alert("Amount exceeds available balance");
    }

    try {
      setSubmitting(true);
      await requestWithdraw({ amount: numericAmount });
      alert("Withdraw request submitted successfully.");
      setAmount("");
      await loadData();
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {

    return (

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >

        <CircularProgress color="success" />

      </Box>

    );

  }

  return (

    <Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Withdraw
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>

          <Card
            sx={{
              borderRadius:4,
            }}
          >

            <CardContent>

              <AccountBalanceWallet
                sx={{
                  color:"#2E7D32",
                  fontSize:50,
                }}
              />

              <Typography
                mt={2}
                color="text.secondary"
              >
                Available Balance
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
              >
                ₹{wallet.balance || 0}
              </Typography>

            </CardContent>

          </Card>

        </Grid>

        <Grid item xs={12} md={8}>

          <Card
            sx={{
              borderRadius:4,
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={3}
              >
                New Withdraw Request
              </Typography>

              <TextField
                fullWidth
                type="number"
                label="Withdraw Amount"
                value={amount}
                onChange={(e)=>
                  setAmount(e.target.value)
                }
              />

              <Alert
                severity="info"
                sx={{
                  mt:3,
                }}
              >
                Your registered bank account
                will be used for payment after
                approval.
              </Alert>

              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{
                  mt:3,
                  py:1.5,
                  borderRadius:3,
                }}
                onClick={handleSubmit}
                disabled={submitting || !amount || Number(amount) <= 0 || Number(amount) > Number(wallet.balance || 0)}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

      <Card
        sx={{
          mt:4,
          borderRadius:4,
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            fontWeight="bold"
            mb={3}
          >
            Withdraw History
          </Typography>

          {

            history.length === 0 ?

            (

              <Typography
                color="text.secondary"
              >
                No withdraw requests found.
              </Typography>

            )

            :

            history.map((item)=>(

              <Box
                key={item._id}
              >

                <Grid
                  container
                  alignItems="center"
                >

                  <Grid item xs={6}>

                    <Typography
                      fontWeight="bold"
                    >
                      ₹{item.amount}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {
                        new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      }
                    </Typography>

                  </Grid>

                  <Grid
                    item
                    xs={6}
                    textAlign="right"
                  >

                    <Chip
                      label={item.status}
                      color={
                        item.status ===
                        "APPROVED"
                          ? "success"
                          : item.status ===
                            "REJECTED"
                          ? "error"
                          : "warning"
                      }
                    />

                  </Grid>

                </Grid>

                {

                  item.rejectedReason &&

                  <Typography
                    mt={1}
                    color="error"
                    variant="body2"
                  >
                    Reason :
                    {" "}
                    {item.rejectedReason}
                  </Typography>

                }

                <Divider
                  sx={{
                    my:2,
                  }}
                />

              </Box>

            ))

          }

        </CardContent>

      </Card>

    </Box>

  );

};

export default Withdraw;