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
  People,
  AccountTree,
} from "@mui/icons-material";

/* =========================================================
   10-COLOUR BALANCED CYCLE (SCALES INFINITELY TO 100+ LEVELS)
========================================================= */

export const LEVEL_PALETTE = [
  {
    name: "Emerald",
    main: "#2E7D32",
    light: "#E8F5E9",
    border: "#A5D6A7",
    text: "#1B5E20",
    line: "#81C784",
  },
  {
    name: "Ocean Blue",
    main: "#1976D2",
    light: "#E3F2FD",
    border: "#90CAF9",
    text: "#0D47A1",
    line: "#64B5F6",
  },
  {
    name: "Royal Plum",
    main: "#7B1FA2",
    light: "#F3E5F5",
    border: "#CE93D8",
    text: "#4A148C",
    line: "#BA68C8",
  },
  {
    name: "Terracotta",
    main: "#D84315",
    light: "#FBE9E7",
    border: "#FFAB91",
    text: "#BF360C",
    line: "#FF8A65",
  },
  {
    name: "Deep Teal",
    main: "#00796B",
    light: "#E0F2F1",
    border: "#80CBC4",
    text: "#004D40",
    line: "#4DB6AC",
  },
  {
    name: "Indigo",
    main: "#3949AB",
    light: "#E8EAF6",
    border: "#9FA8DA",
    text: "#1A237E",
    line: "#7986CB",
  },
  {
    name: "Warm Ochre",
    main: "#B26A00",
    light: "#FFF8E1",
    border: "#FFE082",
    text: "#6D4C00",
    line: "#FFD54F",
  },
  {
    name: "Berry Rose",
    main: "#AD1457",
    light: "#FCE4EC",
    border: "#F48FB1",
    text: "#880E4F",
    line: "#F06292",
  },
  {
    name: "Olive Moss",
    main: "#558B2F",
    light: "#F1F8E9",
    border: "#C5E1A5",
    text: "#33691E",
    line: "#AED581",
  },
  {
    name: "Slate Steel",
    main: "#455A64",
    light: "#ECEFF1",
    border: "#B0BEC5",
    text: "#263238",
    line: "#90A4AE",
  },
];

const getLevelStyle = (level) => {
  const safeIndex = Math.max(0, Number(level || 1) - 1) % LEVEL_PALETTE.length;
  return LEVEL_PALETTE[safeIndex];
};

/* =========================================================
   REFERRAL NODE
========================================================= */

const ReferralNode = ({
  member,
  onSelect,
  expandMode = "default",
  expandSignal = 0,
  isSearching = false,
  level = 1,
}) => {
  const getInitialOpen = () => {
    if (isSearching || expandMode === "all") return true;
    if (expandMode === "none") return false;
    return level <= 2; // Open first 2 levels by default for fast performance up to 100 levels
  };

  const [open, setOpen] = useState(getInitialOpen);

  useEffect(() => {
    if (isSearching) {
      setOpen(true);
      return;
    }
    if (expandMode === "all") {
      setOpen(true);
    } else if (expandMode === "none") {
      setOpen(false);
    } else {
      setOpen(level <= 2);
    }
  }, [expandMode, expandSignal, isSearching, level]);

  const children = Array.isArray(member?.children) ? member.children : [];
  const style = getLevelStyle(level);

  const memberName = member?.name || "Unknown Member";
  const memberInitial = memberName.charAt(0).toUpperCase();

  // Cap horizontal indentation after depth 6 so Level 100 never gets pushed off-screen
  const isIndented = level > 1 && level <= 6;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        ml: isIndented
          ? {
              xs: 0.75,
              sm: 1.5,
              md: 2,
            }
          : 0,
        mt: 1,
        pl:
          level === 1
            ? 0
            : {
                xs: 1.25,
                sm: 2,
              },
      }}
    >
      {/* =====================================================
          CONNECTOR TO PARENT
      ===================================================== */}

      {level > 1 && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: { xs: 2, sm: 6 },
              top: -10,
              bottom: 18,
              width: "1.5px",
              bgcolor: style.line,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              left: { xs: 2, sm: 6 },
              top: 30,
              width: { xs: 10, sm: 18 },
              height: "1.5px",
              bgcolor: style.line,
            }}
          />
        </>
      )}

      {/* =====================================================
          MEMBER CARD
      ===================================================== */}

      <Card
        elevation={0}
        onClick={() => onSelect(member)}
        sx={{
          position: "relative",
          width: "100%",
          cursor: "pointer",
          borderRadius: 0,
          border: `1px solid ${style.border}`,
          borderLeft: `4px solid ${style.main}`,
          background: "#FFFFFF",
          boxShadow: "none",
          transition: "background-color 0.15s ease, border-color 0.15s ease",
          "&:hover": {
            bgcolor: "#FCFDFC",
            borderColor: style.main,
          },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1, sm: 1.25 },
            "&:last-child": {
              pb: { xs: 1, sm: 1.25 },
            },
          }}
        >
          {/* =================================================
              MAIN MEMBER ROW
          ================================================= */}

          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.8, sm: 1.2 }}
          >
            {/* LEVEL-COLOURED AVATAR */}
            <Avatar
              sx={{
                width: { xs: 34, sm: 40 },
                height: { xs: 34, sm: 40 },
                minWidth: { xs: 34, sm: 40 },
                bgcolor: style.main,
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                borderRadius: 0,
                flexShrink: 0,
              }}
            >
              {memberInitial}
            </Avatar>

            {/* MEMBER INFORMATION */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                sx={{ minWidth: 0 }}
              >
                <Typography
                  sx={{
                    color: "#1F2937",
                    fontSize: { xs: "11px", sm: "13px" },
                    lineHeight: 1.2,
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                  }}
                >
                  {memberName}
                </Typography>

                <Chip
                  size="small"
                  label={`Level ${level}`}
                  icon={
                    <AccountTree
                      sx={{ fontSize: "11px !important" }}
                    />
                  }
                  sx={{
                    height: 19,
                    borderRadius: 0,
                    bgcolor: style.light,
                    color: style.text,
                    border: `1px solid ${style.border}`,
                    fontSize: "8px",
                    fontWeight: 700,
                    flexShrink: 0,
                    "& .MuiChip-icon": {
                      color: style.main,
                    },
                    "& .MuiChip-label": {
                      px: 0.5,
                    },
                  }}
                />
              </Stack>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: { xs: "8px", sm: "9px" },
                  lineHeight: 1.25,
                  fontWeight: 600,
                  color: style.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Member ID: {member.userId || "-"}
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: { xs: "8px", sm: "9px" },
                  lineHeight: 1.25,
                  color: "#6B7280",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Referral: {member.referralCode || "-"}
              </Typography>
            </Box>

            {/* CHILD COUNT + EXPAND */}
            <Stack
              alignItems="center"
              spacing={0.4}
              sx={{ flexShrink: 0 }}
            >
              <Chip
                icon={
                  <People
                    sx={{
                      color: "#FFFFFF !important",
                      fontSize: "12px !important",
                    }}
                  />
                }
                label={children.length}
                size="small"
                sx={{
                  height: 20,
                  minWidth: { xs: 30, sm: 36 },
                  borderRadius: 0,
                  bgcolor: style.main,
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "8px",
                  "& .MuiChip-label": {
                    px: 0.5,
                  },
                  "& .MuiChip-icon": {
                    ml: 0.4,
                    mr: -0.2,
                  },
                }}
              />

              {children.length > 0 && (
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpen((previous) => !previous);
                  }}
                  sx={{
                    width: 25,
                    height: 25,
                    p: 0,
                    borderRadius: 0,
                    color: style.main,
                    bgcolor: style.light,
                    border: `1px solid ${style.border}`,
                    "&:hover": {
                      bgcolor: style.main,
                      color: "#FFFFFF",
                    },
                    "& svg": {
                      fontSize: 15,
                    },
                  }}
                >
                  {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </Stack>
          </Stack>

          {/* =================================================
              LEVEL INFORMATION STRIP
          ================================================= */}

          <Box
            sx={{
              mt: 0.8,
              px: 0.8,
              py: 0.4,
              borderRadius: 0,
              bgcolor: style.light,
              borderLeft: `3px solid ${style.main}`,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "8px", sm: "9px" },
                lineHeight: 1.25,
                fontWeight: 600,
                color: style.text,
              }}
            >
              {level === 1 ? "Direct Referral" : `Level ${level} Referral`}
              {" • "}
              {children.length} direct{" "}
              {children.length === 1 ? "member" : "members"}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* =====================================================
          CHILDREN (LAZY-MOUNTED ON EXPAND FOR 100-LEVEL SPEED)
      ===================================================== */}

      {children.length > 0 && (
        <Collapse in={open} timeout={200} unmountOnExit>
          <Box sx={{ mt: 0 }}>
            {children.map((child) => (
              <ReferralNode
                key={child._id || child.id || child.userId}
                member={child}
                onSelect={onSelect}
                expandMode={expandMode}
                expandSignal={expandSignal}
                isSearching={isSearching}
                level={level + 1}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

export default ReferralNode;