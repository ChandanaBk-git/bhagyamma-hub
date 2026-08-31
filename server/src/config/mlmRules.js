const MLM_RULES = {
  membership: {
    amount: 2000,
    sellingPoints: 40,
  },

  sellingPoints: {
    rupeesPerHundred: 100,
    pointsPerHundred: 2,
  },

  referralCommission: {
    level1: 20,
    level2: 5,
    level3Plus: 1,
  },

  purchaseDiscount: {
    member: 20,
    supervisor: 50,
  },

  supervisor: {
    requiredSellingPoints: 500,
    sponsorIncentive: 1000,
  },
};

module.exports = MLM_RULES;