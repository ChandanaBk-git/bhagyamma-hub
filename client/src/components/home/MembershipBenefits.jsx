import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
} from "@mui/material";

import { membershipBenefits } from "../../utils/dummyData";

const MembershipBenefits = () => {
  return (
    <Box
      sx={{
        py: 10,
        background: "linear-gradient(135deg,#2E7D32,#1B5E20)",
        color: "#fff",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={700}
        >
          Become a Member Today
        </Typography>

        <Typography
          textAlign="center"
          sx={{
            mt: 2,
            mb: 7,
            opacity: .9,
          }}
        >
          Unlock exclusive benefits by joining the Bhagyamma Hub family.
        </Typography>

        <Grid container spacing={4}>
          {membershipBenefits.map((item) => (
            <Grid
              key={item.id}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  textAlign: "center",
                  p: 3,
                }}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: 50,
                    }}
                  >
                    {item.icon}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mt={2}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mt={2}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 7,
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
          >
            Join Membership
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MembershipBenefits;