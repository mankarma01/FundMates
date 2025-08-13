const Balance = require("../models/Balance");

exports.getGroupBalances = async (req, res) => {
  try{
    const { groupId } = req.params;
    const balances = await Balance.find({ groupId })
     .populate("from", "name")
     .populate("to", "name");
  res.json(balances);
  }catch (err){
    console.error(err);
    res.json(500).json({ message: "Error fetching balances"});
  }
};
