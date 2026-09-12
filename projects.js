/* Everything the hub shows lives in this file. Edit it, refresh, done.

   Each project is an object in `projects`. The only required fields are
   `name`, `repo` and `category`; everything else is optional.

     name         What the card is called.
     repo         The GitHub repository name. Links are built from it:
                    source    https://github.com/<user>/<repo>
                    releases  https://github.com/<user>/<repo>/releases/latest
                    site      https://<user>.github.io/<repo>/
     category     One of the ids in `categories` below.
     tagline      One line, shown under the name.
     description  A sentence or three. Plain text.
     tags         Short labels: language, framework, platform, licence.
     site         true   → the project has a GitHub Pages site at the default address
                  "app/" → a path inside that site (for a page that is not index.html)
                  "https://…" → a full address, used as-is
     open         Label for the site button. Defaults to "Open".
     download     true → a "Download" button pointing at the latest release.
     status       "early" (works, barely tested) · "wip" (being built)
                  · "soon" (not published yet, links hidden). Omit when it is done.
     note         One short caveat under the description, e.g. "Singleplayer only".
     links        Extra buttons. { label, href } for any address, or
                  { label, path } for a path inside the repository on GitHub.
     folder       Where it lives on this machine. For you; never shown.
*/

window.HUB = {
	// Your GitHub username. Leave it empty and the hub reads it from the
	// address when served from <user>.github.io. Fill it in to make the links
	// work when you open index.html from disk, or from a custom domain.
	user: "",

	title: "Projects",
	tagline:
		"Things I have built. Each one lives in its own repository; the ones that " +
		"run in a browser are hosted right here.",

	// One anonymous request to the GitHub API per visit, to show when each
	// repository was last pushed to and to grey out any that do not exist yet.
	// Limited to 60 requests an hour per visitor, which is plenty. Set to false
	// to keep the page completely static.
	github: true,

	categories: [
		{
			id: "web",
			name: "Web apps",
			blurb: "Open them in a browser. The ones marked self-hosted need a local Node server for their data.",
		},
		{
			id: "editors",
			name: "Editors",
			blurb: "Browser-based editors with a live preview, each also wrapped as a Windows app that opens its file type.",
		},
		{
			id: "minecraft",
			name: "Minecraft mods",
			blurb: "Client-side mods. Download the jar from the latest release and drop it into your mods folder.",
		},
		{
			id: "windows",
			name: "Windows tools",
			blurb: "Small utilities that run on the PC. Clone the repository and follow its README.",
		},
		{
			id: "mobile",
			name: "Mobile",
			blurb: "Made for the phone. Two are web pages you open in Safari; Lumen is a native iPhone app.",
		},
	],

	projects: [
		/* ------------------------------------------------------------ web */
		{
			name: "Block Out",
			repo: "block-out",
			category: "web",
			tagline: "A colour-sort block puzzle where every level is provably solvable.",
			description:
				"Coloured blocks are packed into a board; drag each one out through the gate of its " +
				"own colour. Other blocks are in the way, so the order matters. Levels are generated " +
				"on the fly and guaranteed solvable by construction, not by trial and error.",
			tags: ["Game", "Canvas", "PWA", "Works offline"],
			site: true,
			open: "Play",
			folder: "block it like game",
		},
		{
			name: "GeoGuessr Compendium",
			repo: "geoguessr-compendium",
			category: "web",
			tagline: "What actually narrows down a GeoGuessr location, country by country.",
			description:
				"Road classification systems and their numbering logic, road markings, bollards, " +
				"signage conventions and licence plates, with a comparison table across countries. " +
				"Only places with official Street View coverage are included.",
			tags: ["Reference", "React", "TypeScript", "Vite"],
			site: true,
			folder: "GeoGuessr",
		},
		{
			name: "Instrument Helper",
			repo: "instrument-helper",
			category: "web",
			tagline: "A practice tool for complete beginners on guitar, piano, lyre harp and kalimba.",
			description:
				"A getting-started guide with labelled diagrams, a live tuner through the microphone, " +
				"songs with fingerings for your instrument, and a practice mode that listens to the " +
				"chord you play and tells you what you got instead.",
			tags: ["Music", "Web Audio", "Microphone"],
			site: true,
			note: "Needs a microphone. Saved songs stay in the browser unless you run the local server.",
			folder: "Instrument Helper",
		},
		{
			name: "Prism News",
			repo: "prism-news",
			category: "web",
			tagline: "A news aggregator that shows the same story across the political spectrum.",
			description:
				"Clusters coverage of one story from outlets left, centre and right, and surfaces " +
				"blindspots: stories that only one side is reporting. Fed by RSS through a small " +
				"Express server, with a React front end.",
			tags: ["React", "Express", "RSS", "Self-hosted"],
			note: "Self-hosted: needs Node 20+ to fetch the feeds.",
			folder: "Ground News Like App",
		},
		{
			name: "Nährstoff-Küche",
			repo: "naehrstoff-kueche",
			category: "web",
			tagline: "Pantry, recipes and a nutrient calculator that counts vitamins, not calories.",
			description:
				"Stock management, recipe suggestions and a nutrient calculator built on the German " +
				"Bundeslebensmittelschlüssel, going by vitamins, minerals, protein and amino acids. " +
				"Plus an exercise planner following the WHO guidelines, with concrete exercises rather " +
				"than weekly minutes. All personal data stays in one file per profile on your machine.",
			tags: ["German", "Nutrition", "Node", "Local-first", "Self-hosted"],
			note: "In German. Self-hosted: runs locally with Node.",
			folder: "Diets-Healthy-Living",
		},

		/* -------------------------------------------------------- editors */
		{
			name: "Markdown Studio",
			repo: "markdown-studio",
			category: "editors",
			tagline: "A Markdown editor with outline and preview that opens .md files from Windows.",
			description:
				"One self-contained HTML file. Double-click a Markdown file and it opens in the editor " +
				"in its own window; open several and they line up in one window above the outline. " +
				"Save writes straight back to the file you opened.",
			tags: ["Editor", "Markdown", "Single file", "Windows"],
			site: "src/markdown-studio.html",
			folder: "Markdown-Studio",
		},
		{
			name: "Web Studio",
			repo: "web-studio",
			category: "editors",
			tagline: "HTML, CSS and JavaScript side by side, with a preview you can drag things around in.",
			description:
				"Three files in one window, suggestions that know which of the three you are typing " +
				"in, and a Design mode where the preview stops being a picture of your page and " +
				"becomes the page. Opens .html files from Windows together with the stylesheet and " +
				"script they reference.",
			tags: ["Editor", "HTML", "CSS", "JavaScript", "Windows"],
			site: "app/",
			folder: "Web-Studio",
		},
		{
			name: "UXML Workbench",
			repo: "uxml-workbench",
			category: "editors",
			tagline: "A UXML and USS editor for Unity's UI Toolkit, with inline help and live preview.",
			description:
				"Context-aware autocompletion for the UnityEngine.UIElements control set, the markup " +
				"and the stylesheet edited together as one linked pair, and a preview you can " +
				"rearrange by dragging. No build step and nothing to install.",
			tags: ["Editor", "Unity", "UI Toolkit", "Windows"],
			site: true,
			folder: "UXML-Editor",
		},

		/* ------------------------------------------------------ minecraft */
		{
			name: "Cinematic Editor",
			repo: "cinematic-editor",
			category: "minecraft",
			tagline: "A camera and replay editor for Minecraft 1.8.9 Forge.",
			description:
				"Fly a camera along a keyframed path, record a fight and replay it as ghosts so you " +
				"can frame the shot afterwards, grade the picture with 37 keyframable effects, and " +
				"export the result as a PNG sequence or straight into ffmpeg. Client-side only.",
			tags: ["Forge 1.8.9", "Java", "GPL-3.0"],
			download: true,
			status: "early",
			note: "Early version with medicore performance. Requires Forge 11.15.1.2318+ for 1.8.9.",
			links: [{ label: "Details", href: "mods.html#cineditor" }],
			folder: "Cinematic-Editor-1.8.9",
		},
		{
			name: "Mason",
			repo: "mason",
			category: "minecraft",
			tagline: "Visual world editing for Minecraft 1.8.9 Forge, with a panel instead of a command line.",
			description:
				"Selections you can see, weighted block palettes, region operations, terrain " +
				"brushes, a clipboard with rotation, portable schematics and 24 steps of undo. " +
				"Singleplayer only: a client mod cannot edit a server's world.",
			tags: ["Forge 1.8.9", "Java", "GPL-3.0"],
			download: true,
			status: "early",
			note: "Early version with decent performance. Back up any world you care about.",
			links: [{ label: "Details", href: "mods.html#mason" }],
			folder: "Mason-1.8.9",
		},
		{
			name: "PvP Trainer",
			repo: "pvp-trainer",
			category: "minecraft",
			tagline: "A client-side practice overlay for 1.8 melee.",
			description:
				"Reports the reach of every hit, whether it critted and whether your sprint reset " +
				"landed in time, and floats the range to each player above their nametag. Every " +
				"reading comes from the client's own copy of the fight; nothing is sent to the server.",
			tags: ["Forge 1.8.9", "Java"],
			download: true,
			folder: "PvP-Trainer-1.8.9",
		},
		{
			name: "Command Studio",
			repo: "command-studio",
			category: "minecraft",
			tagline: "Build commands and author data packs without leaving the game.",
			description:
				"Around fifty command recipes with labelled fields, assembled live and checked against " +
				"the server's real command tree on every keystroke. A data pack editor with starter " +
				"templates, a visual mode for functions, recipes and tags, and export to .zip.",
			tags: ["Fabric", "Minecraft 26.1", "Java", "MIT"],
			download: true,
			note: "Requires Fabric Loader 0.19.3+, Fabric API and Java 25+.",
			folder: "Minecraft-Command-Creation",
		},

		/* -------------------------------------------------------- windows */
		{
			name: "LocalShare",
			repo: "localshare",
			category: "windows",
			tagline: "Move files between iPhone, iPad and a Windows PC over your own Wi-Fi.",
			description:
				"The PC runs a small web server; the phone opens it in Safari by scanning a QR code. " +
				"No cloud, no account, nothing to install on the phone. Uploads are chunked and " +
				"resume after a dropped connection. Pure Python standard library.",
			tags: ["Python", "No dependencies", "Wi-Fi"],
			folder: "Local file sharing",
		},
		{
			name: "iPad → PC Drawing Tablet",
			repo: "ipad-pencil-for-pc",
			category: "windows",
			tagline: "Use an iPad and Apple Pencil as a pressure-sensitive tablet for Windows.",
			description:
				"A patch set and build scripts on top of Weylus: pen pressure on Windows, which " +
				"has never made it into an official Weylus release, a fix for the video encoder " +
				"dropping frames, and a few client extras such as two-finger undo and a pressure curve. " +
				"No native iOS app; it works from Safari.",
			tags: ["Weylus", "Rust", "WSL build"],
			links: [{ label: "Guide", path: "blob/main/GUIDE.md" }],
			folder: "Ipad-Pencil-for-Pc",
		},
		{
			name: "Spotify Ad Muter",
			repo: "spotify-ad-muter",
			category: "windows",
			tagline: "Mutes Spotify's own audio channel during ads, and nothing else.",
			description:
				"Watches the Spotify window title, counts ads per day, and once more than ten have " +
				"played it drops Spotify's per-app volume to zero through the Windows mixer until " +
				"the music comes back. Runs from the system tray.",
			tags: ["Python", "Tray app"],
			folder: "spotify_ad_muter",
		},
		{
			name: "Project Hub",
			repo: "project-hub",
			category: "windows",
			tagline: "One window that starts and stops every local dev server.",
			description:
				"A single taskbar icon instead of a shortcut per project. Each project is a card: " +
				"start its server, open it in the browser, stop it and everything it spawned, or " +
				"jump to its folder. Cards turn green when the port answers.",
			tags: ["Node", "Launcher"],
			folder: "Project Organiser",
		},

		/* --------------------------------------------------------- mobile */
		{
			name: "Lumen",
			repo: "lumen",
			category: "mobile",
			tagline: "A manual camera and a masked photo editor for iPhone, in one app.",
			description:
				"Shutter, ISO, focus and white balance under your control, RAW capture, and " +
				"stacked local adjustment layers with radial, linear, brush, luminance and subject " +
				"masks, previewed through Metal. Built on Windows via a GitHub Actions macOS runner " +
				"and installed with a free Apple ID.",
			tags: ["Swift", "iOS", "AVFoundation", "Metal"],
			links: [{ label: "Builds", path: "actions" }],
			note: "Unsigned .ipa from the Actions builds; sign and install with AltServer.",
			folder: "Camera App",
		},
		{
			name: "CoC Companion",
			repo: "coc-strategy-guide",
			category: "mobile",
			tagline: "Attack guides and a hero equipment simulator for Clash of Clans.",
			description:
				"Compare loadouts and see damage, effective HP and ability output at any level " +
				"combination, and read Town Hall-filtered attack guides with the simulator embedded " +
				"in the text. All game data is validated at build time.",
			tags: ["Next.js", "TypeScript", "MDX"],
			site: true,
			folder: "Mobile Apps/CoC Strategy Guide",
		},
		{
			name: "Folder Player",
			repo: "folder-player",
			category: "mobile",
			tagline: "A one-file music player for the phone.",
			description:
				"Pick your tracks and they queue up in order, with seek, shuffle and a now-playing " +
				"bar. Nothing uploads; the files stay on your phone. One HTML file, made for Safari.",
			tags: ["Single file", "Audio"],
			site: "player.html",
			folder: "Mobile Apps/Mp3 player",
		},
	],
};
