const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const PORT = process.env.PORT || 9000;
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Hello from React Diagrams backend');
})

app.post('/api/state/cache', (req, res) => {
    const { components, links } = req.body;
    console.log(components);
    console.log(links);
    res.status(204).json({
        components: components,
        links: links
    });
})


app.listen(PORT, () => {
    console.log(`Server listening on port : ${PORT}`);
})