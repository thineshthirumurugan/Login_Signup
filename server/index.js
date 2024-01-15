const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON data

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employee"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.listen(8000, () => {
    console.log("App is running on port 8000");
});

//Login Find One
// result is an array containing the rows returned by the SQL query.
// result.length checks the number of rows in the result array.
// If result.length is 0, it means that no user was found with the provided email in the database. In this case, the server responds with a 401 Unauthorized status and a message indicating that the email or password is invalid.
// If result.length is greater than 0, it means a user with the provided email exists. The code then proceeds to check whether the provided password matches the stored hashed password for that user.
// const user = result[0];
// This line extracts the first row from the result array, assuming that the SQL query is designed to return only one record. In many authentication systems, email addresses are expected to be unique, so the query is likely designed to return either one record (if a user with the provided email exists) or none (if the email doesn't exist).

// After extracting the user data from the result array, it allows the code to access the properties of the user, such as user.password. In the subsequent code, it's used to compare the provided password with the stored hashed password for authentication.

// Here's the relevant part of the code:

// javascript
// Copy code
// // ...
// const user = result[0];

// // Compare the provided password with the hashed password in the database
// const passwordMatch = await bcrypt.compare(password, user.password);

// if (passwordMatch) {
//     res.status(200).json({ "message": "Login successful", "user": user });
// } else {
//     res.status(401).json({ "message": "Invalid email or password" });
// }
// // ...

// Handling POST request to the '/login' endpoint
app.post('/login', async (req, res) => {
    // Extracting email and password from the request body
    const { email, password } = req.body;

    // SQL query to select all columns from the 'register' table where email matches
    const sql = "SELECT * FROM register WHERE email = ?";

    // Performing the database query with the provided email
    db.query(sql, [email], (err, result) => {
        // Handling potential errors in the database query
        if (err) {
            // If there's an error, respond with a 500 Internal Server Error and the error message
            res.status(500).json({ "error": err.message });
        } else {
            // Checking if the query returned no rows (user not found)
            if (result.length === 0) {
                // Responding with a 401 Unauthorized status and an error message
                res.status(401).json({ "message": "Invalid email or password" });
            } else {
                // Extracting the first row from the result (assuming unique email)
                const user = result[0];

                // Comparing the provided password with the stored password
                if (user.password === password) {
                    // Responding with a 200 OK status and a success message
                    res.status(200).json({ "message": "Login successful", "user": user });
                } else {
                    // Responding with a 401 Unauthorized status if the password doesn't match
                    res.status(401).json({ "message": "Invalid email or password" });
                }
            }
        }
    });
});


// Post the record
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO register (name, email, password) VALUES (?, ?, ?);";

    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            res.status(500).json({ "error": err.message });
        } else {
            res.status(200).json({ "message": result.affectedRows });
        }
    });
});
