const mongoose = require("mongoose");
const Lead = require("../models/Lead");

const validStatuses = ["New", "Contacted", "Converted", "Lost"];

function validateLeadInput(body, partial = false) {
  const errors = [];
  if (!partial || body.name !== undefined) {
    if (!body.name || body.name.trim().length < 2) errors.push("Name must contain at least 2 characters");
  }
  if (!partial || body.email !== undefined) {
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("Enter a valid email");
  }
  if (!partial || body.phone !== undefined) {
    if (!body.phone || !/^[0-9+\-\s]{7,15}$/.test(body.phone)) errors.push("Enter a valid phone number");
  }
  if (body.status !== undefined && !validStatuses.includes(body.status)) errors.push("Invalid status");
  return errors;
}

async function getLeads(req, res) {
  try {
    const { search = "", status = "", source = "" } = req.query;

    const filter = {};

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    if (status && validStatuses.includes(status)) filter.status = status;
    if (source) filter.source = source;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to fetch leads" });
  }
}

async function getLead(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid lead ID" });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch lead" });
  }
}

async function createLead(req, res) {
  try {
    const errors = validateLeadInput(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(". ") });
    }

    const lead = await Lead.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      source: req.body.source || "Website",
      status: req.body.status || "New",
      notes: req.body.notes || "",
      followUpDate: req.body.followUpDate || null
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to create lead" });
  }
}

async function updateLead(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid lead ID" });
    }

    const errors = validateLeadInput(req.body, true);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(". ") });
    }

    const allowed = ["name", "email", "phone", "source", "status", "notes", "followUpDate"];
    const update = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    });

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({
      success: true,
      message: "Lead updated successfully",
      lead
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unable to update lead" });
  }
}

async function deleteLead(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid lead ID" });
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to delete lead" });
  }
}

async function getStats(req, res) {
  try {
    const [total, newLeads, contacted, converted, lost] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "New" }),
      Lead.countDocuments({ status: "Contacted" }),
      Lead.countDocuments({ status: "Converted" }),
      Lead.countDocuments({ status: "Lost" })
    ]);

    res.json({
      success: true,
      stats: { total, newLeads, contacted, converted, lost }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch statistics" });
  }
}

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getStats
};
