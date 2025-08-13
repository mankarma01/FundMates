const Balance = require("../models/Balance");

/**
 * Updates balances for a group when an expense is added.
 * @param {String} groupId - ID of the group
 * @param {String} paidBy - User ID who paid
 * @param {Number} amount - Total amount paid
 * @param {Array} members - Array of userId strings (group members)
 * @param {Object} session - Mongo session for transaction
 */
async function updateBalancesForExpense(groupId, paidBy, amount, members, session) {
  const splitAmount = amount / members.length;

  for (const memberId of members) {
    if (memberId === paidBy.toString()) continue;

    // Check if a balance already exists
    let balance = await Balance.findOne({
      groupId,
      from: memberId,  // owes
      to: paidBy       // owed to
    }).session(session);

    if (balance) {
      balance.amount += splitAmount;
      await balance.save({ session });
    } else {
      await Balance.create([{
        groupId,
        from: memberId,
        to: paidBy,
        amount: splitAmount
      }], { session });

    }
  }
}

console.log("Balac servie loaded");
module.exports = {
  updateBalancesForExpense
};
