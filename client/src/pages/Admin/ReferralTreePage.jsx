import ReferralTree from "../../components/referral/ReferralTree";

const ReferralTreePage = () => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        margin: 0,
        padding: "12px 8px 20px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* Page Title */}
      <h2
        style={{
          margin: "0 0 12px 0",
          padding: 0,
          fontSize: "21px",
          lineHeight: "26px",
          fontWeight: 700,
          color: "#292929",
        }}
      >
        Referral Tree
      </h2>

      {/* Referral Tree Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          margin: 0,
          padding: "12px",
          boxSizing: "border-box",

          backgroundColor: "#FFFFFF",

          border: "1px solid #D9D9D9",

          borderRadius: "12px",

          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.04)",

          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <ReferralTree role="admin" />
      </div>
    </div>
  );
};

export default ReferralTreePage;