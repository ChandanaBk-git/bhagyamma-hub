import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import { AccountTree } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ReferralPreview = ({ network = [] }) => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={2}
      sx={{
        mt: 3,
        borderRadius: 3,
      }}
    >
      <CardContent>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <AccountTree
              color="success"
              sx={{ mr: 1 }}
            />

            <Typography
              variant="h6"
              fontWeight="bold"
            >
              My Referral Network
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="success"
            onClick={() =>
              navigate("/member/network")
            }
          >
            View All
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {network.length === 0 ? (
          <Typography
            color="text.secondary"
            align="center"
            py={3}
          >
            No referrals available.
          </Typography>
        ) : (
          <List disablePadding>
            {network.slice(0, 5).map((member) => (
              <ListItem
                key={member._id}
                divider
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "#2E7D32",
                    }}
                  >
                    {member.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={member.name}
                  secondary={`ID : ${member.userId}`}
                />
              </ListItem>
            ))}
          </List>
        )}

      </CardContent>
    </Card>
  );
};

export default ReferralPreview;