import { useEffect, useMemo, useState } from "react";

import {
  getReferralTree as getAdminTree,
} from "../../services/admin.service";

import {
  getReferralTree as getManagerTree,
} from "../../services/manager.service";

import {
  Box,
  Button,
} from "@mui/material";

import ReferralNode from "./ReferralNode";
import MemberDetailsModal from "./MemberDetailsModal";
import ReferralDashboard from "./ReferralDashboard";
import "./ReferralTree.css";
const ReferralTree = ({ role = "admin" }) => {
  const [tree, setTree] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalMembers: 0,
    managers: 0,
    levels: 0,
  });

  const [expandAll, setExpandAll] = useState(true);

  useEffect(() => {
    loadTree();
  }, []);

  // ==============================
  // Count Members
  // ==============================

  const countMembers = (nodes = []) => {
    let count = 0;

    const traverse = (list) => {
      list.forEach((node) => {
        count++;

        if (node.children?.length) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);

    return count;
  };

  // ==============================
  // Calculate Levels
  // ==============================

  const calculateLevels = (node) => {
    if (!node.children || node.children.length === 0) {
      return 1;
    }

    return (
      1 +
      Math.max(
        ...node.children.map((child) =>
          calculateLevels(child)
        )
      )
    );
  };

  // ==============================
  // Load Tree
  // ==============================

  const loadTree = async () => {
    try {
      const response =
        role === "admin"
          ? await getAdminTree()
          : await getManagerTree();

      console.log("Referral Tree", response);

      if (!response.success) return;

      setTree(response.data);

      setStats({
        totalMembers: countMembers(response.data),

        managers: response.data.filter(
          (item) => item.role === "MANAGER"
        ).length,

        levels:
          response.data.length > 0
            ? Math.max(
                ...response.data.map((item) =>
                  calculateLevels(item)
                )
              )
            : 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ==============================
  // View Member
  // ==============================

  const handleView = (member) => {
    setSelectedMember(member);
    setOpenModal(true);
  };

  // ==============================
  // Search Tree
  // ==============================

  const filterTree = (nodes, keyword) => {
    if (!keyword) return nodes;

    return nodes
      .map((node) => {
        const children = filterTree(
          node.children || [],
          keyword
        );

        const matched =
          node.name
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          node.userId
            ?.toLowerCase()
            .includes(keyword.toLowerCase()) ||
          node.referralCode
            ?.toLowerCase()
            .includes(keyword.toLowerCase());

        if (matched || children.length > 0) {
          return {
            ...node,
            children,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const filteredTree = useMemo(() => {
    return filterTree(tree, search);
  }, [tree, search]);
  return (
    <>
      <ReferralDashboard
        stats={stats}
        search={search}
        setSearch={setSearch}
        expandAll={() => setExpandAll(true)}
        collapseAll={() => setExpandAll(false)}
      />

      <div className="tree-wrapper">
        {filteredTree.length === 0 ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "80px",
              fontSize: "22px",
              color: "#666",
              fontWeight: 600,
            }}
          >
            No Members Found
          </div>
        ) : (
          filteredTree.map((member) => (
            <ReferralNode
              key={member._id}
              member={member}
              onView={handleView}
              expandAll={expandAll}
            />
          ))
        )}
      </div>

      <MemberDetailsModal
        open={openModal}
        member={selectedMember}
        onClose={() => {
          setOpenModal(false);
          setSelectedMember(null);
        }}
      />
    </>
  );
};

export default ReferralTree;