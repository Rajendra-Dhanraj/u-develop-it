const express = require("express");
const db = require("./db/database");

const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require("./routes/apiRoutes");

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use("/api", apiRoutes);

// **KEEP AS LAST ROUTE** Default response for any other request not found - 404 message will be displayed (Catch Call).
app.use((req, res) => {
  res.status(404).end();
});

// Connection wrapped in an event handler to ensure server doesnt run before database is loaded.
db.on("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
