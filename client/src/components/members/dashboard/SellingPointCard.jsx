import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
} from "@mui/material";

import {
  Stars,
  ArrowForwardIos,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const SellingPointCard = ({ summary }) => {

  const navigate = useNavigate();

  const points =
    summary?.sellingPoints || 0;

  const target = 500;

  const progress =
    Math.min((points / target) * 100, 100);

  return (

    <Card
      elevation={2}
      onClick={() =>
        navigate("/member/selling-points")
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
              Selling Points
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={1}
            >
              {points}
            </Typography>

          </Box>

          <Box
            sx={{
              width: 70,
              height: 70,
              bgcolor: "#FFF8E1",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <Stars
              sx={{
                fontSize: 40,
                color: "#F9A825",
              }}
            />

          </Box>

        </Stack>

        <Box mt={3}>

          <Typography
            variant="body2"
            gutterBottom
          >
            {points} / {target} SP
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
            }}
          />

        </Box>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            color="warning.main"
            fontWeight="bold"
          >
            {target - points > 0
              ? `${target - points} SP Remaining`
              : "Supervisor Achieved"}
          </Typography>

          <ArrowForwardIos
            sx={{
              color: "#F9A825",
              fontSize: 16,
            }}
          />

        </Box>

      </CardContent>

    </Card>

  );

};

export default SellingPointCard;