const STORAGE_KEY = "timelineFilterSettings";

const ICONS = {
  Mogging: "🫱🏽‍🫲🏻",
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
function deepClone(x) {
  return JSON.parse(JSON.stringify(x ?? {}));
}
function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (k === "html") n.innerHTML = v;
    else n.setAttribute(k, v);
  });
  children.forEach((c) => n.appendChild(c));
  return n;
}

let settings = null;

function render() {
  const root = document.getElementById("cats");
  root.innerHTML = "";

  const cats = settings?.categories || {};
  for (const [name, cat] of Object.entries(cats)) {
    const enabled = !!cat.enabled;
    const patterns = (cat.patterns || []).join("\n");

    const enabledInput = el("input", { type: "checkbox" });
    enabledInput.checked = enabled;
    enabledInput.onchange = () => {
      settings.categories[name].enabled = enabledInput.checked;
    };

    const ta = el("textarea");
    ta.value = patterns;
    ta.oninput = () => {
      const lines = ta.value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      settings.categories[name].patterns = lines;
    };

    const card = el("div", { class: "card" }, [
      el("div", { class: "cardHead" }, [
        el("div", { class: "titleRow" }, [
          el("div", { class: "badge", text: ICONS[name] || "•" }),
          el("div", { text: name, style: "font-weight:800;font-size:16px;" })
        ]),
        el("label", { class: "switch" }, [
          el("span", { text: "Enabled" }),
          enabledInput
        ])
      ]),
      ta
    ]);

    root.appendChild(card);
  }
}

function download(filename, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

(async function init() {
  settings = (await getSettings()) || { mode: "hide", categories: {} };
  render();

  document.getElementById("saveBtn").onclick = async () => {
    await setSettings(settings);
    alert("Saved. Reload X/Twitter to re-evaluate already-rendered tweets.");
  };

  document.getElementById("exportBtn").onclick = () => {
    download("timelineFilterSettings.json", JSON.stringify(settings, null, 2));
  };

  document.getElementById("importFile").onchange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const txt = await f.text();
    try {
      const imported = JSON.parse(txt);
      settings = imported;
      await setSettings(settings);
      render();
      alert("Imported + saved.");
    } catch {
      alert("That JSON file couldn't be parsed.");
    }
  };
})();