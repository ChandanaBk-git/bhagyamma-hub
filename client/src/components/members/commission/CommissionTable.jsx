import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  CurrencyRupee,
  Groups,
} from "@mui/icons-material";

const CommissionTable = ({ commissions = [] }) => {

  if (commissions.length === 0) {
    return (
      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
          border: "1px solid #E8F5E9",
        }}
      >
        <CardContent>

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
          >
            Commission History
          </Typography>

          <Box
            py={6}
            textAlign="center"
          >

            <CurrencyRupee
              sx={{
                fontSize: 70,
                color: "#C8E6C9",
              }}
            />

            <Typography
              variant="h6"
              mt={2}
              fontWeight="bold"
            >
              No Commission Yet
            </Typography>

            <Typography
              color="text.secondary"
            >
              Start referring members and purchasing
              products to earn your first commission.
            </Typography>

          </Box>

        </CardContent>
      </Card>
    );
  }

  return (

    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        border: "1px solid #E8F5E9",
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Commission History
          </Typography>

          <Chip
            label={`${commissions.length} Records`}
            color="success"
          />

        </Stack>

        {

          commissions.map((item) => (

            <Box
              key={item._id}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                transition: ".3s",

                "&:hover": {
                  bgcolor: "#FAFAFA",
                  transform: "translateY(-4px)",
                },
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >

                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: "#E8F5E9",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow:
                        "0 4px 10px rgba(0,0,0,.08)",
                    }}
                  >

                    <Groups
                      sx={{
                        color: "#2E7D32",
                        fontSize: 30,
                      }}
                    />

                  </Box>

                  <Box>

                    <Typography
                      fontWeight="bold"
                      fontSize={16}
                    >
                      {item.fromUser?.name || "System"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.fromUser?.userId || "-"}
                    </Typography>

                  </Box>

                </Stack>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="success.main"
                >
                  ₹
                  {Number(
                    item.commissionAmount || 0
                  ).toLocaleString("en-IN")}
                </Typography>

              </Stack>

              <Stack
                direction="row"
                spacing={1}
                mt={2}
                flexWrap="wrap"
              >

                <Chip
                  size="small"
                  label={`L${item.level}`}
                  color="primary"
                />

                <Chip
                  size="small"
                  label={`${item.percentage}%`}
                  sx={{
                    bgcolor: "#FFF3E0",
                    color: "#EF6C00",
                  }}
                />

                <Chip
                  size="small"
                  label="Paid"
                  color="success"
                />

              </Stack>

              <Typography
                mt={2}
                variant="body2"
                color="text.secondary"
              >
                Joining Amount :
                <b>
                  {" "}
                  ₹
                  {Number(
                    item.joiningAmount || 0
                  ).toLocaleString("en-IN")}
                </b>
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Earned On :
                {" "}
                {new Date(
                  item.createdAt
                ).toLocaleDateString()}
              </Typography>

              <Divider
                sx={{
                  mt: 3,
                }}
              />

            </Box>

          ))

        }

      </CardContent>

    </Card>

  );

};

export default CommissionTable;