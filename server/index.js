require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3005;
const jwt = require("jsonwebtoken");
const path = require("path");const cors = require('cors');


app.use(cors());

app.use(require('body-parser').json());

app.use(require('morgan')('dev'));

app.use((req, res, next) => {
    const auth = req.headers.authorization;
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    try {
        const { id } = jwt.verify(token, process.env.JWT);
        req.userID = id;
    } catch {
        req.userID = null;
    }
    next();
});

app.use(express.static(path.join(__dirname, "..",  "client/dist")));

app.get(`/`, (req, res) => {
    res.sendFile(path.join(__dirname, "..",  "client/dist/index.html"));
});

app.use('/api', require('./api'));
app.use('/auth', require('./auth'));


app.listen(PORT, (err) => {
    if (!err) {
        console.log(`listening on port ${PORT}`);
    } else {
        console.log(`Server Error`);
    }
});
