import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getReferralTree as getAdminTree,
} from "../../services/admin.service";

import {
  getReferralTree as getManagerTree,
} from "../../services/manager.service";

import ReferralNode from "./ReferralNode";
import MemberDetailsModal from "./MemberDetailsModal";
import ReferralDashboard from "./ReferralDashboard";

import "./ReferralTree.css";

const ReferralTree = ({
  role = "admin",
}) => {
  const [tree, setTree] = useState([]);

  const [selectedMember, setSelectedMember] =
    useState(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [stats, setStats] = useState({
    totalMembers: 0,
    managers: 0,
    levels: 0,
  });

  const [expandAll, setExpandAll] =
    useState(true);

  // =====================================================
  // LOAD TREE
  // =====================================================

  useEffect(() => {
    loadTree();
  }, [role]);

  // =====================================================
  // COUNT MEMBERS
  // =====================================================

  const countMembers = (nodes = []) => {
    let count = 0;

    const traverse = (list = []) => {
      list.forEach((node) => {
        if (node?.role === "MEMBER") {
          count += 1;
        }

        if (Array.isArray(node.children)) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);

    return count;
  };

  // =====================================================
  // COUNT MANAGERS
  // =====================================================

  const countManagers = (nodes = []) => {
    let count = 0;

    const traverse = (list = []) => {
      list.forEach((node) => {
        if (node?.role === "MANAGER") {
          count += 1;
        }

        if (Array.isArray(node.children)) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);

    return count;
  };

  // =====================================================
  // LEVEL CALCULATION
  // =====================================================

  const calculateLevels = (node) => {
    if (
      !node?.children ||
      node.children.length === 0
    ) {
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

  const calculateTreeLevels = (nodes = []) => {
    if (!nodes.length) {
      return 0;
    }

    return Math.max(
      ...nodes.map((node) =>
        calculateLevels(node)
      )
    );
  };

  // =====================================================
  // LOAD REFERRAL TREE
  // =====================================================

  const loadTree = async () => {
    try {
      const response =
        role === "admin"
          ? await getAdminTree()
          : await getManagerTree();

      console.log(
        "REFERRAL TREE RESPONSE:",
        response
      );

      if (!response?.success) {
        console.error(
          "Referral tree API failed:",
          response
        );

        setTree([]);

        return;
      }

      // =================================================
      // NORMALIZE RESPONSE
      // =================================================

      const rawData = response?.data;

      const treeData =
        Array.isArray(rawData)
          ? rawData
          : rawData
            ? [rawData]
            : [];

      console.log(
        "NORMALIZED REFERRAL TREE:",
        treeData
      );

      // =================================================
      // CHECK ROOT
      // =================================================

      const root = treeData[0];

      console.log(
        "REFERRAL TREE ROOT:",
        {
          name: root?.name,
          userId: root?.userId,
          role: root?.role,
          children:
            root?.children?.length || 0,
        }
      );

      setTree(treeData);

      // =================================================
      // STATISTICS
      // =================================================

      const totalMembers =
        countMembers(treeData);

      const managers =
        countManagers(treeData);

      const levels =
        calculateTreeLevels(treeData);

      setStats({
        totalMembers,
        managers,
        levels,
      });

      console.log(
        "REFERRAL STATISTICS:",
        {
          totalMembers,
          managers,
          levels,
        }
      );
    } catch (error) {
      console.error(
        "REFERRAL TREE ERROR:",
        error
      );

      setTree([]);
    }
  };

  // =====================================================
  // VIEW MEMBER
  // =====================================================

  const handleView = (member) => {
    setSelectedMember(member);
    setOpenModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMember(null);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filterTree = (
    nodes = [],
    keyword = ""
  ) => {
    if (!keyword) {
      return nodes;
    }

    const normalizedKeyword =
      keyword.toLowerCase().trim();

    return nodes
      .map((node) => {
        const children = filterTree(
          node.children || [],
          normalizedKeyword
        );

        const nameMatch =
          node.name
            ?.toLowerCase()
            .includes(normalizedKeyword);

        const userIdMatch =
          node.userId
            ?.toLowerCase()
            .includes(normalizedKeyword);

        const referralMatch =
          node.referralCode
            ?.toLowerCase()
            .includes(normalizedKeyword);

        const mobileMatch =
          node.mobile
            ?.toString()
            .includes(normalizedKeyword);

        const matched =
          nameMatch ||
          userIdMatch ||
          referralMatch ||
          mobileMatch;

        if (
          matched ||
          children.length > 0
        ) {
          return {
            ...node,
            children,
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  // =====================================================
  // FILTERED TREE
  // =====================================================

  const filteredTree = useMemo(() => {
    return filterTree(
      tree,
      search
    );
  }, [tree, search]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "0",
        margin: "0",
      }}
    >
      {/* =================================================
          DASHBOARD
      ================================================= */}

      <ReferralDashboard
        stats={stats}
        search={search}
        setSearch={setSearch}
        expandAll={() =>
          setExpandAll(true)
        }
        collapseAll={() =>
          setExpandAll(false)
        }
      />

      {/* =================================================
          TREE
      ================================================= */}

      <div
        className="tree-wrapper"
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: "10px",
          padding: "0",
          overflowX: "auto",
          overflowY: "visible",
        }}
      >
        {filteredTree.length === 0 ? (
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              textAlign: "center",
              padding: "35px 15px",
              fontSize: "13px",
              color: "#666",
              fontWeight: 600,
              border:
                "1px solid #E0E0E0",
              background: "#FFFFFF",
            }}
          >
            No Referral Members Found
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {filteredTree.map(
              (member) => (
                <ReferralNode
                  key={
                    member._id ||
                    member.id ||
                    member.userId
                  }
                  member={member}
                  onView={handleView}
                  expandAll={expandAll}
                  level={0}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* =================================================
          MEMBER DETAILS MODAL
      ================================================= */}

      <MemberDetailsModal
        open={openModal}
        member={selectedMember}
        onClose={
          handleCloseModal
        }
      />
    </div>
  );
};

export default ReferralTree;