import { useEffect, useState } from "react";

import {
  FaChevronDown,
  FaChevronRight,
  FaEye,
  FaUser,
  FaPhoneAlt,
  FaUsers,
  FaBoxOpen,
  FaMoneyBillWave,
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
          <FaUser />
        </div>

        {/* Name */}

        <h3>{member.name}</h3>

        {/* Role */}

        <div className={`role ${member.role}`}>
          {member.role.replace("_", " ")}
        </div>

        {/* User ID */}

        <div className="user-id">
          {member.userId}
        </div>

        {/* Referral Code */}

        <div className="referral-id">
          {member.referralCode}
        </div>

        {/* Information */}

        <div className="member-info">

          <div className="info-row">
            <span>
              <FaPhoneAlt />
              Mobile
            </span>

            <strong>
              {member.mobile || "-"}
            </strong>
          </div>

          <div className="info-row">
            <span>
              <FaMoneyBillWave />
              Payment
            </span>

            <span
              className={`status payment ${member.paymentStatus}`}
            >
              {member.paymentStatus || "Pending"}
            </span>
          </div>

          <div className="info-row">
            <span>
              <FaBoxOpen />
              Welcome Kit
            </span>

            <span
              className={`status welcome ${member.welcomeKitStatus}`}
            >
              {member.welcomeKitStatus || "Pending"}
            </span>
          </div>

          <div className="info-row">
            <span>
              <FaUsers />
              Direct Members
            </span>

            <strong>
              {member.children?.length || 0}
            </strong>
          </div>

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