const pageRoutes = require("./routes/index");
const apiRoutes = require("./routes/api");
const connectDB = require("./config/db");
const express = require("express");
const expressLayouts = require('express-ejs-layouts')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(expressLayouts)
app.set('layout', './layouts/full-width')
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', pageRoutes);
app.use('/api', apiRoutes);

connectDB().then((conn) => {
    console.log("MongoDB connected: ",conn.connection.db.databaseName);
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.log(error);
    process.exit(1);
})