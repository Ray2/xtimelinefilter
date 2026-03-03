const STORAGE_KEY = "timelineFilterSettings";
const REMOVED_CATEGORIES = new Set(["Indian Subcontinent"]);

const CATEGORY_DEFAULTS = {
  Mogging: { enabled: true, patterns: ["\\bmog(ging)?\\b", "/\\bClavicular\\b/"] },
  Racism: { enabled: true, patterns: ["\\bneo\\-?nazi\\b"] },
  Ads: { enabled: true, patterns: ["\\bsponsored\\b", "\\bpromoted\\b", "\\bad\\b"] },
  War: {
    enabled: true,
    patterns: [
      "\\biran\\b",
      "\\bukraine\\b",
      "\\bisrael\\b",
      "\\bpalestin(e|ian)?\\b",
      "\\brussia(n)?\\b",
      "/\\bUS\\b/",
      "/\\bWW3\\b/",
      "/\\bAIPAC\\b/"
    ]
  },
  NYC: {
    enabled: true,
    patterns: [
      "\\bnyc\\b",
      "\\bnew\\s?york\\s?city\\b",
      "\\bnew\\s?york\\b",
      "\\bbrooklyn\\b",
      "\\bqueens\\b",
      "\\bmanhattan\\b",
      "\\bharlem\\b",
      "\\bbronx\\b",
      "/\\bLES\\b/",
      "/\\bUWS\\b/",
      "/\\bUES\\b/",
      "\\bhell'?s\\s?kitchen\\b"
    ]
  },
  Gym: {
    enabled: true,
    patterns: [
      "\\bgym\\b",
      "\\bworkout(s)?\\b",
      "\\bweight\\s?training\\b",
      "\\blifting\\b",
      "\\bpowerlifting\\b",
      "\\bbodybuilding\\b",
      "\\bhypertrophy\\b",
      "\\bbench\\s?press\\b",
      "\\bsquat(s)?\\b",
      "\\bdeadlift(s|ing)?\\b",
      "\\bcardio\\b",
      "\\bbulk(ing)?\\b",
      "\\bcut(ting)?\\b",
      "\\bcreatine\\b",
      "\\bprotein\\s?shake\\b",
      "\\bpre[-\\s]?workout\\b",
      "\\bleg\\s?day\\b",
      "\\bPR\\b"
    ]
  },
  Ageism: {
    enabled: true,
    patterns: [
      "\\bzoomers?\\b",
      "\\bboomers?\\b",
      "\\bgen\\s?z\\b",
      "\\bgen\\s?x\\b",
      "\\bgen\\s?alpha\\b",
      "\\bgen\\s?y\\b",
      "\\bmillennials?\\b",
      "\\bokay\\s?boomer\\b"
    ]
  },
  AI: {
    enabled: true,
    patterns: [
      "\\bchat\\s?gpt\\b",
      "\\banthropic\\b",
      "\\bclaude\\b",
      "\\bopenai\\b",
      "\\bopenclaw\\b",
      "\\bllm(s)?\\b",
      "\\bgpt[-\\s]?4\\b",
      "\\bgpt[-\\s]?5\\b",
      "\\bgemini\\b",
      "\\bcopilot\\b"
    ]
  },
  "Big Pharma": {
    enabled: true,
    patterns: [
      "\\bpills?\\b",
      "\\bozempic\\b",
      "\\btirzapeptide\\b",
      "\\btirzepatide\\b",
      "\\bretatutrid\\b",
      "\\bretatrutide\\b",
      "\\badvil\\b",
      "\\bwegrovy\\b",
      "\\bwegovy\\b",
      "/\\bSSRI(s)?\\b/",
      "\\bsemaglutide\\b",
      "\\bglp[-\\s]?1\\b"
    ]
  },
  China: {
    enabled: true,
    patterns: [
      "\\bhot\\s?pot\\b",
      "\\bhotpot\\b",
      "\\bchina\\b",
      "\\bsino\\b",
      "\\bchinese\\b",
      "\\bmao\\s?zedong\\b",
      "\\bxi\\s?jinping\\b",
      "\\bxi\\s?jingping\\b",
      "/\\bCCP\\b/",
      "/\\bPRC\\b/"
    ]
  },
  Israel: {
    enabled: true,
    patterns: [
      "\\bjews?\\b",
      "\\bjewish\\b",
      "\\bisrael\\b",
      "\\bnetanyahu\\b",
      "\\behud\\s?barak\\b",
      "\\behud\\s?barack\\b",
      "\\bepstein\\b",
      "\\bbibi\\b",
      "\\bgoy\\w*\\b"
    ]
  },
  "Mental Illness": {
    enabled: true,
    patterns: [
      "\\bautism\\b",
      "\\bautistic\\b",
      "/\\bADHD\\b/",
      "/\\bADD\\b/",
      "/\\bOCD\\b/",
      "\\bdepression\\b",
      "\\banxiety\\b",
      "\\bbipolar\\b",
      "\\bschizophreni(a|c)\\b",
      "/\\bPTSD\\b/",
      "\\bneurodivergen(t|ce)\\b"
    ]
  },
  "Misogyny / Misandry": {
    enabled: true,
    patterns: [
      "\\bmisogyn(y|ist|istic)?\\b",
      "\\bmisogony\\b",
      "\\bmisandry\\b",
      "\\bmisandrist(ic)?\\b",
      "\\bmen\\b",
      "\\bwomen\\b",
      "\\bboys\\b",
      "\\bgirls\\b",
      "\\bwoman\\b",
      "\\bman\\b"
    ]
  },
  Gooning: {
    enabled: true,
    patterns: [
      "\\bthick\\b",
      "\\bthicc\\b",
      "\\bbig\\s?ass\\b",
      "\\btidd(y|ies)\\b",
      "\\bwaifu\\b",
      "\\bcock\\b",
      "\\bbounce\\s?on\\s?it\\b",
      "\\bhinge\\b",
      "\\btinder\\b",
      "\\bonlyfans\\b",
      "\\bporn\\b",
      "\\bpornhub\\b"
    ]
  },
  Streamers: {
    enabled: true,
    patterns: [
      "\\bclavicular\\b",
      "\\bspeed\\b",
      "\\badin\\s?ross\\b",
      "\\bishowspeed\\b",
      "\\bkai\\s?cenat\\b",
      "\\bhasan\\s?piker\\b",
      "\\bdestiny\\b"
    ]
  },
  Drugs: {
    enabled: true,
    patterns: [
      "\\bweed\\b",
      "\\bshrooms?\\b",
      "\\balcohol\\b",
      "\\bcocaine\\b",
      "\\bamphetamines?\\b",
      "\\bket\\b",
      "\\bketamine\\b",
      "/\\bMDMA\\b/"
    ]
  },
  "Elon Musk": {
    enabled: true,
    patterns: [
      "\\belon\\s?musk\\b",
      "\\belon\\b",
      "\\bmusk\\b",
      "\\btesla\\b",
      "\\bspacex\\b",
      "\\bneuralink\\b",
      "\\bx\\s?ai\\b",
      "\\bxai\\b"
    ]
  },
  Redpill: {
    enabled: true,
    patterns: [
      "\\bred\\s?pill\\b",
      "\\bblackpill\\b",
      "\\bmanosphere\\b",
      "\\bclavicular\\b",
      "\\bandrew\\s?tate\\b",
      "\\bnick\\s?fuentes\\b",
      "\\balex\\s?jones\\b"
    ]
  },
  "Trad Core": {
    enabled: true,
    patterns: [
      "\\bcigar(s)?\\b",
      "\\bcigeratte(s)?\\b",
      "\\bcigarette(s)?\\b",
      "\\btrad\\s?wife\\b",
      "\\btradwife\\b",
      "\\btraditional\\s?wife\\b",
      "\\bhousewife\\b"
    ]
  },
  "E-Girls (Pictures)": { enabled: true, patterns: ["\\begirl\\b"] },
  "E-Girls (Opinions)": { enabled: false, patterns: [] },
  "Cat Videos": { enabled: true, patterns: ["\\bcat\\b"] },
  GamerGate: { enabled: true, patterns: ["\\bgamergate\\b"] },
  Hyperfinancialization: {
    enabled: true,
    patterns: ["\\bcrypto\\b", "/\\bSilicon\\s?Valley\\b/"]
  },
  "Epstein Files": {
    enabled: true,
    patterns: ["\\bepstein\\b", "/\\bBill\\s?Clinton\\b/", "/\\bLarry\\s?Summers\\b/"]
  }
};

const CATEGORY_ORDER = [
  "Mogging",
  "Racism",
  "Ads",
  "War",
  "NYC",
  "Gym",
  "Ageism",
  "AI",
  "Big Pharma",
  "China",
  "Israel",
  "Mental Illness",
  "Misogyny / Misandry",
  "Gooning",
  "Streamers",
  "Drugs",
  "Elon Musk",
  "Redpill",
  "Trad Core",
  "E-Girls (Pictures)",
  "E-Girls (Opinions)",
  "Cat Videos",
  "GamerGate",
  "Hyperfinancialization",
  "Epstein Files"
];

const ICONS = {
  Mogging: "🫵",
  Racism: "🛑",
  Ads: "📣",
  War: "🪖",
  NYC: "🗽",
  Gym: "🏋️",
  Ageism: "🧓",
  AI: "🤖",
  "Big Pharma": "💊",
  China: "🇨🇳",
  Israel: "🇮🇱",
  "Mental Illness": "🧠",
  "Misogyny / Misandry": "⚖️",
  Gooning: "🥵",
  Streamers: "📺",
  Drugs: "💉",
  "Elon Musk": "🚀",
  Redpill: "🔴",
  "Trad Core": "🕰️",
  "E-Girls (Pictures)": "🧍‍♀️",
  "E-Girls (Opinions)": "💬",
  "Cat Videos": "🐈",
  GamerGate: "🚫",
  Hyperfinancialization: "📈",
  "Epstein Files": "🗂️"
};

async function getSettings() {
  const res = await chrome.storage.sync.get([STORAGE_KEY]);
  return res[STORAGE_KEY];
}

async function setSettings(next) {
  await chrome.storage.sync.set({ [STORAGE_KEY]: next });
}

function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else n.setAttribute(k, v);
  });
  children.forEach((c) => n.appendChild(c));
  return n;
}

function deepClone(x) {
  return JSON.parse(JSON.stringify(x ?? {}));
}

function normalizeSettings(stored) {
  const out = {
    mode: stored?.mode === "blur" ? "blur" : "hide",
    categories: {}
  };

  const storedCats = stored?.categories || {};

  for (const [name, def] of Object.entries(CATEGORY_DEFAULTS)) {
    const src = storedCats[name] || {};
    out.categories[name] = {
      enabled: typeof src.enabled === "boolean" ? src.enabled : def.enabled,
      patterns: Array.isArray(src.patterns) ? src.patterns : def.patterns
    };
  }

  for (const [name, cat] of Object.entries(storedCats)) {
    if (REMOVED_CATEGORIES.has(name)) continue;
    if (name in out.categories) continue;
    out.categories[name] = {
      enabled: typeof cat?.enabled === "boolean" ? cat.enabled : false,
      patterns: Array.isArray(cat?.patterns) ? cat.patterns : []
    };
  }

  return out;
}

function render(settings) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  const cats = settings?.categories || {};
  const names = CATEGORY_ORDER.filter((n) => n in cats).concat(
  Object.keys(cats).filter((n) => !CATEGORY_ORDER.includes(n))
);

  for (const name of names) {
    const enabled = !!cats[name]?.enabled;

    const chk = el("div", { class: `chk ${enabled ? "on" : ""}` }, [
      el("div", { text: enabled ? "✓" : "" })
    ]);

    const row = el("div", { class: "row", role: "button", tabindex: "0" }, [
      el("div", { class: "icon", text: ICONS[name] || "•" }),
      el("div", { class: "name", text: name }),
      chk
    ]);

    row.addEventListener("click", async () => {
      const next = deepClone(settings);
      next.categories[name].enabled = !next.categories[name].enabled;
      await setSettings(next);
      settings = next;
      render(settings);
    });

    list.appendChild(row);
  }

  const modeSelect = document.getElementById("modeSelect");
  modeSelect.value = settings?.mode || "hide";
  modeSelect.onchange = async () => {
    const next = deepClone(settings);
    next.mode = modeSelect.value;
    await setSettings(next);
  };
}

(async function init() {
  const stored = await getSettings();
  let settings = normalizeSettings(stored);
  if (JSON.stringify(stored) !== JSON.stringify(settings)) {
    await setSettings(settings);
  }

  document.getElementById("clearBtn").onclick = async () => {
    const next = deepClone(settings);
    for (const k of Object.keys(next.categories)) next.categories[k].enabled = false;
    await setSettings(next);
    settings = next;
    render(settings);
  };

  document.getElementById("optionsLink").onclick = async (e) => {
    e.preventDefault();
    await chrome.runtime.openOptionsPage();
    window.close();
  };

  render(settings);
})();
