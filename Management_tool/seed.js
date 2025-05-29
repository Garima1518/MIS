const { MongoClient } = require("mongodb");

async function seed() {
  const client = await MongoClient.connect("mongodb://misAdmin:SecurePass123@127.0.0.1:27017", {
    useUnifiedTopology: true,
  });

  const db = client.db("data");
  const collection = db.collection("project_descriptions");

  await collection.insertOne({
    employeeId: "1057",
    project: "DigiKey",
    description: "Initial setup for DigiKey integration",
  });

  console.log("✅ Test description inserted.");
  await client.close();
}

seed();