const express = require('express');

const apiRouter = require('./api.api-router');

const server = express();

server.use(express.json());

// for URLs beginnning with /api
server.use('api', apiRouter);

server.get('/', (req, res) => {
    res.send(`<h2>The app is working<h2>`)
});

const port = 5000;
server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});