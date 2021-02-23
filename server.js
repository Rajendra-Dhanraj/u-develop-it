const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require("sqlite3").verbose();
// attaches function to verify input
const inputCheck = require("./utils/inputCheck");

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database (SQLITE3)
const db = new sqlite3.Database("./db/election.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the election database.");
});

// Get all candidates
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT * FROM candidates`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: rows,
    });
  });
});

// GET a single candidate
// db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) =>{
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// Get single candidate
app.get("/api/candidate/:id", (req, res) => {
  const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: row,
    });
  });
});

// DELETE a candidate displayed in console.
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result, this, this.changes);
//   });

// Delete a candidate via server
app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({
      message: "successfully deleted",
      changes: this.changes,
    });
  });
});

// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//             VALUES (?,?,?,?)`;
// const params = [1, "Ronald", "Firbank", 1];
// //ES5 function, not arrow function, to use "this"
// db.run(sql, params, function (err, result) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result, this.lastID);
// });

// Create a candidate via server/express
app.post("/api/candidate", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  // ES5 function, not arrow function, to use `this`
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: "success",
      data: body,
      id: this.lastID,
    });
  });
});

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
