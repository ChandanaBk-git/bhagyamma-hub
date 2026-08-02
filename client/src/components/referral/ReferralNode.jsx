import { useEffect, useState } from "react";
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
}) => {
  const [expanded, setExpanded] = useState(expandAll);

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  return (
    <div className="tree-node">

      <div className="member-card">

        {/* Avatar */}

        <div className="avatar">
          <FaUserCircle />
        </div>

        {/* Name */}

        <h3 className="member-name">
          {member.name}
        </h3>

        {/* User ID */}

        <div className="user-id">
          {member.userId}
        </div>

        {/* Referral Code */}

        <div className="referral-id">
          {member.referralCode}
        </div>

        {/* Direct Members */}

        <div className="direct-members">
          <FaUsers />

          <span>
            Direct Members
          </span>

          <strong>
            {member.children?.length || 0}
          </strong>
        </div>

        {/* Buttons */}

        <div className="card-buttons">

          <button
            className="view-btn"
            onClick={() => onView(member)}
          >
            <FaEye />
            View Details
          </button>

          {member.children?.length > 0 && (

            <button
              className="expand-btn"
              onClick={() =>
                setExpanded(!expanded)
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

      {expanded &&
        member.children?.length > 0 && (

          <div className="children-wrapper">

            <div className="vertical-line" />

            <div className="children">

              {member.children.map((child) => (

                <ReferralNode
                  key={child._id}
                  member={child}
                  onView={onView}
                  expandAll={expandAll}
                />

              ))}

            </div>

          </div>

      )}

    </div>
  );
};

export default ReferralNode;