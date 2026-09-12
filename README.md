# Projects hub

The front page for every project in `Public`, live at <https://public-downloads.github.io/start/>.
One card per project, each linking to its own repository and, where it runs in a browser, to its
own GitHub Pages site. Plain HTML, CSS and JavaScript — no build step, no dependencies. Open
`index.html` in a browser to see exactly what will be published.

```
index.html    the hub
style.css     its styles
projects.js   the list of projects — the only file you edit day to day
hub.js        renders the list, filters, builds the GitHub links
404.html      shown for addresses under /start/ that do not exist
.nojekyll     tells GitHub Pages to serve the files exactly as they are
```

This folder is the `start` repository. The Cinematic Editor + Mason page that used to live here
is now `../minecraft-mods/`, mirroring the `minecraft-mods` repository.

## Adding or editing a project

Everything on the page comes from `projects.js`. Add an object to `projects`, refresh, done.
Only `name`, `repo` and `category` are required:

| Field | What it does |
| --- | --- |
| `name` | What the card is called |
| `repo` | The GitHub repository name. Every link is built from it. |
| `category` | One of the ids in `categories` at the top of the file |
| `tagline` | One line under the name |
| `description` | A sentence or three |
| `tags` | Short labels: language, platform, licence |
| `site` | `true` if the repo has a Pages site at `https://public-downloads.github.io/<repo>/`; a path like `"app/"` if the page is not `index.html`; or a full `https://` address |
| `open` | Label for the site button, e.g. `"Play"`. Defaults to `"Open"` |
| `download` | `true` → Download button pointing at the latest GitHub release; `"file.jar"` → that file from the repo's `main` branch |
| `status` | `"early"`, `"wip"`, or `"soon"` (not published yet: card greyed out, links hidden). Omit when done |
| `note` | One short caveat, e.g. `"Singleplayer only"` |
| `links` | Extra buttons: `{ label, href }` for any address, `{ label, path }` for a path inside the repo on GitHub, `{ label, page }` for a page on another of your Pages sites (`"minecraft-mods/#mason"`) |
| `folder` | Where it lives on this machine. Never shown |

Cards are grouped by `categories`, in the order given there. Add a category by adding an entry;
give it a colour with a `.cat-<id> { --c: … }` rule in `style.css` or it inherits grey.

Two settings at the top of the file: `user` is the GitHub account (the hub would read it from
the address anyway, but setting it makes local previews work), and `repo` is the repository the
hub itself lives in, for the "Source for this page" link in the footer.

## Live data from GitHub

With `github: true`, the page makes one anonymous request to the GitHub API per visit (cached
for 15 minutes per tab) for the account's list of public repositories. It uses that to show
"Updated 3 days ago" and star counts on each card, and to grey out any card whose repository does
not exist yet — so cards come alive as you create each repo. If a card is greyed out although the
repo exists, the name in `projects.js` does not match. Anonymous requests are limited to 60 an
hour per visitor; one per visit is nowhere near that. If the request fails for any reason the
page simply shows what is in `projects.js`.

Set `github: false` for a page that never talks to anything.

## Publishing the hub

The `start` repo deploys through the GitHub Actions "static" workflow that is already in it:
upload the files in this folder (not `.claude/`), and a minute later
<https://public-downloads.github.io/start/> is updated.

## Downloads for the mods

The four mod repos currently hold the jar as a committed file, so each card's `download` names
that file (`"mason-0.8.0.jar"`). That means editing `projects.js` every time you upload a new
version. The way to never touch the hub again: on the repo's page, *Releases → Draft a new
release*, tag it (`v0.8.0`), drag the jar in, publish — then set `download: true`, which points
at `releases/latest` and always resolves to the newest one.

## Per-project status

Each project has its own public repository. Pages is free for public repos, and is enabled per
repo under *Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`*.

**Static, uploaded, needs Pages switched on**

| Project | Repo | Card opens |
| --- | --- | --- |
| Instrument Helper | `instrument-helper` | `/` (saved songs fall back to the browser's storage without the local server) |
| UXML Workbench | `uxml-workbench` | `/` |
| Markdown Studio | `markdown-studio` | `/markdown-studio.html` |
| Web Studio | `web-studio` | `/app/` |
| Folder Player | `mp3-player` | `/player.html` |
| Mods page | `minecraft-mods` | `/` — needs the page renamed `index.html` (see `../minecraft-mods/`) |

None of these use root-absolute paths, so they work from a `/<repo>/` subfolder unchanged.

**Needs a build** — Pages serves from `/<repo>/`, so the build has to know its base path.

| Project | Repo | What to set |
| --- | --- | --- |
| GeoGuessr Compendium | `geoguessr-compendium` | `base: '/geoguessr-compendium/'` in `vite.config.ts`, `npm run build`, upload the contents of `dist/`. It already uses a hash router and fetches its data through `BASE_URL`, so nothing else changes. |
| CoC Companion | `coc-guide` | Replace the `static.yml` workflow in the repo with the project's own `.github/workflows/deploy.yml`, with `NEXT_PUBLIC_BASE_PATH: /coc-guide` uncommented, and push the source. Pages source: *GitHub Actions*. |

**Not yet on GitHub**

| Project | Repo | Card offers once uploaded |
| --- | --- | --- |
| Block Out | `block-out` (not created) | Play — `index.html`, `manifest.webmanifest`, `sw.js`, `css/`, `js/`, `icons/` |
| Prism News | `prism-news` (empty) | GitHub |
| Nährstoff-Küche | `naehrstoff-kueche` (empty) | GitHub |
| LocalShare | `localshare` (empty) | GitHub |
| iPad → PC Drawing Tablet | `ipad-pencil-for-pc` (empty) | GitHub, Guide |
| Spotify Ad Muter | `spotify-ad-muter` (empty) | GitHub |
| Project Hub | `project-hub` (not created) | GitHub |
| Lumen | `lumen` (not created) | GitHub, Builds (the Actions page with the unsigned `.ipa`) |

## Previewing locally

Any static server works. With Python installed:

```bash
python -m http.server 5188
```

Then open <http://localhost:5188>. Opening `index.html` straight from disk works as well.
