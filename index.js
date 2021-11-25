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
        const { data:user } = await octokit.request(`GET /users/${req.params.id}`, {
            username: 'username'
        });
        debug(`data  = ${user.login}, ${user.avatar_url}`);

        res.render('index', { user });
    } catch (error) {
        console.log(error)
    }

});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
