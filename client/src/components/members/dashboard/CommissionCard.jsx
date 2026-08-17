import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  CurrencyRupee,
  ArrowForwardIos,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const CommissionCard = ({ wallet, summary }) => {

  const navigate = useNavigate();

  return (

    <Card
      elevation={2}
      onClick={() =>
        navigate("/member/commission")
      }
      sx={{
        mt: 3,
        borderRadius: 4,
        cursor: "pointer",
        transition: ".3s",

        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              color="text.secondary"
            >
              Commission
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
            >
              ₹{wallet?.totalCommission || 0}
            </Typography>

          </Box>

          <Box
            sx={{
              width: 70,
              height: 70,
              bgcolor: "#E3F2FD",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <CurrencyRupee
              sx={{
                fontSize: 42,
                color: "#1976D2",
              }}
            />

          </Box>

        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
        >

          <Box>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Wallet Balance
            </Typography>

            <Typography
              fontWeight="bold"
            >
              ₹{wallet?.balance || 0}
            </Typography>

          </Box>

          <Box textAlign="right">

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Withdrawn
            </Typography>

            <Typography
              fontWeight="bold"
            >
              ₹{wallet?.totalWithdrawn || 0}
            </Typography>

          </Box>

        </Stack>

        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            color="primary"
            fontWeight="bold"
          >
            View Commission
          </Typography>

          <ArrowForwardIos
            sx={{
              color: "#1976D2",
              fontSize: 16,
            }}
          />

        </Box>

      </CardContent>

    </Card>

  );

};

export default CommissionCard;