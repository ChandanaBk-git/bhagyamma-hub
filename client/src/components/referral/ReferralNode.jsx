import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaEye,
  FaUser,
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

        <div className="avatar">
          <FaUser />
        </div>

        <h3>{member.name}</h3>

        <div className={`role ${member.role}`}>
          {member.role.replace("_", " ")}
        </div>

        <div className="user-id">
          {member.userId}
        </div>

        <div className="referral-id">
          {member.referralCode}
        </div>

        <p className="member-count">
          Direct Members :
          <strong>
            {" "}
            {member.children?.length || 0}
          </strong>
        </p>

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
        member.children &&
        member.children.length > 0 && (

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