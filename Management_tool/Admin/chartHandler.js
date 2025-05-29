app.get("/api/dashboard-data", async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const userCollections = collections
        .map(col => col.name)
        .filter(name => name !== 'users' && name !== 'system.indexes'); // exclude non-task collections
  
      let blockedTasks = 0;
      let delayedTasks = 0;
  
      for (const name of userCollections) {
        const col = mongoose.connection.db.collection(name);
        const blocked = await col.countDocuments({ status: "Blocked" });
        const delayed = await col.countDocuments({ status: "Delayed" });
  
        blockedTasks += blocked;
        delayedTasks += delayed;
      }
  
      res.json({ blockedTasks, delayedTasks });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  