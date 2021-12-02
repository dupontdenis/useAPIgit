const express = require('express');
const { Octokit } = require("@octokit/core");
const path = require('path');
const debug = require('debug')('git');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

const octokit = new Octokit({});

app.get('/users/:id', async (req, res) => {

    try {
        debug(`id = ${req.params.id}`);
        const { data: user } = await octokit.request(`GET /users/{username}`, {
            username: req.params.id,
        });
        debug(`data  = ${user.login}, ${user.avatar_url}`);

        res.render('index', { user });
    } catch (error) {
        console.log(error)
    }

});

app.get('/users/:id/repos', async (req, res) => {

    try {
        debug(`id = ${req.params.id}`);
        debug(`sort = ${req.url}`);
        const { data: repos } = await octokit.request(`GET ${req.url}`);
        res.render('repos', { repos });
    } catch (error) {
        console.log(error)
    }

});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
