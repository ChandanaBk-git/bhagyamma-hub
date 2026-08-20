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

  const [expanded, setExpanded] =
    useState(expandAll);

  useEffect(() => {

    setExpanded(
      expandAll
    );

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

  const colors =
    getLevelColor();

  const children =
    Array.isArray(
      member?.children
    )
      ? member.children
      : [];

  const isManager =
    member?.role === "MANAGER" ||
    level === 0;

  return (
    <div className="tree-node">

      <div
        className="member-card"
        style={{
          borderTop:
            `5px solid ${colors.primary}`,
        }}
      >

        {/* ============================================
            AVATAR
        ============================================ */}

        <div
          className="avatar"
          style={{
            background:
              `linear-gradient(
                135deg,
                ${colors.primary},
                ${colors.secondary}
              )`,
          }}
        >

          <FaUserCircle />

        </div>

        {/* ============================================
            ROLE
        ============================================ */}

        <div
          style={{
            background:
              colors.soft,

            color:
              colors.text,

            padding:
              "5px 12px",

            borderRadius:
              "999px",

            fontSize:
              "12px",

            fontWeight:
              700,

            marginBottom:
              "10px",
          }}
        >

          {isManager
            ? "MANAGER"
            : `LEVEL ${level}`}

        </div>

        {/* ============================================
            NAME
        ============================================ */}

        <h3 className="member-name">

          {member?.name ||
            "Unknown Member"}

        </h3>

        {/* ============================================
            USER ID
        ============================================ */}

        <div className="user-id">

          <strong>
            User ID
          </strong>

          <br />

          {member?.userId ||
            "N/A"}

        </div>

        {/* ============================================
            REFERRAL CODE
        ============================================ */}

        <div
          className="referral-id"
          style={{
            background:
              colors.soft,

            color:
              colors.text,
          }}
        >

          {member?.referralCode ||
            "No Referral Code"}

        </div>

        {/* ============================================
            DIRECT MEMBERS
        ============================================ */}

        <div className="direct-members">

          <FaUsers
            style={{
              color:
                colors.primary,
            }}
          />

          <span>
            Direct Members
          </span>

          <strong
            style={{
              color:
                colors.primary,
            }}
          >
            {children.length}
          </strong>

        </div>

        {/* ============================================
            STATUS
        ============================================ */}

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "15px",
            fontSize: "13px",
          }}
        >

          <span>
            Status
          </span>

          <strong
            style={{
              color:
                member?.isActive === false
                  ? "#DC2626"
                  : "#16A34A",
            }}
          >

            {member?.isActive === false
              ? "Inactive"
              : "Active"}

          </strong>

        </div>

        {/* ============================================
            BUTTONS
        ============================================ */}

        <div className="card-buttons">

          <button
            className="view-btn"
            style={{
              background:
                `linear-gradient(
                  135deg,
                  ${colors.primary},
                  ${colors.secondary}
                )`,
            }}
            onClick={() =>
              onView(member)
            }
          >

            <FaEye />

            View Details

          </button>

          {children.length > 0 && (

            <button
              className="expand-btn"
              style={{
                color:
                  colors.primary,
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
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}

            </button>

          )}

        </div>

      </div>

      {/* ============================================
          CHILDREN
      ============================================ */}

      {expanded &&
        children.length > 0 && (

          <div className="children-wrapper">

            <div
              className="vertical-line"
              style={{
                background:
                  colors.primary,
              }}
            />

            <div className="children">

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