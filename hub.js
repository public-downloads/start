/* Renders the hub from projects.js. No build step, no dependencies.

   Also runs on mods.html, where it only fills in the <a data-repo> links, so
   the GitHub username lives in exactly one place. */

(function () {
	"use strict";

	const HUB = window.HUB || {};
	const categories = HUB.categories || [];
	const projects = HUB.projects || [];

	/* ---------------------------------------------------------------- user */

	// Served from <user>.github.io, the address already says who you are.
	function detectUser() {
		if (HUB.user && HUB.user.trim()) return HUB.user.trim();
		const m = location.hostname.match(/^([a-z0-9-]+)\.github\.io$/i);
		return m ? m[1] : "";
	}

	const user = detectUser();

	// The repository this page is served from: configured, or read from the
	// first path segment of a project site (<user>.github.io/<repo>/), or the
	// user site itself when served from the root.
	function detectHubRepo() {
		if (HUB.repo && HUB.repo.trim()) return HUB.repo.trim();
		if (/\.github\.io$/i.test(location.hostname)) {
			const seg = location.pathname.split("/")[1];
			if (seg && !/\.[a-z0-9]+$/i.test(seg)) return seg;
		}
		return user ? `${user}.github.io` : "";
	}

	/* ---------------------------------------------------------------- urls */

	const repoUrl = (repo) => (user ? `https://github.com/${user}/${repo}` : null);

	// true → the latest GitHub release; a file name → that file from main.
	function downloadUrl(p) {
		if (!p.download || !user) return null;
		if (typeof p.download === "string") {
			return `${repoUrl(p.repo)}/raw/main/${p.download.replace(/^\/+/, "")}`;
		}
		return `${repoUrl(p.repo)}/releases/latest`;
	}

	const pagesUrl = (path) => (user ? `https://${user}.github.io/${path.replace(/^\/+/, "")}` : null);

	function siteUrl(p) {
		if (!p.site) return null;
		if (typeof p.site === "string" && /^https?:\/\//i.test(p.site)) return p.site;
		if (!user) return null;
		const base = `https://${user}.github.io/${p.repo}/`;
		return typeof p.site === "string" ? base + p.site.replace(/^\/+/, "") : base;
	}

	/* ------------------------------------------------------- dom helpers */

	function el(tag, attrs, ...children) {
		const node = document.createElement(tag);
		for (const [k, v] of Object.entries(attrs || {})) {
			if (v === null || v === undefined || v === false) continue;
			if (k === "class") node.className = v;
			else if (k === "text") node.textContent = v;
			else node.setAttribute(k, v === true ? "" : v);
		}
		for (const c of children) {
			if (c === null || c === undefined || c === false) continue;
			node.append(c);
		}
		return node;
	}

	function icon(id) {
		const paths = {
			web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
			editors: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
			minecraft: '<path d="M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5z"/><path d="M12 12l8.5-4.75M12 12v9.5M12 12L3.5 7.25"/>',
			windows: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
			mobile: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M10.5 18.5h3"/>',
		};
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("aria-hidden", "true");
		svg.innerHTML = paths[id] || '<circle cx="12" cy="12" r="4"/>';
		return svg;
	}

	/* -------------------------------------------------------------- card */

	const STATUS = {
		early: "Early",
		wip: "In progress",
		soon: "Coming soon",
	};

	// A button with no address (no username configured yet) is still drawn,
	// disabled, so the page looks the same before and after setup.
	function button(label, href, opts) {
		opts = opts || {};
		return el("a", {
			class: "btn" + (opts.primary ? " primary" : ""),
			href: href || null,
			title: href ? null : "Set `user` in projects.js to enable this link",
			"data-gh": opts.gh ? "" : null,
			text: label,
		});
	}

	function card(p) {
		const soon = p.status === "soon";
		const site = siteUrl(p);
		const download = downloadUrl(p);
		const source = repoUrl(p.repo);

		// The most useful thing a visitor can do gets the filled-in button.
		const buttons = [];
		if (p.site) buttons.push(button(p.open || "Open", site, { primary: true, gh: true }));
		if (p.download) buttons.push(button("Download", download, { primary: !p.site, gh: true }));
		buttons.push(button("GitHub", source, { primary: !p.site && !p.download, gh: true }));
		for (const l of p.links || []) {
			if (!l.label || !(l.href || l.path || l.page)) continue;
			let href = l.href || null;
			if (l.path) href = source ? `${source}/${l.path.replace(/^\/+/, "")}` : null;
			if (l.page) href = pagesUrl(l.page);
			buttons.push(button(l.label, href, { gh: !l.href }));
		}

		const search = [p.name, p.tagline, p.description, p.note, ...(p.tags || []), categoryName(p.category)]
			.filter(Boolean)
			.join(" ")
			.toLowerCase();

		return el(
			"article",
			{
				class: `card cat-${p.category}` + (soon ? " soon" : ""),
				"data-repo": p.repo,
				"data-cat": p.category,
				"data-search": search,
			},
			el(
				"div",
				{ class: "card-head" },
				el("span", { class: "tile" }, icon(p.category)),
				el(
					"div",
					{ class: "card-title" },
					el("h3", null, p.name),
					p.status && STATUS[p.status]
						? el("span", { class: `status ${p.status}`, text: STATUS[p.status] })
						: null
				)
			),
			p.tagline ? el("p", { class: "tagline", text: p.tagline }) : null,
			p.description ? el("p", { class: "desc", text: p.description }) : null,
			p.note ? el("p", { class: "note", text: p.note }) : null,
			p.tags && p.tags.length
				? el("ul", { class: "tags" }, ...p.tags.map((t) => el("li", { text: t })))
				: null,
			el(
				"div",
				{ class: "card-foot" },
				soon ? null : el("div", { class: "actions" }, ...buttons),
				el("span", { class: "meta", hidden: true })
			)
		);
	}

	function categoryName(id) {
		const c = categories.find((c) => c.id === id);
		return c ? c.name : id;
	}

	/* --------------------------------------------------------------- hub */

	function renderHub(root) {
		if (HUB.title) document.title = HUB.title;

		const title = document.getElementById("title");
		if (title && HUB.title) title.textContent = HUB.title;

		// The top-left corner says whose site this is once that is known.
		const brand = document.getElementById("brand");
		if (brand) brand.textContent = user || HUB.title || brand.textContent;

		const tagline = document.getElementById("tagline");
		if (tagline && HUB.tagline) tagline.textContent = HUB.tagline;

		const profile = document.getElementById("profile");
		if (profile) {
			if (user) profile.href = `https://github.com/${user}`;
			else profile.hidden = true;
		}

		const setup = document.getElementById("setup");
		if (setup) setup.hidden = !!user;

		const sites = projects.filter((p) => p.site && p.status !== "soon").length;
		const downloads = projects.filter((p) => p.download && p.status !== "soon").length;
		const stats = document.getElementById("stats");
		if (stats) {
			stats.textContent = [
				`${projects.length} projects`,
				sites ? `${sites} you can open right here` : null,
				downloads ? `${downloads} to download` : null,
			]
				.filter(Boolean)
				.join(" · ");
		}

		// Chips: All, then one per category that has something in it.
		const chips = document.getElementById("chips");
		const used = categories.filter((c) => projects.some((p) => p.category === c.id));
		const chipFor = (id, name, count) =>
			el(
				"button",
				{ class: "chip", type: "button", "data-cat": id, "aria-pressed": "false" },
				name,
				el("span", { class: "count", text: String(count) })
			);
		chips.append(chipFor("all", "All", projects.length));
		for (const c of used) {
			chips.append(chipFor(c.id, c.name, projects.filter((p) => p.category === c.id).length));
		}

		// Sections.
		for (const c of used) {
			const items = projects.filter((p) => p.category === c.id);
			root.append(
				el(
					"section",
					{ class: `group cat-${c.id}`, "data-cat": c.id, id: c.id },
					el("h2", null, c.name, el("span", { class: "count", text: String(items.length) })),
					c.blurb ? el("p", { class: "blurb", text: c.blurb }) : null,
					el("div", { class: "grid" }, ...items.map(card))
				)
			);
		}

		// Anything in a category that is not declared still gets shown.
		const orphans = projects.filter((p) => !categories.some((c) => c.id === p.category));
		if (orphans.length) {
			root.append(
				el(
					"section",
					{ class: "group", "data-cat": "other" },
					el("h2", null, "Other", el("span", { class: "count", text: String(orphans.length) })),
					el("div", { class: "grid" }, ...orphans.map(card))
				)
			);
		}

		root.append(el("p", { class: "empty", id: "empty", hidden: true, text: "Nothing matches." }));

		const footerSource = document.getElementById("hub-source");
		if (footerSource) {
			const hubRepo = detectHubRepo();
			if (user && hubRepo) footerSource.href = `https://github.com/${user}/${hubRepo}`;
			else footerSource.removeAttribute("href");
		}

		wireFilters(root, chips);
	}

	/* ----------------------------------------------------------- filters */

	function wireFilters(root, chips) {
		const search = document.getElementById("search");
		let activeCat = "all";

		function apply() {
			const q = (search.value || "").trim().toLowerCase();
			let shown = 0;
			for (const section of root.querySelectorAll(".group")) {
				let any = false;
				for (const c of section.querySelectorAll(".card")) {
					const ok =
						(activeCat === "all" || c.dataset.cat === activeCat) &&
						(!q || c.dataset.search.includes(q));
					c.hidden = !ok;
					if (ok) any = true;
				}
				section.hidden = !any;
				if (any) shown++;
			}
			document.getElementById("empty").hidden = shown > 0;
		}

		function setCat(id) {
			activeCat = id;
			for (const chip of chips.querySelectorAll(".chip")) {
				chip.setAttribute("aria-pressed", chip.dataset.cat === id ? "true" : "false");
			}
			const url = id === "all" ? location.pathname + location.search : "#" + id;
			history.replaceState(null, "", url);
			apply();
		}

		chips.addEventListener("click", (e) => {
			const chip = e.target.closest(".chip");
			if (chip) setCat(chip.dataset.cat);
		});

		search.addEventListener("input", apply);
		search.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				search.value = "";
				apply();
			}
		});

		// "/" focuses the search box from anywhere, like GitHub itself.
		document.addEventListener("keydown", (e) => {
			if (e.key === "/" && document.activeElement !== search && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				search.focus();
			}
		});

		const fromHash = location.hash.slice(1);
		setCat(categories.some((c) => c.id === fromHash) ? fromHash : "all");
	}

	/* ------------------------------------------------------------ github */

	// One request (per 15 minutes, per tab) for the whole list of public
	// repositories. Anything that goes wrong is silently ignored: the page is
	// complete without it.
	async function fetchRepos() {
		const key = "hub:repos:" + user;
		try {
			const cached = JSON.parse(sessionStorage.getItem(key) || "null");
			if (cached && Date.now() - cached.at < 15 * 60 * 1000) return cached.repos;
		} catch (_) {
			/* no session storage: fetch every time */
		}

		const repos = [];
		let url = `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100`;
		for (let page = 0; url && page < 5; page++) {
			const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
			if (!res.ok) throw new Error("GitHub API " + res.status);
			for (const r of await res.json()) {
				repos.push({ name: r.name, pushed_at: r.pushed_at, stars: r.stargazers_count });
			}
			const link = res.headers.get("Link") || "";
			const next = link.match(/<([^>]+)>;\s*rel="next"/);
			url = next ? next[1] : null;
		}

		try {
			sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), repos }));
		} catch (_) {
			/* storage full or blocked; fine */
		}
		return repos;
	}

	function ago(iso) {
		const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
		if (!isFinite(seconds) || seconds < 60) return "just now";
		const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
		const units = [
			["year", 31536000],
			["month", 2592000],
			["week", 604800],
			["day", 86400],
			["hour", 3600],
			["minute", 60],
		];
		for (const [unit, n] of units) {
			if (seconds >= n) return rtf.format(-Math.round(seconds / n), unit);
		}
		return "just now";
	}

	function markUnpublished(cardEl) {
		cardEl.classList.add("soon");
		const title = cardEl.querySelector(".card-title");
		let status = title.querySelector(".status");
		if (!status) {
			status = el("span", { class: "status" });
			title.append(status);
		}
		status.className = "status soon";
		status.textContent = "Not published yet";
		for (const a of cardEl.querySelectorAll("a[data-gh]")) {
			a.removeAttribute("href");
			a.title = "This repository is not on GitHub yet";
		}
	}

	async function enrichFromGitHub() {
		let repos;
		try {
			repos = await fetchRepos();
		} catch (_) {
			return;
		}
		const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

		for (const c of document.querySelectorAll(".card[data-repo]")) {
			const r = byName.get(c.dataset.repo.toLowerCase());
			if (!r) {
				if (!c.classList.contains("soon")) markUnpublished(c);
				continue;
			}
			const parts = [];
			if (r.pushed_at) parts.push("Updated " + ago(r.pushed_at));
			if (r.stars) parts.push("★ " + r.stars);
			const meta = c.querySelector(".meta");
			meta.textContent = parts.join(" · ");
			meta.hidden = parts.length === 0;
		}
	}

	/* ------------------------------------------------ links on any page */

	function resolveAnchors() {
		for (const a of document.querySelectorAll("a[data-repo]")) {
			const kind = a.dataset.kind || "source";
			const repo = repoUrl(a.dataset.repo);
			const href = repo && kind === "release" ? `${repo}/releases/latest` : repo;
			if (href) {
				a.href = href;
			} else {
				a.removeAttribute("href");
				a.title = "Set `user` in projects.js to enable this link";
			}
		}
	}

	/* -------------------------------------------------------------- boot */

	const root = document.getElementById("hub");
	if (root) renderHub(root);
	resolveAnchors();
	if (root && HUB.github !== false && user) enrichFromGitHub();
})();
