const Group = require("../models/Group");

// Create Group
exports.createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;

    const group = await Group.create({
      groupName: groupName,
      createdBy: {
        userId: req.user._id,
        name: req.user.name,
      },
      members: members,
    });

    res.status(201).json(group);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create group", error: err.message });
  }
};

exports.getMyGruops = async (req, res) => {
  exports.getMyGruops = async (req, res) => {
    try {
      const userId = req.user._id;
      const groups = await Group.find({
        $or: [{ createdBy: userId }, { members: userId }],
      }).sort({ createdAt: -1 });
      res.status(200).json(groups);
      console.log(res);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch expenses", error: err.message });
    }
  };
  try {
    const userId = req.user._id;
    const groups = await Group.find({
      $or: [{ createdBy: userId }, { "members.userId": userId }],
    }).sort({ createdAt: -1 });
    res.status(200).json(groups);
    console.log(res);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: err.message });
  }
};

exports.getMyGruopById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group)
      return res.status(404).json({
        message: "Group not found",
      });
    res.json(group);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expense", error: err.message });
  }
};

// Update expense (only creater/paidBy  allowed  for now)

exports.updateGruop = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const isMember = group.members.some(
      (member) => member.toString() === userId
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this group" });
    }
    Object.assign(group, this.updateGruop);
    await group.save();

    res.status(200).json({ message: "Group updated successfully", group });
  } catch (err) {
    console.error("Update group failed", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteGruop = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const userId = req.user._id;
    if (!group) return res.status(404).json({ message: "Group not found " });

    const isMember = group.members.some(
      (member) => member.toString() === userId
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this group" });
    }

    await group.deleteOne();
    res.json({ message: "Group is delete suceesfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete group", error: err.message });
  }
};
