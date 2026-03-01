// Timeline Filter for X — DOM-based keyword/regex matching
// NOTE: X changes its DOM often. Selectors may need tweaks over time.

const STORAGE_KEY = "timelineFilterSettings";
const DEFAULTS = {
  mode: "hide", // "hide" | "blur"
  categories: {
    Mogging: {
      enabled: true,
      patterns: [
        // Core verbs
        "\\bmog(g(er|ed|ging)?)?\\b",
        "\\blooks?max(x|ing|ed)?\\b",

        // Pill / ideology jargon
        "\\bblackpill\\b",

        // Rating systems / tiers (community-specific)
        "\\bPSL(\\s?scale)?\\b",
        "\\bPrettyScale\\b",
        "\\bSub\\s?[35]\\b",
        "\\b(LTN|MTN|HTN)\\b",
        "\\b(LTB|MTB|HTB)\\b",

        // Archetypes (community-specific)
        "\\bChad(lite)?\\b",
        "\\bStacy(lite)?\\b",
        "\\bTrue\\s?Adam\\b",
        "\\bTrue\\s?Eve\\b",

        // Facial-structure jargon (high-signal, low-false-positive)
        "\\bcanthal\\s?tilt\\b",
        "\\bhunter\\s?eyes\\b",
        "\\bzygo(s|matic)?\\b",
        "\\bmaxilla(ry)?\\b",
        "\\bgonial\\s?angle\\b",
        "\\bfacial\\s?thirds\\b",
        "\\bmidface\\b",

        // Community actions/strategies
        "\\bframe\\s?mog\\b",
        "\\brankshift\\b",
        "\\bascend(ing)?\\b",
        "\\bfailos\\b",

        // “maxxing” slang (very community-specific)
        "\\bjestermaxxing\\b",
        "\\bjestergooning\\b",
        "\\bgymcel\\b",
        "\\bmakeupcel\\b",

        // Controversial practices (high-signal)
        "\\bbone\\s?smash(ing)?\\b",
        "\\bmew(ing)?\\b",
        "\\bordthotropics\\b",

        // Biohacking buzzword used in these circles (fairly unique in context)
        "\\bpeptides?\\b"
      ]
    },

    Racism: {
      enabled: true,
      // Keep these mild placeholders; user can add/remove in Options.
      patterns: ["\\bwhite\\s*supremac(y|ist)\\b", "\\bneo\\-?nazi\\b", "\\bracial\\s*slur\\b", "\\bnigger\\b", "\\bnigga\\b", "\\bchink\\b", "\\bspic\\b", "\\bkyke\\b", "\\bcracker\\b", "\\bcoon\\b", "\\bgook\\b", "\\btowelhead\\b", "\\bporch monkey\\b", "\\bgo\\s*back\\s*to\\s*your\\s*country\\b", "\\bzipperhead\\b", "\\bbeaner\\b", "\\bwetback\\b", "\\bredneck\\b", "\\btrailer trash\\b", "\\bwhitey\\b", "\\bgringo\\b", "\\bpolack\\b", "\\bdago\\b", "\\bwop\\b", "\\bscalawag\\b", "\\bjew\\b", "\\bgypsy\\b", "\\bgoy\\b"]
    },

    "Indian Subcontinent": { enabled: false, patterns: ["\\bmodi\\b", "\\bindia\\b", "\\bpakistan\\b", "\\bModi\\b",
"\\bBJP\\b",
"\\bHindutva\\b",
"\\bRSS\\b",
"\\bCAA\\b",
"\\bNRC\\b",
"\\bKashmir\\s?(conflict|dispute)\\b",
"\\bPakistan\\s?Politics\\b",
"\\bImran\\s?Khan\\b",
"\\bISI\\b",
"\\bPTI\\b",
"\\bPunjab\\s?politics\\b",
"\\bCross[-\\s]?border\\s?Conflict\\b",
"\\bIndia\\s?vs\\.?\\s?Pakistan\\b",
"\\bborder\\s?tensions\\b",
"\\bLoC\\b",
"\\bpartition\\s?politics\\b"] },

    "E-Girls (Pictures)": { enabled: true, patterns: ["\\begirl\\b", "\\bthirst\\s*trap\\b", "\\be[-\\s]?girl(s)?\\b",
"\\balt\\s?girl\\b",
"\\balt\\s?baddie\\b",
"\\bgoth\\s?gf\\b",
"\\bpastel\\s?goth\\b",
"\\bsoft\\s?goth\\b",
"\\bbaddie\\s?aesthetic\\b",

"\\bthirst\\s?trap(s)?\\b",
"\\blink\\s?in\\s?bio\\b",
"\\bmy\\s?OF\\b",
"\\bOnlyFans\\b",
"\\bsub\\s?to\\s?my\\s?page\\b",
"\\bDM\\s?for\\s?collab\\b",
"\\bnew\\s?pics?\\s?drop\\b",

"\\bfishnet(s)?\\b",
"\\bplatform\\s?boots?\\b",
"\\bheavy\\s?eyeliner\\b",
"\\bwinged\\s?liner\\b",
"\\bpink\\s?hair\\s?girl\\b",
"\\bcosplay\\s?selfie\\b",
"\\bmirror\\s?pic\\b"] },
    "E-Girls (Opinions)": { enabled: false, patterns: ["\\begirl\\b.*\\bopinion\\b", "\\bhot\\s?take\\s?thread\\b",
"\\bunpopular\\s?opinion\\b",
"\\bmen\\s?are\\s?trash\\b",
"\\bpick\\s?me\\s?girl\\b",
"\\bmale\\s?validation\\b",
"\\bgirlboss\\b",
"\\bdating\\s?discourse\\b",
"\\bsoft\\s?launch\\b",
"\\bhard\\s?launch\\b"] },

    "Cat Videos": { enabled: true, patterns: ["\\bcat\\b", "\\bkittens?\\b", "meow", "\\bcat(s)?\\b",
"\\bkitten(s)?\\b",
"\\bmeow\\b",
"\\bpurring\\b",
"\\btabby\\b",
"\\bmaine\\s?coon\\b",
"\\bbritish\\s?shorthair\\b",
"\\bcat\\s?rescue\\b",
"\\badopt\\s?don'?t\\s?shop\\b"] },

    "GamerGate": { enabled: true, patterns: ["\\bgamergate\\b", "\\bgg\\b", "\\bgamergate\\b",
"\\bGG2\\b",
"\\banti[-\\s]?woke\\s?games?\\b",
"\\bwoke\\s?game\\s?dev(s)?\\b",
"\\bDEI\\s?in\\s?gaming\\b",
"\\bforced\\s?diversity\\b",
"\\bSJW\\s?dev(s)?\\b",
"\\bsweet\\s?baby\\s?inc\\b",
"\\bgame\\s?censorship\\b",
"\\bgaming\\s?journalism\\s?ethics\\b"] },

    Hyperfinancialization: {
      enabled: true,
      patterns: ["\\btoken\\b", "\\bairdrop\\b", "\\bnft(s)?\\b", "\\bcrypto\\b", "\\byield\\b", "\\bairdrop(s)?\\b",
"\\btoken\\s?launch\\b",
"\\bpresale\\b",
"\\bwhitelist(ed|ing)?\\b",
"\\bmint(ing)?\\b",
"\\bgas\\s?fees?\\b",
"\\bon[-\\s]?chain\\b",
"\\blayer\\s?2\\b",
"\\bstaking\\s?rewards?\\b",
"\\byield\\s?farm(ing)?\\b",
"\\bliquidity\\s?pool(s)?\\b",
"\\brug\\s?pull\\b", "\\bpassive\\s?income\\b",
"\\bfinancial\\s?freedom\\b",
"\\bhustle\\s?culture\\b",
"\\bexit\\s?liquidity\\b",
"\\barbitrage\\s?opportunity\\b",
"\\bbuy\\s?signal\\b",
"\\bsell\\s?signal\\b",
"\\btechnical\\s?analysis\\b",
"\\bTA\\s?chart\\b",
"\\bmacro\\s?thesis\\b", "\\bseed\\s?round\\b",
"\\bpre[-\\s]?seed\\b",
"\\bseries\\s?A\\b",
"\\bvaluation\\b",
"\\bunicorn\\s?status\\b",
"\\bdisrupt(ing|ive)?\\b",
"\\bgrowth\\s?hacking\\b",
"\\bmonetize(d|s|ing)?\\b",
"\\bproduct\\s?market\\s?fit\\b", "\\bopenclaw\\b", "\\bpermanent\\s?underclass"] }
    }
  }
};

let settings = null;
let compiled = null;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compileSettings(s) {
  const compiledCats = {};
  for (const [name, cat] of Object.entries(s.categories || {})) {
    const regs = [];
    for (const p of cat.patterns || []) {
      if (!p) continue;
      try {
        // If user wrote something that looks like /.../flags, support it
        const m = p.match(/^\/(.+)\/([gimsuy]*)$/);
        if (m) {
          regs.push(new RegExp(m[1], m[2] || "i"));
        } else {
          // Treat as regex string, case-insensitive by default
          regs.push(new RegExp(p, "i"));
        }
      } catch {
        // Fallback: treat as literal text if regex fails
        regs.push(new RegExp(escapeRegExp(p), "i"));
      }
    }
    compiledCats[name] = { enabled: !!cat.enabled, regs };
  }
  return { mode: s.mode || "hide", categories: compiledCats };
}

async function loadSettings() {
  const res = await chrome.storage.sync.get([STORAGE_KEY]);
  const stored = res[STORAGE_KEY];
  settings = mergeDefaults(DEFAULTS, stored || {});
  compiled = compileSettings(settings);
}

function mergeDefaults(base, override) {
  // simple deep merge for our shape
  const out = structuredClone(base);
  if (!override) return out;

  if (override.mode) out.mode = override.mode;

  if (override.categories) {
    for (const [k, v] of Object.entries(override.categories)) {
      if (!out.categories[k]) out.categories[k] = { enabled: false, patterns: [] };
      if (typeof v.enabled === "boolean") out.categories[k].enabled = v.enabled;
      if (Array.isArray(v.patterns)) out.categories[k].patterns = v.patterns;
    }
  }
  return out;
}

function getTweetText(articleEl) {
  // Grabs text within tweet article; excludes some UI by relying on textContent
  return (articleEl.innerText || articleEl.textContent || "").trim();
}

function markFiltered(articleEl, matchedCats) {
  if (articleEl.dataset.tlfFiltered === "1") return;

  articleEl.dataset.tlfFiltered = "1";
  articleEl.dataset.tlfMatched = matchedCats.join(", ");

  if (compiled.mode === "blur") {
    articleEl.style.filter = "blur(6px)";
    articleEl.style.opacity = "0.55";
    articleEl.style.pointerEvents = "auto";

    // Add small unblur button
    const btn = document.createElement("button");
    btn.textContent = `Unblur (${matchedCats[0]})`;
    btn.style.cssText =
      "position:absolute; z-index:9999; top:8px; right:8px; padding:6px 10px; border-radius:999px; border:1px solid rgba(255,255,255,.2); background:rgba(0,0,0,.65); color:white; cursor:pointer;";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      articleEl.style.filter = "";
      articleEl.style.opacity = "";
      btn.remove();
    });

    // Ensure positioned
    const parent = articleEl;
    parent.style.position = parent.style.position || "relative";
    parent.appendChild(btn);
  } else {
    // Hide mode
    articleEl.style.display = "none";
  }
}

function shouldFilterText(text) {
  const matched = [];

  for (const [name, cat] of Object.entries(compiled.categories)) {
    for (const r of cat.regs) {
      if (r.test(text)) {
        matched.push({
          name,
          enabled: cat.enabled
        });
        break;
      }
    }
  }

  if (matched.length === 0) {
    // Tweet doesn't belong to any category → allow
    return [];
  }

  // Hide if it matches ANY category that is disabled
  const shouldHide = matched.some(m => !m.enabled);

  return shouldHide ? matched.map(m => m.name) : [];
}

function scan() {
  if (!compiled) return;

  // Tweets are usually in <article> nodes on X
  const articles = document.querySelectorAll("article");
  for (const a of articles) {
    // Skip if already processed
    if (a.dataset.tlfSeen === "1") continue;
    a.dataset.tlfSeen = "1";

    const text = getTweetText(a);
    if (!text) continue;

    const matched = shouldFilterText(text);
    if (matched.length) markFiltered(a, matched);
  }
}

function startObserver() {
  const obs = new MutationObserver(() => scan());
  obs.observe(document.documentElement, { childList: true, subtree: true });
  scan();
}

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "sync") return;
  if (changes[STORAGE_KEY]) {
    await loadSettings();
    // Re-scan new content. (Already hidden tweets stay hidden unless you refresh.)
    scan();
  }
});

(async function init() {
  await loadSettings();
  startObserver();
})();