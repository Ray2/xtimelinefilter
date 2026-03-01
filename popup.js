const STORAGE_KEY = "timelineFilterSettings";

const CATEGORY_ORDER = [
  "Mogging",
  "Racism",
  "Indian Subcontinent",
  "E-Girls (Pictures)",
  "E-Girls (Opinions)",
  "Cat Videos",
  "GamerGate",
  "Hyperfinancialization"
];

const ICONS = {
  Mogging: "🫵",
  Racism: "卐",
  "Indian Subcontinent": "🗺️",
  "E-Girls (Pictures)": "🧍‍♀️",
  "E-Girls (Opinions)": "💬",
  "Cat Videos": "🐈",
  GamerGate: "🚫",
  Hyperfinancialization: "📈"
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
  let settings = await getSettings();

  // If unset, content.js will create defaults internally, but popup needs something to render.
  // We'll initialize a minimal structure if missing.
  if (!settings || !settings.categories) {
    settings = {
      mode: "hide",
      categories: {
        Mogging: { enabled: true, patterns: ["\\bmog(ging)?\\b"] },
        Racism: { enabled: true, patterns: ["\\bneo\\-?nazi\\b"] },
        "Indian Subcontinent": { enabled: false, patterns: ["\\bindia\\b"] },
        "E-Girls (Pictures)": { enabled: true, patterns: ["\\begirl\\b"] },
        "E-Girls (Opinions)": { enabled: false, patterns: [] },
        "Cat Videos": { enabled: true, patterns: ["\\bcat\\b"] },
        GamerGate: { enabled: true, patterns: ["\\bgamergate\\b"] },
        Hyperfinancialization: { enabled: true, patterns: ["\\bcrypto\\b"] }
      }
    };
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