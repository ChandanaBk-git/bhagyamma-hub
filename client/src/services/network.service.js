
import API from "../api";

// =====================================================
// GET LOGGED-IN MEMBER NETWORK
// Backend route: GET /api/v1/user/my-network
// =====================================================

export const getMyNetwork = async () => {
  const response = await API.get("/user/my-network");
  return response.data.data;
};

// =====================================================
// GET REFERRAL TREE
// Backend route: GET /api/v1/user/referral-tree
// =====================================================

export const getReferralTree = async () => {
  const response = await API.get("/user/referral-tree");
  return response.data.data;
};

// =====================================================
// SEARCH MEMBERS IN THE LOADED NETWORK
// The backend has no dedicated network-search endpoint,
// so search the existing network data without adding
// an unsupported API route.
// =====================================================

export const searchNetwork = async (keyword) => {
  const query = String(keyword || "").trim().toLowerCase();

  if (!query) {
    return [];
  }

  const data = await getMyNetwork();
  const members = [];
  const visited = new Set();

  const visit = (member) => {
    if (!member || typeof member !== "object") return;

    const id = String(member._id || member.id || "");

    if (id && visited.has(id)) return;
    if (id) visited.add(id);

    const searchableText = [
      member.name,
      member.email,
      member.mobile,
      member.userId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (searchableText.includes(query)) {
      members.push(member);
    }

    if (Array.isArray(member.children)) {
      member.children.forEach(visit);
    }
  };

  const network = Array.isArray(data)
    ? data
    : Array.isArray(data?.network)
      ? data.network
      : [];

  network.forEach(visit);

  return members;
};

// =====================================================
// GET MEMBER DETAILS
// Backend route: GET /api/v1/user/:id
// =====================================================

export const getMemberDetails = async (memberId) => {
  if (!memberId) {
    throw new Error("Member ID is required");
  }

  const response = await API.get(
    `/user/${encodeURIComponent(memberId)}`
  );

  return response.data.data;
};
