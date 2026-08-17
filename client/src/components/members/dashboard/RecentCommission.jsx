import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  CurrencyRupee,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const RecentCommission = ({
  commissions = [],
}) => {

  const navigate = useNavigate();

  return (

    <Card
      elevation={2}
      sx={{
        mt: 3,
        borderRadius: 4,
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Recent Commission
          </Typography>

          <Button
            size="small"
            onClick={() =>
              navigate("/member/commission")
            }
          >
            View All
          </Button>

        </Stack>

        {commissions.length === 0 ? (

          <Box
            py={4}
            textAlign="center"
          >

            <CurrencyRupee
              sx={{
                fontSize: 45,
                color: "#BDBDBD",
              }}
            />

            <Typography
              mt={2}
              color="text.secondary"
            >
              No Commission Found
            </Typography>

          </Box>

        ) : (

          commissions
            .slice(0, 5)
            .map((item) => (

              <Box
                key={item._id}
              >

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Box>

                    <Typography
                      fontWeight="bold"
                    >
                      {item.fromUser?.name ||
                        "System"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.type}
                    </Typography>

                  </Box>

                  <Box
                    textAlign="right"
                  >

                    <Typography
                      fontWeight="bold"
                      color="success.main"
                    >
                      ₹
                      {item.commissionAmount}
                    </Typography>

                    <Chip
                      size="small"
                      color="success"
                      label={
                        item.level
                          ? `Level ${item.level}`
                          : "Reward"
                      }
                    />

                  </Box>

                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </Typography>

                <Divider
                  sx={{
                    my: 2,
                  }}
                />

              </Box>

            ))

        )}

      </CardContent>

    </Card>

  );

};

export default RecentCommission;