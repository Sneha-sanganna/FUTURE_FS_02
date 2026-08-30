require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Lead = require("./models/Lead");

async function seed() {
  await connectDB();

  try {
    const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "Admin@123";

    let admin = await User.findOne({ email });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 12);
      admin = await User.create({
        name: "CRM Admin",
        email,
        password: hashedPassword,
        role: "admin"
      });
      console.log(`Admin created: ${email}`);
    } else {
      console.log(`Admin already exists: ${email}`);
    }

    const leadCount = await Lead.countDocuments();

    if (leadCount === 0) {
      await Lead.insertMany([
        {
          name: "Rahul Sharma",
          email: "rahul@example.com",
          phone: "9876543210",
          source: "Website",
          status: "New",
          notes: "Interested in the service."
        },
        {
          name: "Priya Kumar",
          email: "priya@example.com",
          phone: "9123456780",
          source: "Referral",
          status: "Contacted",
          notes: "Called and shared product details."
        },
        {
          name: "Arun Raj",
          email: "arun@example.com",
          phone: "9988776655",
          source: "Social Media",
          status: "Converted",
          notes: "Customer converted successfully."
        }
      ]);
      console.log("Sample leads inserted.");
    }

    console.log("Seed completed.");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
