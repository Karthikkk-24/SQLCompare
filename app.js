const express = require('express');
const multer = require('multer');
const sqlParser = require('sql-parser');

const app = express();
const port = 3000;

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle file uploads and SQL structure comparison
// Handle file uploads and SQL structure comparison
app.post('/compare', upload.array('file', 2), (req, res) => {
    if (req.files.length !== 2) {
        return res.status(400).send('Please upload two SQL files.');
    }

    const sql1 = req.files[0].buffer.toString();
    const sql2 = req.files[1].buffer.toString();

    // Parse SQL statements using sql-parser
    const parsedSql1 = sqlParser.parse(sql1);
    const parsedSql2 = sqlParser.parse(sql2);

    // Compare parsed SQL structures (you'll need to implement your own comparison logic)
    const structureDifference = compareSqlStructures(parsedSql1, parsedSql2);

    res.send(`
        <h1>SQL Structure Difference</h1>
        <pre>${structureDifference}</pre>
    `);
});


function compareSqlStructures(sql1, sql2) {
    // Implement your own comparison logic here
    // Compare the parsed SQL structures and return the difference
    // You may need to traverse the SQL parse trees and identify differences in tables, columns, etc.
    return 'Comparison result goes here';
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
