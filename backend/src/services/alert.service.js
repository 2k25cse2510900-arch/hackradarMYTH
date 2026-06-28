const { sendEmail } = require("./email.service");
const Alert = require("../models/Alert");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const hackathonService = require("./hackathon.service");

async function listAlerts(userId) {
  return Alert.find({ user: userId }).sort({ createdAt: -1 });
}

async function createAlert(userId, payload) {
  // Get hackathon
  const hackathon = await hackathonService.getHackathonById(payload.hackathonId);

  // Calculate alert time automatically (1 day before registration deadline)
  let alertTime;

if (payload.demoMode) {
  // Demo reminder after 2 minutes
  const minutes = payload.demoMinutes || 2;

alertTime = new Date(Date.now() + minutes * 60 * 1000);
} else {
  // Normal reminder (1 day before deadline)
  const deadline = new Date(hackathon.registrationDeadline);
const reminderHours = 24; // 24 = 1 day before
alertTime = new Date(deadline.getTime() - reminderHours * 60 * 60 * 1000);
}

  // Save alert
  const alert = await Alert.create({
    ...payload,
    user: userId,
    alertTime,
  });

  // Get logged-in user
  const user = await User.findById(userId);

  // Build display name
  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  // Send confirmation email
  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: "🎉 HackRadar Alert Created",
      html: `
        <h2>Hello ${fullName},</h2>

        <p>Your HackRadar alert has been created successfully.</p>

        <hr>

        <h3>Alert Details</h3>

        <p><strong>Title:</strong> ${alert.title}</p>
        <p><strong>Frequency:</strong> ${alert.frequency}</p>
        <p><strong>Status:</strong> ${
          alert.enabled ? "Enabled ✅" : "Disabled ❌"
        }</p>

        <p><strong>Reminder Time:</strong> ${alertTime}</p>

        <br>

        <p>We'll notify you before the hackathon registration deadline.</p>

        <br>

        <h3>Happy Hacking 🚀</h3>

        <p>HackRadar Team</p>
      `,
    });
  }

  return alert;
}

async function updateAlert(userId, alertId, payload) {
  if (payload.hackathonId) {
    await hackathonService.getHackathonById(payload.hackathonId);
  }

  const alert = await Alert.findOneAndUpdate(
    { _id: alertId, user: userId },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  return alert;
}

async function deleteAlert(userId, alertId) {
  const alert = await Alert.findOneAndDelete({
    _id: alertId,
    user: userId,
  });

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  return alert;
}

module.exports = {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
};