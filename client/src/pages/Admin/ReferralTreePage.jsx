import ReferralTree from "../../components/referral/ReferralTree";

const ReferralTreePage = () => {
  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Referral Tree</h2>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <ReferralTree role="admin" />
        </div>
      </div>
    </div>
  );
};

export default ReferralTreePage;