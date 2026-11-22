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

const getMaxDepth = (members, currentDepth = 1) => {
  if (!Array.isArray(members) || members.length === 0) return 0;

  let max = currentDepth;
  for (const member of members) {
    if (Array.isArray(member.children) && member.children.length > 0) {
      const childDepth = getMaxDepth(member.children, currentDepth + 1);
      if (childDepth > max) max = childDepth;
    }
  }
  return max;
};

const ReferralTree = ({ data = [] }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const [expandMode, setExpandMode] = useState("default");
  const [expandSignal, setExpandSignal] = useState(0);

  /* =========================================================
     FILTER REFERRAL TREE
  ========================================================= */

  const filteredMembers = useMemo(() => {
    if (!search.trim()) {
      return data;
    }

    const keyword = search.toLowerCase().trim();

    const filterTree = (members) => {
      return members
        .map((member) => {
          const children = filterTree(member.children || []);

          const matched =
            member.name?.toLowerCase().includes(keyword) ||
            member.userId?.toLowerCase().includes(keyword) ||
            member.referralCode?.toLowerCase().includes(keyword) ||
            member.mobile?.toString().includes(keyword);

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

  const totalLevels = useMemo(
    () => getMaxDepth(filteredMembers),
    [filteredMembers]
  );

  const handleExpandAll = () => {
    setExpandMode("all");
    setExpandSignal((prev) => prev + 1);
  };

  const handleCollapseAll = () => {
    setExpandMode("none");
    setExpandSignal((prev) => prev + 1);
  };

  const handleReset = () => {
    setSearch("");
    setExpandMode("default");
    setExpandSignal((prev) => prev + 1);
  };

  return (
    <>
      {/* =====================================================
          REFERRAL TREE CONTAINER
      ===================================================== */}

      <Card
        elevation={0}
        sx={{
          mt: 1.5,
          borderRadius: 0,
          border: "1px solid #C8DEC9",
          boxShadow: "none",
          background: "#FFFFFF",
          width: "100%",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1, sm: 1.5 },
            "&:last-child": {
              pb: { xs: 1, sm: 1.5 },
            },
          }}
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={0.8}
            mb={1.2}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "17px" },
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#1F2937",
                }}
              >
                Referral Tree
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: { xs: "9px", sm: "10px" },
                  lineHeight: 1.3,
                  color: "text.secondary",
                }}
              >
                Explore your complete referral network level by level.
              </Typography>
            </Box>

            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<AccountTree sx={{ fontSize: "14px !important" }} />}
                label={`${filteredMembers.length} Direct`}
                size="small"
                sx={{
                  height: 23,
                  borderRadius: 0,
                  bgcolor: "#E8F5E9",
                  color: "#1B5E20",
                  border: "1px solid #A5D6A7",
                  fontSize: "9px",
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "#2E7D32" },
                  "& .MuiChip-label": { px: 0.8 },
                }}
              />

              {totalLevels > 0 && (
                <Chip
                  label={`Levels: 1 – ${totalLevels}`}
                  size="small"
                  sx={{
                    height: 23,
                    borderRadius: 0,
                    bgcolor: "#F4F7F5",
                    color: "#2E4735",
                    border: "1px solid #CFDCD2",
                    fontSize: "9px",
                    fontWeight: 700,
                    "& .MuiChip-label": { px: 0.8 },
                  }}
                />
              )}
            </Stack>
          </Stack>

          {/* =================================================
              SEARCH
          ================================================= */}

          <TextField
            fullWidth
            size="small"
            placeholder="Search by Name, Member ID, Referral Code or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 17, color: "#6B7280" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
                fontSize: { xs: "9px", sm: "10px" },
                minHeight: 34,
                bgcolor: "#FAFDFB",
              },
              "& .MuiOutlinedInput-input": {
                py: 0.8,
              },
            }}
          />

          {/* =================================================
              CONTROLS (NO LEVEL COLOUR LEGEND BAR)
          ================================================= */}

          <ButtonGroup
            fullWidth
            sx={{
              mb: 1.2,
              "& .MuiButton-root": {
                borderRadius: 0,
                minHeight: 30,
                py: 0.3,
                px: { xs: 0.5, sm: 1 },
                fontSize: { xs: "8px", sm: "9px" },
                fontWeight: 600,
                color: "#2E5A32",
                borderColor: "#C8DEC9",
                bgcolor: "#FAFDFB",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#EDF7ED",
                  borderColor: "#A5C9A7",
                },
              },
              "& .MuiButton-startIcon": {
                marginRight: { xs: "3px", sm: "5px" },
                "& svg": {
                  fontSize: { xs: 13, sm: 15 },
                },
              },
            }}
          >
            <Button startIcon={<UnfoldMore />} onClick={handleExpandAll}>
              Expand All
            </Button>

            <Button startIcon={<UnfoldLess />} onClick={handleCollapseAll}>
              Collapse All
            </Button>

            <Button startIcon={<Refresh />} onClick={handleReset}>
              Reset
            </Button>
          </ButtonGroup>

          {/* =================================================
              TREE / EMPTY STATE
          ================================================= */}

          {filteredMembers.length === 0 ? (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
                border: "1px solid #E5E7EB",
                background: "#FAFAFA",
              }}
            >
              <AccountTree
                sx={{
                  fontSize: { xs: 40, sm: 50 },
                  color: "#C8E6C9",
                }}
              />

              <Typography
                sx={{
                  mt: 0.8,
                  fontSize: { xs: "12px", sm: "14px" },
                  fontWeight: 700,
                  color: "#1F2937",
                }}
              >
                No Members Found
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: { xs: "9px", sm: "10px" },
                  color: "text.secondary",
                }}
              >
                Try searching with another keyword.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                boxSizing: "border-box",
                overflowX: "auto",
                overflowY: "visible",
              }}
            >
              {filteredMembers.map((member) => (
                <ReferralNode
                  key={member._id || member.id || member.userId}
                  member={member}
                  onSelect={setSelectedMember}
                  expandMode={expandMode}
                  expandSignal={expandSignal}
                  isSearching={Boolean(search.trim())}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          MEMBER DETAILS
      ===================================================== */}

      <MemberDialog
        open={Boolean(selectedMember)}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
};

export default ReferralTree;