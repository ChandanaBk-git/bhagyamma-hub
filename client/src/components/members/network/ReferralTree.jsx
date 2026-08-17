import { useMemo, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

import {
  Search,
  Refresh,
  UnfoldMore,
  UnfoldLess,
  AccountTree,
} from "@mui/icons-material";

import ReferralNode from "./ReferralNode";
import MemberDialog from "./MemberDialog";

const ReferralTree = ({ data = [] }) => {

  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const [expandAll, setExpandAll] = useState(true);

  const filteredMembers = useMemo(() => {

    if (!search.trim()) return data;

    const keyword = search.toLowerCase();

    const filterTree = (members) => {

      return members
        .map((member) => {

          const children = filterTree(member.children || []);

          const matched =
            member.name?.toLowerCase().includes(keyword) ||
            member.userId?.toLowerCase().includes(keyword) ||
            member.referralCode?.toLowerCase().includes(keyword) ||
            member.mobile?.includes(keyword);

          if (matched || children.length > 0) {

            return {
              ...member,
              children,
            };

          }

          return null;

        })
        .filter(Boolean);

    };

    return filterTree(data);

  }, [search, data]);

  return (
    <>

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
            mb={3}
            flexWrap="wrap"
            gap={2}
          >

            <Box>

              <Typography
                variant="h5"
                fontWeight="bold"
              >
                Referral Tree
              </Typography>

              <Typography
                color="text.secondary"
              >
                Explore your complete referral network.
              </Typography>

            </Box>

            <Chip
              icon={<AccountTree />}
              color="success"
              label={`${filteredMembers.length} Direct Members`}
            />

          </Stack>

          <TextField
            fullWidth
            size="small"
            placeholder="Search by Name, Member ID, Referral Code or Mobile..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
<Stack
  direction="row"
  spacing={1}
  flexWrap="wrap"
  useFlexGap
  sx={{ mb: 3 }}
>
  <Chip
    size="small"
    label="Level 1 • Direct"
    sx={{
      bgcolor: "#1565C0",
      color: "#FFFFFF",
      fontWeight: 700,
    }}
  />

  <Chip
    size="small"
    label="Level 2"
    sx={{
      bgcolor: "#7B1FA2",
      color: "#FFFFFF",
      fontWeight: 700,
    }}
  />

  <Chip
    size="small"
    label="Level 3"
    sx={{
      bgcolor: "#EF6C00",
      color: "#FFFFFF",
      fontWeight: 700,
    }}
  />

  <Chip
    size="small"
    label="Level 4"
    sx={{
      bgcolor: "#C62828",
      color: "#FFFFFF",
      fontWeight: 700,
    }}
  />

  <Chip
    size="small"
    label="Level 5+"
    sx={{
      bgcolor: "#00838F",
      color: "#FFFFFF",
      fontWeight: 700,
    }}
  />
</Stack>
          <ButtonGroup
            fullWidth
            sx={{ mb: 4 }}
          >

            <Button
              startIcon={<UnfoldMore />}
              onClick={() =>
                setExpandAll(true)
              }
            >
              Expand
            </Button>

            <Button
              startIcon={<UnfoldLess />}
              onClick={() =>
                setExpandAll(false)
              }
            >
              Collapse
            </Button>

            <Button
              startIcon={<Refresh />}
              onClick={() =>
                setSearch("")
              }
            >
              Reset
            </Button>

          </ButtonGroup>

          {

            filteredMembers.length === 0 ? (

              <Box
                py={8}
                textAlign="center"
              >

                <AccountTree
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
                  No Members Found
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  Try searching with another keyword.
                </Typography>

              </Box>

            ) : (

              filteredMembers.map((member) => (

                <ReferralNode
                  key={member._id}
                  member={member}
                  onSelect={setSelectedMember}
                  expandAll={expandAll}
                />

              ))

            )

          }

        </CardContent>

      </Card>

      <MemberDialog
        open={Boolean(selectedMember)}
        member={selectedMember}
        onClose={() =>
          setSelectedMember(null)
        }
      />

    </>
  );

};

export default ReferralTree;