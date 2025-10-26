import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import debugModule from "debug";

const debug = debugModule("git");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");

// Using Node's native fetch (Node >=18) to call the GitHub API directly

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
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
