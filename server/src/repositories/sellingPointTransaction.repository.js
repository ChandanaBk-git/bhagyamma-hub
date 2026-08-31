/**
 * Compatibility repository
 *
 * This file intentionally re-exports the existing
 * sellingPoint.repository.js.
 *
 * DO NOT put commission logic here.
 * DO NOT change existing selling point logic.
 *
 * Existing repository already contains:
 * - createTransaction
 * - getTransactions
 * - getTransactionById
 * - findMembershipTransaction
 * - findOrderTransaction
 * - findByOrder
 * - countOrderTransactions
 * - getUserOrderTransactions
 */

module.exports = require("./sellingPoint.repository");