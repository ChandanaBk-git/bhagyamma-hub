import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const ReferralNode = ({
  member,
  onSelect,
  expandAll,
}) => {
  const [open, setOpen] = useState(expandAll);

  useEffect(() => {
    setOpen(expandAll);
  }, [expandAll]);

  const children = member.children || [];

  return (
    <Box
      ml={2}
      mt={2}
    >
      <Card
        elevation={2}
        onClick={() =>
          onSelect(member)
        }
        sx={{
          borderRadius: 3,
          cursor: "pointer",

          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <CardContent>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >

            <Avatar
              sx={{
                bgcolor: "#2E7D32",
              }}
            >
              {member?.name?.charAt(0)}
            </Avatar>

            <Box flex={1}>

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

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Referral :
                {" "}
                {member.referralCode}
              </Typography>

            </Box>

            <Chip
              color="primary"
              size="small"
              label={`${children.length} Members`}
            />

            {children.length > 0 && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
              >
                {open
                  ? <ExpandLess />
                  : <ExpandMore />}
              </IconButton>
            )}

          </Stack>

        </CardContent>
      </Card>

      {children.length > 0 && (
        <Collapse in={open}>
          {children.map((child) => (
            <ReferralNode
              key={child._id}
              member={child}
              onSelect={onSelect}
              expandAll={expandAll}
            />
          ))}
        </Collapse>
      )}

    </Box>
  );
};

export default ReferralNode;