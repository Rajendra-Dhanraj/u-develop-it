const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());





// **KEEP AS LAST ROUTE** Default response for any other request not found - 404 message will be displayed (Catch Call).
app.use((req, res) => {
    res.status(404).end();
});

// Connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
