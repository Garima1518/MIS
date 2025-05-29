const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const cron = require("node-cron");


const { MongoClient } = require("mongodb");
// const ADMIN_KEY = "mtrack"; // Replace with a stronger secret in production

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// MongoDB connection
mongoose.connect('mongodb://misAdmin:SecurePass123@localhost:27017/data', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
const dbName = "timesheetDB";
// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  stream: String,
});
const User = mongoose.model("User", userSchema, "users");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "garima.roy@g-ushin.com", 
//     pass: "fbnl ajnl kjhi ouse"               // Use an App Password (not your main Gmail password)
//   },
// });
// === Derive email from user name ===
// function deriveEmail(name) {
//   return `${name.toLowerCase().replace(/\s+/g, ".")}@g-ushin.com`;
// }

// async function sendReminderEmailsToAll() {
//   const users = await User.find({});
//   let successCount = 0;
//   let failCount = 0;

//   for (const user of users) {
//     const email = deriveEmail(user.name);
//     const mailOptions = {
//       from: '"M-Track Reminder" <garima.roy@g-ushin.com>',
//       to: email,
//       subject: "Reminder to Fill M-Track",
//       text: `Dear ${user.name},\n\nPlease fill in your M-Track timesheet today.\n\nRegards,\nTeam MIS`,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log(`✅ Sent to ${email}`);
//       successCount++;
//     } catch (error) {
//       console.error(`❌ Failed to send to ${email}: ${error.message}`);
//       failCount++;
//     }

//     await new Promise(resolve => setTimeout(resolve, 300)); // Delay to avoid Gmail rate-limiting
//   }

//   console.log(`📬 Email Summary → Success: ${successCount}, Failed: ${failCount}, Total: ${users.length}`);
// }




// app.post("/admin/send-all-reminders", async (req, res) => {
//   const key = req.headers["x-admin-key"];

//   if (key !== ADMIN_KEY) {
//     return res.status(403).json({ success: false, message: "Forbidden: Invalid admin key." });
//   }

//   try {
//     await sendReminderEmailsToAll();
//     res.json({ success: true, message: "All reminders sent successfully." });
//   } catch (error) {
//     console.error("❌ Error sending reminders:", error.message);
//     res.status(500).json({ success: false, message: "Error sending emails." });
//   }
// });





// cron.schedule("0 11 * * 1-5", async () => {
//   console.log("⏰ [11 AM] Sending M-Track first reminder...");
//   await sendReminderEmailsToAll("first");
// });
// cron.schedule("2 16 * * 1-5", async () => {
//   console.log("⏰ [4:02 PM] Sending M-Track reminder...");
//   await sendReminderEmailsToAll("evening");
// });



// Routes
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/all-user-data", async (req, res) => {
  try {
    const users = await User.find({});
    const allCollections = await mongoose.connection.db
      .listCollections()
      .toArray();

    const result = [];

    for (const user of users) {
      const empId = user.employeeId;
      const matchedCollection = allCollections.find((col) =>
        col.name.includes(empId)
      );

      if (matchedCollection) {
        try {
          const collection = mongoose.connection.db.collection(
            matchedCollection.name
          );
          const data = await collection.find({}).toArray();
          result.push({ userInfo: user, entries: data });
        } catch {
          result.push({ userInfo: user, entries: [] });
        }
      } else {
        result.push({ userInfo: user, entries: [] });
      }
    }

    res.json({ success: true, usersData: result });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/user-data", async (req, res) => {
  const { employeeId } = req.query;
  if (!employeeId) return res.status(400).json({ error: "Missing employeeId" });

  try {
    const user = await User.findOne({ employeeId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const collection = mongoose.connection.db.collection(
      `${user.name}_${user.employeeId}`
    );
    const data = await collection.find({}).toArray();

    res.json({ success: true, userInfo: user, entries: data });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { name, employeeId, stream } = req.body;
  if (!name || !employeeId || !stream) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = await User.findOne({ employeeId });
  if (existingUser) {
    return res.status(400).json({ error: "Employee ID already exists" });
  }

  const newUser = new User({ name, employeeId, stream });
  await newUser.save();

  const userCollectionName = `${name.replace(/\s+/g, "_")}_${employeeId}`;
  await mongoose.connection.db.createCollection(userCollectionName);

  res.json({
    message: "Signup successful",
    userCollection: userCollectionName,
  });
});

app.post("/login", async (req, res) => {
  const { name, employeeId } = req.body;
  const user = await User.findOne({ name, employeeId });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login successful", employeeId });
});

app.post("/save-data", async (req, res) => {
  try {
    const { collectionName, data } = req.body;
    const db = mongoose.connection.useDb("data");
    const collection = db.collection(collectionName);
    await collection.insertMany(data);

    const descCollection = db.collection("project_descriptions");
    const descriptions = data
      .filter((item) => item.project && item.description)
      .map((item) => ({
        employeeId: collectionName.split("_").pop(),
        project: item.project.trim().toLowerCase(),
        description: item.description.trim(),
      }));
    if (descriptions.length > 0) {
      await descCollection.insertMany(descriptions, { ordered: false });
    }

    res.json({ message: "Report submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error: Unable to submit report." });
  }
});

app.get("/get-data/:employeeId/:name", async (req, res) => {
  const { employeeId, name } = req.params;
  const collection = mongoose.connection.db.collection(
    `${name.replace(/\s+/g, "_")}_${employeeId}`
  );
  const data = await collection.find().toArray();
  res.json(data);
});

app.get("/daily-sheet/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const collection = mongoose.connection.db.collection(collectionName);

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await collection
      .find({
        date: { $gte: today.toISOString().split("T")[0] },
      })
      .toArray();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching data." });
  }
});

app.get("/time-sheet/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { filter } = req.query;
    const collection = mongoose.connection.db.collection(collectionName);

    let query = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "today") {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      query.date = { $gte: today.toISOString(), $lt: tomorrow.toISOString() };
    } else if (filter === "week") {
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      query.date = { $gte: start.toISOString(), $lt: end.toISOString() };
    } else if (filter === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      query.date = { $gte: start.toISOString(), $lt: end.toISOString() };
    }

    const data = await collection.find(query).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching data." });
  }
});

app.post("/add-task", async (req, res) => {
  const { collectionName, utilizedHour, date } = req.body;
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const todayTasks = await collection.find({ date }).toArray();
    const total = todayTasks.reduce(
      (sum, t) => sum + (parseFloat(t.utilizedHour) || 0),
      0
    );

    if (total + utilizedHour > 8) {
      return res.status(400).json({ message: "Cannot exceed 8 hours." });
    }

    await collection.insertOne(req.body);
    res.json({ message: "Task added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/descriptions/:employeeId/:project", async (req, res) => {
  const { employeeId, project } = req.params;
  try {
    const db = mongoose.connection.useDb("data");
    const collection = db.collection("project_descriptions");

    const results = await collection
      .find({
        employeeId,
        project: { $regex: `^${project.trim().toLowerCase()}$`, $options: "i" },
      })
      .project({ description: 1, _id: 0 })
      .toArray();

    const descriptions = [
      ...new Set(results.map((entry) => entry.description)),
    ];
    res.json({ success: true, descriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/update-task", async (req, res) => {
  try {
    const { _id, collectionName, ...updateFields } = req.body;
    if (!collectionName || !_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const collection = mongoose.connection
      .useDb("data")
      .collection(collectionName);
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: "Task updated." });
    } else {
      res.status(404).json({ success: false, message: "Task not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "Update failed." });
  }
});

app.delete("/delete-task/:id", async (req, res) => {
  const { id } = req.params;
  const { collectionName } = req.body;
  try {
    const collection = mongoose.connection
      .useDb("data")
      .collection(collectionName);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.json({ success: true, message: "Task deleted." });
    } else {
      res.status(404).json({ success: false, message: "Task not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "Delete failed." });
  }
});

app.post("/update-field", async (req, res) => {
  const { field, value, key, collectionName } = req.body;

  if (!field || !value || !key || !collectionName) {
    return res.status(400).send("Missing required data");
  }

  // Robust key splitting
  const parts = key.split("_");
  if (parts.length < 4) {
    return res.status(400).send("Invalid key format");
  }

  const ji = parts.pop();
  const description = parts.pop();
  const code = parts.pop();
  const project = parts.join("_");

  try {
    const db = mongoose.connection.useDb("data");
    const collection = db.collection(collectionName);

    const matchQuery = {
      project: new RegExp(`^${project}$`, "i"),
      code: new RegExp(`^${code}$`, "i"),
      description: new RegExp(`^${description}$`, "i"),
      ji: new RegExp(`^${ji}$`, "i"),
    };

    const result = await collection.updateMany(matchQuery, {
      $set: { [field]: value },
    });

    console.log("Update Result:", result);
    res.json({ modified: result.modifiedCount });
  } catch (err) {
    console.error("❌ Error updating MongoDB:", err);
    res.status(500).send("Server error");
  }
});
app.use(express.static(__dirname));
// Serve index.html by default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(PORT, () => {
  console.log(`🚀 Server is running otn por http://172.16.101.127:${PORT}`);
});
