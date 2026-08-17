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
  Stars,
  ShoppingBag,
} from "@mui/icons-material";

const HistoryTable = ({ history = [] }) => {

  if (!history.length) {

    return (

      <Card
        elevation={2}
        sx={{
          borderRadius: 4,
        }}
      >

        <CardContent>

          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
          >
            Selling Point History
          </Typography>

          <Box
            py={7}
            textAlign="center"
          >

            <Stars
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
              No Selling Points Yet
            </Typography>

            <Typography
              color="text.secondary"
            >
              Purchase products to earn Selling Points.
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
            Selling Point History
          </Typography>

          <Chip
            label={`${history.length} Records`}
            color="success"
          />

        </Stack>

        {

          history.map((item) => (

            <Box
              key={item._id}
              sx={{
                p: 2,
                mb: 3,
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
                      bgcolor: "#FFF8E1",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >

                    <ShoppingBag
                      sx={{
                        color: "#F9A825",
                      }}
                    />

                  </Box>

                  <Box>

                    <Typography
                      fontWeight="bold"
                    >
                      {item.productName || "Product Purchase"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Order :
                      {" "}
                      {item.orderId || "--"}
                    </Typography>

                  </Box>

                </Stack>

                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="warning.main"
                >
                  +{item.points || 0} SP
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
                  label={`₹${Number(item.purchaseAmount || 0).toLocaleString("en-IN")}`}
                  color="primary"
                />

                <Chip
                  size="small"
                  label="Earned"
                  color="success"
                />

              </Stack>

              <Typography
                mt={2}
                variant="body2"
                color="text.secondary"
              >
                Date :
                {" "}
                {new Date(item.createdAt).toLocaleDateString()}
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

export default HistoryTable;