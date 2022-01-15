const express = require('express');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 9000;
dotenv.config();


const app = express();


app.get('/', (req, res) => {
    res.status(200).send('Hello from React Diagrams backend');
})


app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
})