const cron = require("node-cron");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { sendEmail } = require("./email.service");

cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking alerts...");

  try {
    const alerts = await Alert.find({
      enabled: true,
      alertTime: { $lte: new Date() },
    });

    console.log(`Found ${alerts.length} alert(s)`);

    for (const alert of alerts) {
      const user = await User.findById(alert.user);

      if (!user || !user.email) continue;

      await sendEmail({
        
        to: user.email,
        subject: `⏰ Reminder: ${alert.title}`,
        html: `
          <h2>Hello ${user.firstName || "Hacker"} 👋</h2>

          <p>Your hackathon reminder is here.</p>

          <h3>${alert.title}</h3>

          <p>The registration deadline is approaching.</p>

          <p>Good luck and happy hacking! 🚀</p>

          <hr>

          <p>HackRadar Team</p>
        `,
      });

      // Disable alert after sending
    alert.enabled = false;
    await alert.save();

    console.log(`✅ Reminder sent to ${user.email}`);
    console.log(`🚫 Alert disabled: ${alert.title}`);
    }
  } catch (err) {
    console.error("❌ Cron Error:", err.message);
  }
});