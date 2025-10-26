const express = require("express");
const path = require("path");
const debug = require("debug")("git");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");

// Using native fetch (Node >=18) to call GitHub API directly

app.get("/users/:id", async (req, res) => {
  try {
    const username = req.params.id;
    debug(`id = ${username}`);
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          "User-Agent": "useapigit-app",
          Accept: "application/vnd.github+json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}`);
    }
    const user = await response.json();
    debug(`data  = ${user.login}, ${user.avatar_url}`);
    res.render("index", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching user");
  }
});

app.get("/users/:id/repos", async (req, res) => {
  try {
    debug(`id = ${req.params.id}`);
    debug(`sort = ${req.url}`);
    const response = await fetch(`https://api.github.com${req.url}`, {
      headers: {
        "User-Agent": "useapigit-app",
        Accept: "application/vnd.github+json",
      },
    });
    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}`);
    }
    const repos = await response.json();
    res.render("repos", { repos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching repos");
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
