import {
  useEffect,
  useState,
} from "react";

import {
  FaChevronDown,
  FaChevronRight,
  FaEye,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";

const ReferralNode = ({
  member,
  onView,
  expandAll,
  level = 0,
}) => {
  const [expanded, setExpanded] = useState(expandAll);

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  // =====================================================
  // LEVEL COLORS
  // =====================================================

  const getLevelColor = () => {
    if (
      member?.role === "MANAGER" ||
      level === 0
    ) {
      return {
        primary: "#111827",
        secondary: "#1F2937",
        soft: "#E5E7EB",
        text: "#111827",
      };
    }

    if (level === 1) {
      return {
        primary: "#15803D",
        secondary: "#166534",
        soft: "#DCFCE7",
        text: "#166534",
      };
    }

    if (level === 2) {
      return {
        primary: "#2563EB",
        secondary: "#1D4ED8",
        soft: "#DBEAFE",
        text: "#1D4ED8",
      };
    }

    if (level === 3) {
      return {
        primary: "#EA580C",
        secondary: "#C2410C",
        soft: "#FFEDD5",
        text: "#C2410C",
      };
    }

    if (level === 4) {
      return {
        primary: "#7C3AED",
        secondary: "#6D28D9",
        soft: "#EDE9FE",
        text: "#6D28D9",
      };
    }

    return {
      primary: "#DB2777",
      secondary: "#BE185D",
      soft: "#FCE7F3",
      text: "#BE185D",
    };
  };

  const colors = getLevelColor();

  const children =
    Array.isArray(member?.children)
      ? member.children
      : [];

  const isManager =
    member?.role === "MANAGER" ||
    level === 0;

  return (
    <div
      className="tree-node"
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          MEMBER CARD
      ================================================= */}

      <div
        className="member-card"
        style={{
          width: "100%",
          boxSizing: "border-box",

          background: "#FFFFFF",

          border:
            "1px solid #E0E0E0",

          borderTop:
            `3px solid ${colors.primary}`,

          borderRadius: 0,

          boxShadow: "none",

          padding: "10px",

          margin: 0,

          transition:
            "border-color 0.2s ease",

          overflow: "hidden",
        }}
      >
        {/* =================================================
            TOP ROW
        ================================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          {/* AVATAR */}

          <div
            className="avatar"
            style={{
              width: "34px",
              height: "34px",

              minWidth: "34px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                `linear-gradient(
                  135deg,
                  ${colors.primary},
                  ${colors.secondary}
                )`,

              color: "#FFFFFF",

              borderRadius: 0,

              fontSize: "18px",
            }}
          >
            <FaUserCircle />
          </div>

          {/* ROLE */}

          <div
            style={{
              background:
                colors.soft,

              color:
                colors.text,

              padding:
                "4px 7px",

              borderRadius: 0,

              fontSize:
                "8px",

              lineHeight: 1.2,

              fontWeight: 700,

              whiteSpace: "nowrap",

              textAlign: "center",
            }}
          >
            {isManager
              ? "MANAGER"
              : `LEVEL ${level}`}
          </div>
        </div>

        {/* =================================================
            NAME
        ================================================= */}

        <h3
          className="member-name"
          style={{
            margin:
              "0 0 4px",

            fontSize:
              "13px",

            lineHeight: 1.25,

            fontWeight: 700,

            color:
              "#111827",

            wordBreak:
              "break-word",
          }}
        >
          {member?.name ||
            "Unknown Member"}
        </h3>

        {/* =================================================
            USER ID
        ================================================= */}

        <div
          className="user-id"
          style={{
            marginBottom:
              "6px",

            fontSize:
              "9px",

            lineHeight: 1.4,

            color:
              "#6B7280",

            wordBreak:
              "break-word",
          }}
        >
          <strong
            style={{
              color:
                "#374151",
            }}
          >
            User ID
          </strong>

          <br />

          {member?.userId ||
            "N/A"}
        </div>

        {/* =================================================
            REFERRAL CODE
        ================================================= */}

        <div
          className="referral-id"
          style={{
            background:
              colors.soft,

            color:
              colors.text,

            padding:
              "5px 7px",

            marginBottom:
              "7px",

            borderRadius: 0,

            fontSize:
              "9px",

            fontWeight: 600,

            lineHeight: 1.2,

            wordBreak:
              "break-word",

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",
          }}
        >
          {member?.referralCode ||
            "No Referral Code"}
        </div>

        {/* =================================================
            DIRECT MEMBERS
        ================================================= */}

        <div
          className="direct-members"
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "5px",

            width: "100%",

            marginBottom:
              "7px",

            fontSize:
              "9px",

            lineHeight: 1.3,

            color:
              "#6B7280",
          }}
        >
          <FaUsers
            style={{
              color:
                colors.primary,

              fontSize:
                "12px",

              flexShrink: 0,
            }}
          />

          <span
            style={{
              flex: 1,
            }}
          >
            Direct Members
          </span>

          <strong
            style={{
              color:
                colors.primary,

              fontSize:
                "10px",
            }}
          >
            {children.length}
          </strong>
        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        <div
          style={{
            width: "100%",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap: "8px",

            marginBottom:
              "8px",

            fontSize:
              "9px",

            lineHeight: 1.3,
          }}
        >
          <span
            style={{
              color:
                "#6B7280",
            }}
          >
            Status
          </span>

          <strong
            style={{
              color:
                member?.isActive === false
                  ? "#DC2626"
                  : "#16A34A",

              fontSize:
                "9px",
            }}
          >
            {member?.isActive === false
              ? "Inactive"
              : "Active"}
          </strong>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div
          className="card-buttons"
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: "5px",

            width: "100%",
          }}
        >
          {/* VIEW BUTTON */}

          <button
            className="view-btn"
            style={{
              flex: 1,

              minWidth: 0,

              minHeight:
                "30px",

              padding:
                "5px 7px",

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap: "5px",

              border: "none",

              borderRadius: 0,

              background:
                `linear-gradient(
                  135deg,
                  ${colors.primary},
                  ${colors.secondary}
                )`,

              color:
                "#FFFFFF",

              fontSize:
                "9px",

              fontWeight: 600,

              cursor: "pointer",

              boxShadow:
                "none",

              whiteSpace:
                "nowrap",
            }}
            onClick={() =>
              onView(member)
            }
          >
            <FaEye
              style={{
                fontSize:
                  "11px",
              }}
            />

            View Details
          </button>

          {/* EXPAND BUTTON */}

          {children.length > 0 && (
            <button
              className="expand-btn"
              style={{
                width:
                  "30px",

                height:
                  "30px",

                minWidth:
                  "30px",

                padding: 0,

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                border:
                  `1px solid ${colors.primary}`,

                borderRadius: 0,

                background:
                  "#FFFFFF",

                color:
                  colors.primary,

                cursor:
                  "pointer",

                boxShadow:
                  "none",
              }}
              onClick={() =>
                setExpanded(
                  (previous) =>
                    !previous
                )
              }
              aria-label={
                expanded
                  ? "Collapse"
                  : "Expand"
              }
            >
              {expanded ? (
                <FaChevronDown
                  style={{
                    fontSize:
                      "11px",
                  }}
                />
              ) : (
                <FaChevronRight
                  style={{
                    fontSize:
                      "11px",
                  }}
                />
              )}
            </button>
          )}
        </div>
      </div>

      {/* =================================================
          CHILDREN
      ================================================= */}

      {expanded &&
        children.length > 0 && (
          <div
            className="children-wrapper"
            style={{
              display: "flex",

              width: "100%",

              boxSizing:
                "border-box",

              marginTop:
                "8px",

              paddingLeft:
                "10px",
            }}
          >
            {/* VERTICAL LINE */}

            <div
              className="vertical-line"
              style={{
                width:
                  "1px",

                minWidth:
                  "1px",

                background:
                  colors.primary,

                opacity:
                  0.55,

                marginRight:
                  "8px",
              }}
            />

            {/* CHILDREN */}

            <div
              className="children"
              style={{
                flex: 1,

                minWidth: 0,

                display: "flex",

                flexDirection:
                  "column",

                gap: "8px",
              }}
            >
              {children.map(
                (child) => (
                  <ReferralNode
                    key={
                      child._id ||
                      child.id ||
                      child.userId
                    }
                    member={child}
                    onView={onView}
                    expandAll={
                      expandAll
                    }
                    level={
                      level + 1
                    }
                  />
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default ReferralNode;