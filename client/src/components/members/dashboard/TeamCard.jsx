import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

const TeamCard = ({ member }) => {
  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 3,
      }}
    >
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Avatar
              sx={{
                bgcolor: "#2E7D32",
              }}
            >
              {member.name.charAt(0)}
            </Avatar>

            <Box>

              <Typography
                fontWeight="bold"
              >
                {member.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {member.userId}
              </Typography>

            </Box>
          </Box>

          <Chip
            label={`${member.children?.length || 0} Direct`}
            color="success"
            size="small"
          />
        </Box>

      </CardContent>
    </Card>
  );
};

export default TeamCard;