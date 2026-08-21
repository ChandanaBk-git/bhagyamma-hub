const User =
  require("../models/user.model");
const mongoose = require("mongoose");
const Wallet =
  require("../models/wallet.model");

const Order =
  require("../models/order.model");

const Product =
  require("../models/product");

const ApiError =
  require("../utils/ApiError");

const walletRepository =
  require("../repositories/wallet.repository");

const walletTransactionRepository =
  require("../repositories/walletTransaction.repository");

const withdrawRepository =
  require("../repositories/withdraw.repository");

const commissionRepository =
  require("../repositories/commission.repository");

const sellingPointRepository =
  require("../repositories/sellingPoint.repository");

const orderRepository =
  require("../repositories/order.repository");


// =====================================================
// HELPERS
// =====================================================

const money = (value) =>
  Number(value || 0);


const isPaid = (status) =>
  String(status || "").toUpperCase() ===
  "PAID";


const isMember = (user) =>
  String(user?.role || "").toUpperCase() ===
  "MEMBER";


// =====================================================
// BUILD MANAGER MEMBER NETWORK
// =====================================================
//
// Includes:
//
// 1. Members directly assigned to manager
// 2. Members under manager through sponsorId
//
// Duplicate members are removed.
//
// =====================================================

const getManagerMembers = (
  users,
  managerId
) => {

  const managerIdString =
    String(managerId);

  const result =
    new Map();


  // ---------------------------------------------------
  // DIRECT MANAGER MEMBERS
  // ---------------------------------------------------

  users
    .filter(
      (user) =>
        isMember(user) &&
        String(
          user.managerId || ""
        ) === managerIdString
    )
    .forEach(
      (user) => {

        result.set(
          String(user._id),
          user
        );

      }
    );


  // ---------------------------------------------------
  // REFERRAL NETWORK
  // ---------------------------------------------------

  const queue = [
    managerIdString,
  ];

  const visited =
    new Set();


  while (
    queue.length > 0
  ) {

    const parentId =
      queue.shift();


    if (
      visited.has(parentId)
    ) {

      continue;

    }


    visited.add(
      parentId
    );


    users
      .filter(
        (user) =>
          String(
            user.sponsorId || ""
          ) === parentId
      )
      .forEach(
        (child) => {

          const childId =
            String(child._id);


          if (
            isMember(child)
          ) {

            result.set(
              childId,
              child
            );

          }


          if (
            !visited.has(childId)
          ) {

            queue.push(
              childId
            );

          }

        }
      );

  }


  return Array.from(
    result.values()
  );

};


// =====================================================
// GET MANAGER DASHBOARD
// =====================================================
//
// Dashboard shows:
//
// 1. Total Members
// 2. Total Commission earned by MANAGER
// 3. Total Orders from manager + managed members
// 4. Total Sales from manager + managed members
// 5. Total Products
// 6. Pending KYC
//
// IMPORTANT:
//
// The Manager Orders page is already working.
//
// It uses:
//
//     managerId + all managed member IDs
//
// This dashboard now uses the SAME logic.
//
// =====================================================

const getDashboard = async (
  managerId
) => {

  // ===================================================
  // VALIDATE MANAGER ID
  // ===================================================

  if (!managerId) {

    throw new ApiError(
      400,
      "Manager ID is required."
    );

  }


  // ===================================================
  // GET MANAGER
  // ===================================================

  const manager =
    await User.findById(
      managerId
    )
      .select(
        [
          "_id",
          "name",
          "userId",
          "role",
          "isActive",
        ].join(" ")
      )
      .lean();


  if (!manager) {

    throw new ApiError(
      404,
      "Manager not found."
    );

  }


  // ===================================================
  // GET ALL USERS
  // ===================================================

  const users =
    await User.find()
      .select(
        [
          "_id",
          "name",
          "userId",
          "email",
          "mobile",
          "role",
          "referralCode",
          "sponsorId",
          "managerId",
          "isActive",
          "kycStatus",
          "paymentStatus",
          "welcomeKitStatus",
          "sellingPoints",
          "lifetimePurchase",
          "createdAt",
        ].join(" ")
      )
      .lean();


  // ===================================================
  // GET MANAGED MEMBERS
  // ===================================================
  //
  // Uses the SAME getManagerMembers()
  // already used by your working member pages.
  //
  // Your network currently contains 23 members.
  //
  // ===================================================

  const members =
    getManagerMembers(
      users,
      managerId
    );


  // ===================================================
  // MEMBER IDS
  // ===================================================

  const memberIds =
    members.map(
      (member) =>
        member._id
    );


  // ===================================================
  // MEMBER COUNTS
  // ===================================================

  const totalMembers =
    members.length;


  const activeMembers =
    members.filter(
      (member) =>
        member.isActive !== false
    ).length;


  const pendingKyc =
    members.filter(
      (member) => {

        const status =
          String(
            member.kycStatus || ""
          )
            .trim()
            .toUpperCase();


        return (
          status !== "VERIFIED"
        );

      }
    ).length;


  // ===================================================
  // MANAGER COMMISSION
  // ===================================================
  //
  // IMPORTANT:
  //
  // This is ONLY the commission earned by the manager
  // when members join the manager's network.
  //
  // DO NOT add member commissions here.
  //
  // ===================================================

  const managerCommissions =
    await commissionRepository.findByReceivers(
      [
        managerId,
      ]
    );


  const totalCommission =
    managerCommissions.reduce(
      (
        total,
        commission
      ) =>
        total +
        money(
          commission.commissionAmount ??
          commission.amount ??
          0
        ),
      0
    );


  const paidCommission =
    managerCommissions
      .filter(
        (commission) =>
          [
            "PAID",
            "COMPLETED",
          ].includes(
            String(
              commission.status || ""
            ).toUpperCase()
          )
      )
      .reduce(
        (
          total,
          commission
        ) =>
          total +
          money(
            commission.commissionAmount ??
            commission.amount ??
            0
          ),
        0
      );


  const pendingCommission =
    Math.max(
      totalCommission -
      paidCommission,
      0
    );


  // ===================================================
  // IMPORTANT ORDER FIX
  // ===================================================
  //
  // The working Manager Orders page uses:
  //
  //     managerId
  //     +
  //     all managed member IDs
  //
  // We MUST use the same IDs here.
  //
  // Otherwise the dashboard can show:
  //
  // Orders = 0
  //
  // while Orders page shows:
  //
  // Orders = 1
  //
  // ===================================================


  const networkIds = [

    managerId,

    ...memberIds,

  ];


  // ===================================================
  // REMOVE DUPLICATES
  // ===================================================

  const uniqueIds = [

    ...new Set(

      networkIds.map(
        (id) =>
          String(id)
      )

    ),

  ];


  // ===================================================
  // CONVERT TO OBJECT IDS
  // ===================================================
  //
  // Order.userId is ObjectId.
  //
  // Therefore use ObjectId values in the query.
  //
  // ===================================================

  const objectIds =
    uniqueIds
      .filter(
        (id) =>
          mongoose.Types.ObjectId.isValid(
            id
          )
      )
      .map(
        (id) =>
          new mongoose.Types.ObjectId(
            id
          )
      );


  // ===================================================
  // GET ORDERS
  // ===================================================

  let orders = [];


  if (
    objectIds.length > 0
  ) {

    orders =
      await Order.find({

        userId: {
          $in:
            objectIds,
        },

      })
        .select(
          [
            "_id",
            "userId",
            "orderNumber",
            "merchantOrderId",
            "finalAmount",
            "sellingPoints",
            "paymentStatus",
            "status",
            "createdAt",
            "paidAt",
          ].join(" ")
        )
        .sort({
          createdAt: -1,
        })
        .lean();

  }


  // ===================================================
  // TOTAL ORDERS
  // ===================================================

  const totalOrders =
    orders.length;


  // ===================================================
  // TOTAL SALES
  // ===================================================
  //
  // Uses finalAmount.
  //
  // Example:
  //
  // Order = ₹539
  //
  // Dashboard:
  //
  // Total Orders = 1
  // Total Sales  = ₹539
  //
  // ===================================================

  const totalSales =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        money(
          order.finalAmount
        ),
      0
    );


  // ===================================================
  // PRODUCTS
  // ===================================================

  const totalProducts =
    await Product.countDocuments();


  // ===================================================
  // ACTIVE PRODUCTS
  // ===================================================

  let activeProducts =
    0;


  try {

    activeProducts =
      await Product.countDocuments({

        status:
          "Active",

      });

  } catch (error) {

    console.error(
      "ACTIVE PRODUCTS COUNT ERROR:",
      error
    );


    // If your Product model does not use
    // status = "Active", don't break dashboard.

    activeProducts =
      totalProducts;

  }


  // ===================================================
  // MEMBER ORDER MAP
  // ===================================================
  //
  // Used only to provide member-level information
  // in the dashboard response.
  //
  // ===================================================

  const orderMap =
    new Map();


  orders.forEach(
    (order) => {

      if (
        !order.userId
      ) {

        return;

      }


      const userId =
        String(
          order.userId
        );


      if (
        !orderMap.has(
          userId
        )
      ) {

        orderMap.set(
          userId,
          []
        );

      }


      orderMap
        .get(userId)
        .push(order);

    }
  );


  // ===================================================
  // MEMBER SUMMARY
  // ===================================================

  const memberSummary =
    members.map(
      (member) => {

        const memberId =
          String(
            member._id
          );


        const memberOrders =
          orderMap.get(
            memberId
          ) || [];


        const memberSales =
          memberOrders.reduce(
            (
              total,
              order
            ) =>
              total +
              money(
                order.finalAmount
              ),
            0
          );


        return {

          _id:
            member._id,

          name:
            member.name ||
            "",

          userId:
            member.userId ||
            "",

          mobile:
            member.mobile ||
            "",

          isActive:
            member.isActive !== false,

          kycStatus:
            member.kycStatus ||
            "",

          paymentStatus:
            member.paymentStatus ||
            "",

          orders: {

            count:
              memberOrders.length,

            sales:
              memberSales,

          },

        };

      }
    );


  // ===================================================
  // RECENT ORDERS
  // ===================================================

  const recentOrders =
    orders.slice(
      0,
      10
    );


  // ===================================================
  // DEBUG
  // ===================================================

  console.log(
    "=============================================="
  );

  console.log(
    "MANAGER DASHBOARD"
  );

  console.log(
    "Manager ID:",
    String(
      managerId
    )
  );

  console.log(
    "Managed Members:",
    totalMembers
  );

  console.log(
    "Manager Commission:",
    totalCommission
  );

  console.log(
    "Network Order IDs:",
    uniqueIds
  );

  console.log(
    "Network Object IDs:",
    objectIds.length
  );

  console.log(
    "Managed Orders:",
    totalOrders
  );

  console.log(
    "Managed Sales:",
    totalSales
  );

  console.log(
    "Products:",
    totalProducts
  );

  console.log(
    "Pending KYC:",
    pendingKyc
  );

  console.log(
    "=============================================="
  );


  // ===================================================
  // FINAL RESPONSE
  // ===================================================

  return {

    summary: {

      totalMembers,

      activeMembers,

      pendingKyc,

      totalCommission,

      paidCommission,

      pendingCommission,

      totalOrders,

      totalSales,

      totalProducts,

      activeProducts,

    },


    members:
      memberSummary,


    recentOrders:
      recentOrders,

  };

};

// =====================================================
// GET MEMBERS
// =====================================================

const getMembers = async (
  managerId
) => {

  const users =
    await User.find()
      .select(
        [
          "_id",
          "name",
          "userId",
          "email",
          "mobile",
          "role",
          "referralCode",
          "sponsorId",
          "managerId",
          "isActive",
          "kycStatus",
          "paymentStatus",
          "welcomeKitStatus",
          "sellingPoints",
          "lifetimePurchase",
          "createdAt",
        ].join(" ")
      )
      .lean();


  const members =
    getManagerMembers(
      users,
      managerId
    );


  if (
    !members.length
  ) {

    return [];

  }


  const memberIds =
    members.map(
      (member) =>
        member._id
    );


  // ---------------------------------------------------
  // WALLETS
  // ---------------------------------------------------

  const wallets =
    await Wallet.find({
      user: {
        $in: memberIds,
      },
    }).lean();


  const walletMap =
    new Map();


  wallets.forEach(
    (wallet) => {

      if (
        wallet?.user
      ) {

        walletMap.set(
          String(
            wallet.user
          ),
          wallet
        );

      }

    }
  );


  // ---------------------------------------------------
  // COMMISSIONS
  // ---------------------------------------------------

  const commissions =
    await commissionRepository
      .findByReceivers(
        memberIds
      );


  const commissionMap =
    new Map();


  commissions.forEach(
    (commission) => {

      const receiverId =
        String(
          commission.receiver
        );


      if (
        !commissionMap.has(
          receiverId
        )
      ) {

        commissionMap.set(
          receiverId,
          []
        );

      }


      commissionMap
        .get(receiverId)
        .push(
          commission
        );

    }
  );


  // ---------------------------------------------------
  // ORDERS
  // ---------------------------------------------------

  const orders =
    await Order.find({
      userId: {
        $in: memberIds,
      },
    })
      .select(
        [
          "userId",
          "finalAmount",
          "sellingPoints",
          "paymentStatus",
          "status",
          "createdAt",
        ].join(" ")
      )
      .sort({
        createdAt: -1,
      })
      .lean();


  const orderMap =
    new Map();


  orders.forEach(
    (order) => {

      const id =
        String(
          order.userId
        );


      if (
        !orderMap.has(id)
      ) {

        orderMap.set(
          id,
          []
        );

      }


      orderMap
        .get(id)
        .push(order);

    }
  );


  // ---------------------------------------------------
  // RETURN
  // ---------------------------------------------------

  return members.map(
    (member) => {

      const id =
        String(
          member._id
        );


      const wallet =
        walletMap.get(id);


      const memberCommissions =
        commissionMap.get(id) || [];


      const memberOrders =
        orderMap.get(id) || [];


      const commissionTotal =
        memberCommissions.reduce(
          (
            total,
            item
          ) =>
            total +
            money(
              item.commissionAmount ??
              item.amount ??
              0
            ),
          0
        );


      const commissionPaid =
        memberCommissions
          .filter(
            (item) =>
              [
                "PAID",
                "COMPLETED",
              ].includes(
                String(
                  item.status || ""
                ).toUpperCase()
              )
          )
          .reduce(
            (
              total,
              item
            ) =>
              total +
              money(
                item.commissionAmount ??
                item.amount ??
                0
              ),
            0
          );


      const salesValue =
        memberOrders.reduce(
          (
            total,
            order
          ) =>
            total +
            money(
              order.finalAmount
            ),
          0
        );


      return {

        ...member,

        wallet: {

          balance:
            money(
              wallet?.balance
            ),

          totalCommission:
            money(
              wallet?.totalCommission
            ),

          totalBonus:
            money(
              wallet?.totalBonus
            ),

          totalWithdrawn:
            money(
              wallet?.totalWithdrawn
            ),

        },

        commission: {

          total:
            commissionTotal,

          paid:
            commissionPaid,

          pending:
            Math.max(
              commissionTotal -
              commissionPaid,
              0
            ),

          count:
            memberCommissions.length,

        },

        orders: {

          count:
            memberOrders.length,

          salesValue,

          paidCount:
            memberOrders.filter(
              (order) =>
                isPaid(
                  order.paymentStatus
                )
            ).length,

        },

      };

    }
  );

};


// =====================================================
// GET MEMBER BY ID
// =====================================================

const getMemberById = async (
  managerIdOrMemberId,
  maybeMemberId
) => {

  const managerId =
    maybeMemberId === undefined
      ? null
      : managerIdOrMemberId;


  const memberId =
    maybeMemberId === undefined
      ? managerIdOrMemberId
      : maybeMemberId;


  let memberQuery =
    User.findOne({
      _id: memberId,
      role: "MEMBER",
    });


  // ---------------------------------------------------
  // SECURITY CHECK
  // ---------------------------------------------------

  if (
    managerId
  ) {

    const users =
      await User.find()
        .select(
          [
            "_id",
            "name",
            "userId",
            "email",
            "mobile",
            "role",
            "referralCode",
            "sponsorId",
            "managerId",
            "isActive",
            "kycStatus",
            "paymentStatus",
            "welcomeKitStatus",
            "sellingPoints",
            "lifetimePurchase",
            "createdAt",
          ].join(" ")
        )
        .lean();


    const managedMembers =
      getManagerMembers(
        users,
        managerId
      );


    const allowed =
      managedMembers.some(
        (member) =>
          String(
            member._id
          ) ===
          String(
            memberId
          )
      );


    if (
      !allowed
    ) {

      return null;

    }

  }


  const member =
    await memberQuery
      .select(
        "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry"
      )
      .populate(
        "managerId",
        "name userId mobile"
      )
      .lean();


  if (
    !member
  ) {

    return null;

  }


  const wallet =
    typeof walletRepository.findWalletByUser ===
    "function"
      ? await walletRepository
          .findWalletByUser(
            member._id
          )
      : await Wallet.findOne({
          user: member._id,
        }).lean();


  const orders =
    await orderRepository
      .findByUser(
        member._id
      );


  const commissions =
    await commissionRepository
      .findByUser(
        member._id
      );


  return {

    ...member,

    wallet: {

      balance:
        money(
          wallet?.balance
        ),

      totalCommission:
        money(
          wallet?.totalCommission
        ),

      totalBonus:
        money(
          wallet?.totalBonus
        ),

      totalWithdrawn:
        money(
          wallet?.totalWithdrawn
        ),

    },

    orders: {

      count:
        orders.length,

      salesValue:
        orders.reduce(
          (
            total,
            order
          ) =>
            total +
            money(
              order.finalAmount
            ),
          0
        ),

    },

    commission: {

      count:
        commissions.length,

      total:
        commissions.reduce(
          (
            total,
            item
          ) =>
            total +
            money(
              item.commissionAmount ??
              item.amount ??
              0
            ),
          0
        ),

    },

  };

};


// =====================================================
// COMPLETE MEMBER DETAILS
// =====================================================

const getMemberDetails = async (
  managerId,
  memberId
) => {

  const users =
    await User.find()
      .select(
        [
          "_id",
          "name",
          "userId",
          "email",
          "mobile",
          "role",
          "referralCode",
          "sponsorId",
          "managerId",
          "isActive",
          "kycStatus",
          "paymentStatus",
          "welcomeKitStatus",
          "sellingPoints",
          "lifetimePurchase",
          "createdAt",
        ].join(" ")
      )
      .lean();


  const managerMembers =
    getManagerMembers(
      users,
      managerId
    );


  const belongsToManager =
    managerMembers.some(
      (item) =>
        String(
          item._id
        ) ===
        String(
          memberId
        )
    );


  if (
    !belongsToManager
  ) {

    return null;

  }


  const member =
    await User.findOne({
      _id: memberId,
    })
      .select(
        "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry"
      )
      .populate(
        "managerId",
        "name userId mobile"
      )
      .lean();


  if (
    !member
  ) {

    return null;

  }


  const wallet =
    typeof walletRepository.findWalletByUser ===
    "function"
      ? await walletRepository
          .findWalletByUser(
            member._id
          )
      : await Wallet.findOne({
          user: member._id,
        }).lean();


  let walletTransactions =
    [];


  if (
    wallet &&
    typeof walletTransactionRepository
      .getTransactions ===
      "function"
  ) {

    walletTransactions =
      await walletTransactionRepository
        .getTransactions(
          wallet._id
        );

  }


  const withdrawals =
    typeof withdrawRepository.findByUser ===
    "function"
      ? await withdrawRepository
          .findByUser(
            member._id
          )
      : [];


  const commissions =
    await commissionRepository
      .findByUser(
        member._id
      );


  const sellingPointHistory =
    typeof sellingPointRepository
      .getTransactions ===
    "function"
      ? await sellingPointRepository
          .getTransactions(
            member._id
          )
      : [];


  const orders =
    await orderRepository
      .findByUser(
        member._id
      );


  const downline =
    await User.find({
      sponsorId:
        member._id,

      managerId:
        managerId,

      role:
        "MEMBER",

    })
      .select(
        [
          "name",
          "userId",
          "mobile",
          "role",
          "sponsorId",
          "managerId",
          "referralCode",
          "isActive",
          "sellingPoints",
          "lifetimePurchase",
          "createdAt",
        ].join(" ")
      )
      .sort({
        createdAt: 1,
      })
      .lean();


  const walletSummary = {

    balance:
      money(
        wallet?.balance
      ),

    totalCommission:
      money(
        wallet?.totalCommission
      ),

    totalBonus:
      money(
        wallet?.totalBonus
      ),

    totalWithdrawn:
      money(
        wallet?.totalWithdrawn
      ),

    pendingWithdrawal:
      withdrawals
        .filter(
          (item) =>
            String(
              item.status || ""
            ).toUpperCase() ===
            "PENDING"
        )
        .reduce(
          (
            sum,
            item
          ) =>
            sum +
            money(
              item.amount
            ),
          0
        ),

    transactionCount:
      walletTransactions.length,

    withdrawalCount:
      withdrawals.length,

    commissionCount:
      commissions.length,

  };


  const currentSellingPoints =
    money(
      member.sellingPoints
    );


  const sellingPointSummary = {

    current:
      currentSellingPoints,

    lifetimePurchase:
      money(
        member.lifetimePurchase
      ),

    target:
      500,

    remaining:
      Math.max(
        500 -
        currentSellingPoints,
        0
      ),

    isSupervisor:
      currentSellingPoints >=
      500,

    transactionCount:
      sellingPointHistory.length,

  };


  const commissionSummary = {

    total:
      commissions.reduce(
        (
          sum,
          item
        ) =>
          sum +
          money(
            item.commissionAmount ??
            item.amount ??
            0
          ),
        0
      ),

    paid:
      commissions
        .filter(
          (item) =>
            [
              "PAID",
              "COMPLETED",
            ].includes(
              String(
                item.status || ""
              ).toUpperCase()
            )
        )
        .reduce(
          (
            sum,
            item
          ) =>
            sum +
            money(
              item.commissionAmount ??
              item.amount ??
              0
            ),
          0
        ),

    pending:
      commissions
        .filter(
          (item) =>
            String(
              item.status || ""
            ).toUpperCase() ===
            "PENDING"
        )
        .reduce(
          (
            sum,
            item
          ) =>
            sum +
            money(
              item.commissionAmount ??
              item.amount ??
              0
            ),
          0
        ),

    transactionCount:
      commissions.length,

  };


  const orderSummary = {

    total:
      orders.length,

    paid:
      orders.filter(
        (order) =>
          isPaid(
            order.paymentStatus
          )
      ).length,

    pending:
      orders.filter(
        (order) =>
          !isPaid(
            order.paymentStatus
          )
      ).length,

    totalPurchase:
      orders.reduce(
        (
          sum,
          order
        ) =>
          sum +
          money(
            order.finalAmount
          ),
        0
      ),

  };


  return {

    member,

    wallet:
      walletSummary,

    walletTransactions,

    withdrawals,

    commissions,

    commissionSummary,

    sellingPoints:
      sellingPointSummary,

    sellingPointHistory,

    orders,

    orderSummary,

    downline,

    referralTree: {

      userId:
        member.userId,

      name:
        member.name,

      children:
        downline,

    },

  };

};

// =====================================================
// GET MANAGER REFERRAL TREE
// =====================================================
//
// PURPOSE:
//
// 1. Manager is the ROOT node.
// 2. Manager display name = "Bhagyamma Hub".
// 3. Manager userId remains unchanged.
// 4. Manager referralCode remains unchanged.
// 5. Level 1 members keep their real names.
// 6. Level 2+ members keep their real names.
// 7. Member wallet balance remains unchanged.
// 8. Member selling points remain unchanged.
// 9. Referral relationships remain unchanged.
//
// IMPORTANT:
//
// Manager root:
// - NO walletBalance
// - NO sellingPoints
// - NO lifetimePurchase
//
// Members:
// - walletBalance
// - wallet details
// - sellingPoints
// - lifetimePurchase
//
// =====================================================

const getReferralTree = async (
  managerId
) => {

  // ===================================================
  // GET MANAGER
  // ===================================================

  const manager =
    await User.findById(
      managerId
    )
      .select(
        [
          "_id",
          "name",
          "userId",
          "mobile",
          "email",
          "role",
          "referralCode",
          "isActive",
          "createdAt",
          "sellingPoints",
          "lifetimePurchase",
        ].join(" ")
      )
      .lean();


  // ===================================================
  // MANAGER NOT FOUND
  // ===================================================

  if (!manager) {

    return null;

  }


  // ===================================================
  // GET ALL USERS
  // ===================================================

  const users =
    await User.find()
      .select(
        [
          "_id",
          "name",
          "userId",
          "email",
          "mobile",
          "role",
          "referralCode",
          "sponsorId",
          "managerId",
          "isActive",
          "sellingPoints",
          "lifetimePurchase",
          "createdAt",
        ].join(" ")
      )
      .lean();


  // ===================================================
  // GET MANAGER NETWORK
  // ===================================================

  const managerMembers =
    getManagerMembers(
      users,
      managerId
    );


  // ===================================================
  // MANAGED MEMBER IDS
  // ===================================================

  const managedIds =
    new Set(
      managerMembers.map(
        (member) =>
          String(
            member._id
          )
      )
    );


  // ===================================================
  // GET MEMBER WALLETS
  // ===================================================

  const wallets =
    managerMembers.length > 0
      ? await Wallet.find({
          user: {
            $in:
              managerMembers.map(
                (member) =>
                  member._id
              ),
          },
        }).lean()
      : [];


  // ===================================================
  // WALLET MAP
  // ===================================================

  const walletMap =
    new Map();


  wallets.forEach(
    (wallet) => {

      if (
        wallet?.user
      ) {

        walletMap.set(
          String(
            wallet.user
          ),
          wallet
        );

      }

    }
  );


  // ===================================================
  // CHILDREN MAP
  // ===================================================
  //
  // sponsorId -> members
  //
  // Example:
  //
  // Manager
  //   |
  //   +-- Member A
  //        |
  //        +-- Member B
  //
  // ===================================================

  const childrenMap =
    new Map();


  managerMembers.forEach(
    (member) => {

      const sponsorId =
        member.sponsorId
          ? String(
              member.sponsorId
            )
          : null;


      if (!sponsorId) {

        return;

      }


      if (
        !childrenMap.has(
          sponsorId
        )
      ) {

        childrenMap.set(
          sponsorId,
          []
        );

      }


      childrenMap
        .get(
          sponsorId
        )
        .push(
          member
        );

    }
  );


  // ===================================================
  // SORT CHILDREN
  // ===================================================

  childrenMap.forEach(
    (
      children
    ) => {

      children.sort(
        (
          a,
          b
        ) =>
          new Date(
            a.createdAt || 0
          ) -
          new Date(
            b.createdAt || 0
          )
      );

    }
  );


  // ===================================================
  // BUILD MEMBER NODE
  // ===================================================
  //
  // IMPORTANT:
  //
  // Wallet + Selling Points are kept ONLY here.
  //
  // This function is used for:
  //
  // Level 1 members
  // Level 2 members
  // Level 3 members
  // Level 4+ members
  //
  // ===================================================

  const buildMemberNode =
    (
      member,
      level
    ) => {

      const memberId =
        String(
          member._id
        );


      const wallet =
        walletMap.get(
          memberId
        );


      const children =
        childrenMap.get(
          memberId
        ) || [];


      return {

        // ---------------------------------------------
        // BASIC MEMBER INFORMATION
        // ---------------------------------------------

        _id:
          member._id,

        id:
          member._id,

        userId:
          member.userId || "",

        name:
          member.name || "",

        email:
          member.email || "",

        mobile:
          member.mobile || "",

        role:
          member.role ||
          "MEMBER",

        referralCode:
          member.referralCode || "",

        sponsorId:
          member.sponsorId ||
          null,

        managerId:
          member.managerId ||
          null,

        isActive:
          member.isActive !== false,


        // ---------------------------------------------
        // MEMBER SELLING POINTS
        // ---------------------------------------------

        sellingPoints:
          Number(
            member.sellingPoints || 0
          ),


        // ---------------------------------------------
        // MEMBER PURCHASE
        // ---------------------------------------------

        lifetimePurchase:
          Number(
            member.lifetimePurchase || 0
          ),


        // ---------------------------------------------
        // MEMBER WALLET BALANCE
        // ---------------------------------------------

        walletBalance:
          Number(
            wallet?.balance || 0
          ),


        // ---------------------------------------------
        // COMPLETE MEMBER WALLET
        // ---------------------------------------------

        wallet: {

          balance:
            Number(
              wallet?.balance || 0
            ),

          totalCommission:
            Number(
              wallet?.totalCommission || 0
            ),

          totalBonus:
            Number(
              wallet?.totalBonus || 0
            ),

          totalWithdrawn:
            Number(
              wallet?.totalWithdrawn || 0
            ),

        },


        // ---------------------------------------------
        // DATE
        // ---------------------------------------------

        createdAt:
          member.createdAt,


        // ---------------------------------------------
        // LEVEL
        // ---------------------------------------------

        level,


        // ---------------------------------------------
        // CHILDREN
        // ---------------------------------------------

        children:
          children
            .filter(
              (child) =>
                managedIds.has(
                  String(
                    child._id
                  )
                )
            )
            .map(
              (child) =>
                buildMemberNode(
                  child,
                  level + 1
                )
            ),

      };

    };


  // ===================================================
  // MANAGER ID
  // ===================================================

  const managerIdString =
    String(
      manager._id
    );


  // ===================================================
  // DIRECT MEMBERS
  // ===================================================
  //
  // A member is directly under the manager when:
  //
  // 1. managerId === manager
  //
  // OR
  //
  // 2. sponsorId === manager
  //
  // OR
  //
  // 3. member has no sponsor inside this network
  //
  // ===================================================

  const directMembers =
    managerMembers.filter(
      (member) => {

        const sponsorId =
          member.sponsorId
            ? String(
                member.sponsorId
              )
            : null;


        const assignedToManager =
          String(
            member.managerId || ""
          ) ===
          managerIdString;


        const sponsoredByManager =
          sponsorId ===
          managerIdString;


        const sponsorExistsInNetwork =
          sponsorId &&
          managedIds.has(
            sponsorId
          );


        return (
          assignedToManager ||
          sponsoredByManager ||
          !sponsorExistsInNetwork
        );

      }
    );


  // ===================================================
  // REMOVE DUPLICATES
  // ===================================================

  const uniqueDirectMembers =
    Array.from(
      new Map(
        directMembers.map(
          (member) => [
            String(
              member._id
            ),
            member,
          ]
        )
      ).values()
    );


  // ===================================================
  // SORT DIRECT MEMBERS
  // ===================================================

  uniqueDirectMembers.sort(
    (
      a,
      b
    ) =>
      new Date(
        a.createdAt || 0
      ) -
      new Date(
        b.createdAt || 0
      )
  );


  // ===================================================
  // BUILD MANAGER CHILDREN
  // ===================================================

  const managerChildren =
    uniqueDirectMembers.map(
      (
        member
      ) =>
        buildMemberNode(
          member,
          1
        )
    );


  // ===================================================
  // RETURN MANAGER TREE
  // ===================================================
  //
  // IMPORTANT:
  //
  // DO NOT ADD:
  //
  // sellingPoints
  // lifetimePurchase
  // walletBalance
  //
  // to this manager object.
  //
  // Those belong only to members.
  //
  // ===================================================

  return {

    _id:
      manager._id,

    id:
      manager._id,

    userId:
      manager.userId || "",

    // ---------------------------------------------
    // DISPLAY NAME ONLY FOR MANAGER
    // ---------------------------------------------

    name:
      "Bhagyamma Hub",

    mobile:
      manager.mobile || "",

    email:
      manager.email || "",

    role:
      manager.role ||
      "MANAGER",

    referralCode:
      manager.referralCode || "",

    isActive:
      manager.isActive !== false,

    // ---------------------------------------------
    // MANAGER LEVEL
    // ---------------------------------------------

    level:
      0,

    // ---------------------------------------------
    // MANAGER CHILDREN
    // ---------------------------------------------

    children:
      managerChildren,

  };

};
// =====================================================
// PROFILE
// =====================================================

const getProfile = async (
  managerId
) => {

  return await User.findById(
    managerId
  )
    .select(
      "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry"
    )
    .lean();

};


// =====================================================
// MANAGER PRODUCTS
// =====================================================
//
// READ ONLY.
// Global product inventory.
//
// IMPORTANT:
// We intentionally do NOT calculate/remove
// products from the response.
// The manager Products page needs the actual
// product list.
//
// =====================================================

const getManagerProducts = async () => {

  const products =
    await Product.find()
      .sort({
        createdAt: -1,
      })
      .lean();


  return products;

};


// =====================================================
// MANAGER COMMISSIONS
// =====================================================
//
// Legacy endpoint.
//
// Returns commission transactions received
// by the manager.
//
// =====================================================

const getManagerCommissions = async (
  managerId
) => {

  if (!managerId) {

    throw new ApiError(
      400,
      "Manager ID is required."
    );

  }


  return await commissionRepository
    .findByReceivers([
      managerId,
    ]);

};


// =====================================================
// MANAGER JOINING COMMISSION PAGE
// =====================================================
//
// THIS IS THE IMPORTANT COMMISSION PAGE.
//
// Each row:
//
// 1. Member ID
// 2. Member Name
// 3. Commission %
// 4. Amount
//
// NO:
//
// - paid
// - pending
// - withdrawal
// - payment status
//
// Every managed member is included,
// even if commission = ₹0.
//
// Manager commission is calculated from:
//
// receiver = manager
// fromUser = member
//
// =====================================================

const getCommissionPage = async (
  managerId
) => {

  if (!managerId) {

    throw new ApiError(
      400,
      "Manager ID is required."
    );

  }


  // ---------------------------------------------------
  // MANAGER
  // ---------------------------------------------------

  const manager =
    await User.findById(
      managerId
    )
      .select(
        "name userId mobile email role"
      )
      .lean();


  if (
    !manager
  ) {

    throw new ApiError(
      404,
      "Manager not found."
    );

  }


  // ---------------------------------------------------
  // ALL MANAGED MEMBERS
  // ---------------------------------------------------

  const users =
    await User.find()
      .select(
        [
          "_id",
          "name",
          "userId",
          "email",
          "mobile",
          "role",
          "referralCode",
          "sponsorId",
          "managerId",
          "isActive",
          "createdAt",
        ].join(" ")
      )
      .lean();


  const members =
    getManagerMembers(
      users,
      managerId
    );


  // ---------------------------------------------------
  // MANAGER'S COMMISSION TRANSACTIONS
  // ---------------------------------------------------
  //
  // receiver = manager
  //
  // fromUser = member who joined
  //
  // ---------------------------------------------------

  const managerTransactions =
    members.length > 0
      ? await commissionRepository
          .findByReceivers([
            managerId,
          ])
      : [];


  // ---------------------------------------------------
  // MAP TRANSACTIONS BY MEMBER
  // ---------------------------------------------------

  const transactionMap =
    new Map();


  members.forEach(
    (member) => {

      transactionMap.set(
        String(
          member._id
        ),
        []
      );

    }
  );


  managerTransactions.forEach(
    (transaction) => {

      const receiverId =
        String(
          transaction.receiver?._id ||
          transaction.receiver ||
          ""
        );


      // Only manager's transactions
      if (
        receiverId !==
        String(managerId)
      ) {

        return;

      }


      const sourceMemberId =
        String(
          transaction.fromUser?._id ||
          transaction.fromUser ||
          ""
        );


      if (
        transactionMap.has(
          sourceMemberId
        )
      ) {

        transactionMap
          .get(
            sourceMemberId
          )
          .push(
            transaction
          );

      }

    }
  );


  // ---------------------------------------------------
  // BUILD 23 MEMBER ROWS
  // ---------------------------------------------------

  const memberRows =
    members.map(
      (member) => {

        const memberId =
          String(
            member._id
          );


        const transactions =
          transactionMap.get(
            memberId
          ) || [];


        // ---------------------------------------------
        // TOTAL AMOUNT EARNED FROM THIS MEMBER
        // ---------------------------------------------

        const amount =
          transactions.reduce(
            (
              total,
              transaction
            ) =>
              total +
              money(
                transaction.commissionAmount ??
                transaction.amount ??
                0
              ),
            0
          );


        // ---------------------------------------------
        // COMMISSION %
        // ---------------------------------------------

        const percentage =
          transactions.length > 0
            ? Number(
                transactions[0]
                  .percentage ||
                0
              )
            : 0;


        // ---------------------------------------------
        // JOINING AMOUNT
        // ---------------------------------------------

        const joiningAmount =
          transactions.length > 0
            ? money(
                transactions[0]
                  .joiningAmount
              )
            : 0;


        return {

          memberId:
            member._id,

          name:
            member.name || "",

          userId:
            member.userId || "",

          mobile:
            member.mobile || "",

          email:
            member.email || "",

          commissionPercent:
            percentage,

          percentage,

          joiningAmount,

          amount,

          commissionAmount:
            amount,

          transactionCount:
            transactions.length,

        };

      }
    );


  // ---------------------------------------------------
  // TOTAL MANAGER COMMISSION
  // ---------------------------------------------------

  const totalEarned =
    managerTransactions.reduce(
      (
        total,
        transaction
      ) =>
        total +
        money(
          transaction.commissionAmount ??
          transaction.amount ??
          0
        ),
      0
    );


  // ---------------------------------------------------
  // DEBUG
  // ---------------------------------------------------

  console.log(
    "=============================================="
  );

  console.log(
    "MANAGER JOINING COMMISSION"
  );

  console.log(
    "Manager:",
    manager.name
  );

  console.log(
    "Manager ID:",
    String(managerId)
  );

  console.log(
    "Managed Members:",
    members.length
  );

  console.log(
    "Manager Transactions:",
    managerTransactions.length
  );

  console.log(
    "Total Manager Commission:",
    totalEarned
  );

  console.log(
    "=============================================="
  );


  // ---------------------------------------------------
  // RESPONSE
  // ---------------------------------------------------

  return {

    manager: {

      id:
        manager._id,

      name:
        manager.name || "",

      userId:
        manager.userId || "",

      mobile:
        manager.mobile || "",

      email:
        manager.email || "",

    },

    totalEarned,

    memberCount:
      memberRows.length,

    members:
      memberRows,

    transactions:
      managerTransactions,

  };

};


// =====================================================
// EXPORTS
// =====================================================
//
// IMPORTANT:
//
// This backend file uses CommonJS.
//
// NEVER use:
// export const ...
//
// Use module.exports only.
//
// =====================================================

module.exports = {

  getDashboard,

  getMembers,

  getMemberById,

  getMemberDetails,

  getReferralTree,

  getProfile,

  getManagerProducts,

  getManagerCommissions,

  getCommissionPage,

};