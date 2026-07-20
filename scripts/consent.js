const MODULE_ID = "consent-form";
const DATA_FLAG = "profile";
const STORAGE_FLAG = "storageType";
const PROFILE_STORAGE = "player-profile";
const GM_STORAGE = "gm-notes";
const X_CARD_COOLDOWN_MS = 30_000;
const IMPORT_MAX_BYTES = 5 * 1024 * 1024;
const IMPORT_MAX_CUSTOM_TOPICS = 10_000;
const IMPORT_MAX_TEXT_LENGTH = 100_000;

let lastXCardAt = 0;
const xCardRequests = new Map();
const activeXCards = new Map();
let storageProvisioning = null;
let tableBreakTimer = null;

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const CATALOG = {
  fears: ["acrophobia", "aerophobia", "agoraphobia", "arachnophobia", "belonephobia", "claustrophobia", "coulrophobia", "cynophobia", "entomophobia", "hematophobia", "herpetophobia", "lossOfControlPhobia", "necrophobia", "nyctophobia", "ophiophobia", "phasmophobia", "teratophobia", "thanatophobia"],
  realWorld: ["currentWars", "historicalWars", "currentGenocides", "historicalGenocides", "terroristAttacks", "industrialDisasters", "naturalDisasters", "pandemics", "migrationCrisis", "faminesAndPoverty", "politicalEvents", "parodiesAndSatires"],
  punishment: ["corporalPunishment", "physicalTorture", "executions", "exile", "publicHumiliation", "solitaryConfinement", "mentalManipulation", "psychologicalTorture", "incarceration", "forcedLabor", "restrictionOfFreedom", "religiousPunishments", "culturalPunishments"],
  romance: ["romanceImplicit", "romanceExplicit", "romanceBetweenPCs", "romanceBetweenNPCs", "romancePcNpc", "polyamory", "infidelity", "forbiddenRelationships", "toxicRelationships", "unrequitedLove", "forcedMarriage"],
  sex: ["sexImplicit", "sexExplicit", "sexBetweenPCs", "sexBetweenNPCs", "sexPcNpc", "softBDSM", "moderateBDSM", "extremeBDSM", "sexWork", "sexualViolence", "sexualManipulation", "incest", "paedophilia", "zoophilia", "necrophilia"],
  violence: ["abandonment", "domesticViolence", "murdersAndAssassinations", "physicalAggression", "bullying", "mutilationsAndAmputations", "childAbuse", "animalAbuse", "realisticCombat", "verbalAbuse", "institutionalViolence", "religiousPersecution", "ethnicPersecution", "medicalExperimentation", "slavery", "demonicPossession", "ritualSacrifices", "cannibalism", "bodyTransformations"],
  discrimination: ["ableism", "afrophobia", "ageism", "antisemitism", "arophobia", "asexualphobia", "biphobia", "classism", "colorism", "fatphobia", "heteronormativity", "heterophobia", "homophobia", "islamophobia", "intersexphobia", "languageDiscrimination", "lesbophobia", "neurodivergenceDiscrimination", "nonBinaryphobia", "panphobia", "racism", "religiousDiscrimination", "romaphobia", "sexism", "systemicRacism", "sizeism", "thinphobia", "transphobia", "xenophobia"],
  health: ["cancer", "neurodegenerativeDiseases", "sidaVIH", "chronicDiseases", "depression", "suicide", "psychoses", "anxietyDisorders", "eatingDisorders", "selfHarm", "miscarriage", "infertility", "abortion"],
  extremism: ["totalitarianIdeologies", "authoritarianCommunism", "theocraticRegimes", "chauvinism", "indoctrination", "religiousFanaticism", "sectarianGroups", "proselytizing", "racialSupremacism", "eugenicIdeologies", "hateGroups", "complotism"]
};

const LEVELS = ["default", "narrative", "discuss", "forbidden"];
const LEVEL_COLORS = { default: "neutral", narrative: "green", discuss: "amber", forbidden: "red" };
const CATEGORY_ICONS = {
  fears: "fa-solid fa-spider",
  realWorld: "fa-solid fa-earth-europe",
  punishment: "fa-solid fa-gavel",
  romance: "fa-solid fa-heart",
  sex: "fa-solid fa-venus-mars",
  violence: "fa-solid fa-burst",
  discrimination: "fa-solid fa-people-arrows",
  health: "fa-solid fa-heart-pulse",
  extremism: "fa-solid fa-triangle-exclamation"
};

function localize(key, fallback = key) {
  const value = game.i18n.localize(key);
  return value === key ? fallback : value;
}

function escapeHTML(value) {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
}

function categoryKey(category) {
  return `CONSENT.TAB_${category === "realWorld" ? "REALWORLD" : category.toUpperCase()}`;
}

function itemKey(category, key) {
  return `CONSENT.${category.toUpperCase()}_${key.toUpperCase()}`;
}

function definitionKey(key) {
  return `CONSENT.DEFINITION_${key.toUpperCase()}`;
}

function emptyProfile() {
  return {
    version: 3,
    updatedAt: null,
    categories: Object.fromEntries(Object.entries(CATALOG).map(([category, keys]) => [category, {
      levels: Object.fromEntries(keys.map(key => [key, "default"])),
      custom: []
    }])),
    notes: ""
  };
}

function getProfileStorage(userId = game.user.id) {
  return game.journal.find(entry => entry.getFlag(MODULE_ID, STORAGE_FLAG) === PROFILE_STORAGE
    && entry.getFlag(MODULE_ID, "userId") === userId) ?? null;
}

function getGmStorage() {
  return game.journal.find(entry => entry.getFlag(MODULE_ID, STORAGE_FLAG) === GM_STORAGE) ?? null;
}

function isModuleStorage(journal) {
  return [PROFILE_STORAGE, GM_STORAGE].includes(journal?.getFlag(MODULE_ID, STORAGE_FLAG));
}

function hideStorageFromJournalDirectory(html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;
  for (const journal of game.journal.filter(isModuleStorage)) {
    const selectors = [
      `[data-entry-id="${journal.id}"]`,
      `[data-document-id="${journal.id}"]`,
      `[data-entry-uuid="${journal.uuid}"]`,
      `[data-uuid="${journal.uuid}"]`
    ];
    for (const element of root.querySelectorAll(selectors.join(","))) {
      const directoryItem = element.closest(".directory-item") ?? element;
      directoryItem.hidden = true;
      directoryItem.setAttribute("aria-hidden", "true");
    }
  }
}

async function ensureStorage() {
  if (!game.user.isGM) return;
  for (const user of game.users.filter(candidate => !candidate.isGM)) {
    const legacyProfile = user.getFlag(MODULE_ID, DATA_FLAG);
    if (getProfileStorage(user.id)) {
      if (legacyProfile) await user.unsetFlag(MODULE_ID, DATA_FLAG);
      continue;
    }
    const legacyActorProfile = user.character?.getFlag(MODULE_ID, "preferences");
    const initialProfile = legacyProfile
      ? normalizeProfile(legacyProfile)
      : legacyActorProfile
        ? migrateActorProfile(legacyActorProfile)
        : emptyProfile();
    if (legacyActorProfile && !initialProfile.updatedAt) initialProfile.updatedAt = new Date().toISOString();
    await JournalEntry.create({
      name: `${localize("CONSENT.STORAGE_NAME", "Consent form")} — ${user.name}`,
      ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE, [user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER },
      flags: {
        [MODULE_ID]: {
          [STORAGE_FLAG]: PROFILE_STORAGE,
          userId: user.id,
          [DATA_FLAG]: initialProfile
        }
      }
    }, { renderSheet: false });
    if (legacyProfile) await user.unsetFlag(MODULE_ID, DATA_FLAG);
  }
  const legacyGmNotes = game.settings.get(MODULE_ID, "gmNotes") ?? {};
  const gmStorage = getGmStorage();
  if (!gmStorage) {
    await JournalEntry.create({
      name: localize("CONSENT.GM_STORAGE_NAME", "Consent form — GM notes"),
      ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE },
      flags: { [MODULE_ID]: { [STORAGE_FLAG]: GM_STORAGE, gmNotes: legacyGmNotes } }
    }, { renderSheet: false });
  } else if (Object.keys(legacyGmNotes).length) {
    await gmStorage.setFlag(MODULE_ID, "gmNotes", {
      ...(gmStorage.getFlag(MODULE_ID, "gmNotes") ?? {}),
      ...legacyGmNotes
    });
  }
  if (Object.keys(legacyGmNotes).length) await game.settings.set(MODULE_ID, "gmNotes", {});
}

function provisionStorage() {
  if (!storageProvisioning) {
    storageProvisioning = ensureStorage().finally(() => {
      storageProvisioning = null;
    });
  }
  return storageProvisioning;
}

function normalizeProfile(source = {}) {
  const profile = emptyProfile();
  profile.updatedAt = typeof source.updatedAt === "string" && Number.isFinite(Date.parse(source.updatedAt)) ? source.updatedAt : null;
  profile.notes = typeof source.notes === "string" ? source.notes : "";
  for (const [category, keys] of Object.entries(CATALOG)) {
    const incoming = source.categories?.[category];
    for (const key of keys) {
      const level = incoming?.levels?.[key];
      if (LEVELS.includes(level)) profile.categories[category].levels[key] = level;
    }
    profile.categories[category].custom = Array.isArray(incoming?.custom)
      ? incoming.custom.filter(row => row?.id).map(row => ({
        id: String(row.id),
        label: String(row.label ?? ""),
        level: LEVELS.includes(row.level) ? row.level : "default"
      }))
      : [];
  }
  return profile;
}

function validateImportedProfile(payload, fileSize = 0) {
  if (fileSize > IMPORT_MAX_BYTES) throw new Error("Import file is too large");
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Invalid JSON root");
  if (payload.format && payload.format !== MODULE_ID) throw new Error("Unexpected export format");
  const source = payload.profile ?? payload;
  if (!source.categories || typeof source.categories !== "object" || Array.isArray(source.categories)) throw new Error("Missing profile categories");
  if (typeof source.notes === "string" && source.notes.length > IMPORT_MAX_TEXT_LENGTH) throw new Error("Notes are too long");
  let customCount = 0;
  for (const category of Object.keys(CATALOG)) {
    const incoming = source.categories[category];
    if (incoming == null) continue;
    if (typeof incoming !== "object" || Array.isArray(incoming)) throw new Error(`Invalid category: ${category}`);
    if (incoming.levels != null && (typeof incoming.levels !== "object" || Array.isArray(incoming.levels))) throw new Error(`Invalid levels: ${category}`);
    if (incoming.custom != null && !Array.isArray(incoming.custom)) throw new Error(`Invalid custom topics: ${category}`);
    for (const [key, level] of Object.entries(incoming.levels ?? {})) {
      if (CATALOG[category].includes(key) && !LEVELS.includes(level)) throw new Error(`Invalid level: ${category}.${key}`);
    }
    const ids = new Set();
    for (const row of incoming.custom ?? []) {
      customCount += 1;
      if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error(`Invalid custom topic: ${category}`);
      if (typeof row.label !== "string" || row.label.length > IMPORT_MAX_TEXT_LENGTH) throw new Error(`Invalid custom label: ${category}`);
      if (typeof row.id !== "string" || !row.id.trim() || row.id.length > 255) throw new Error(`Invalid custom id: ${category}`);
      if (ids.has(row.id)) throw new Error(`Duplicate custom id: ${category}`);
      ids.add(row.id);
      if (!LEVELS.includes(row.level)) throw new Error(`Invalid custom level: ${category}`);
    }
  }
  if (customCount > IMPORT_MAX_CUSTOM_TOPICS) throw new Error("Too many custom topics");
  return normalizeProfile(source);
}

function migrateActorProfile(legacy) {
  const profile = emptyProfile();
  if (!legacy || typeof legacy !== "object") return profile;
  profile.notes = typeof legacy.notes === "string" ? legacy.notes : "";
  for (const [category, keys] of Object.entries(CATALOG)) {
    const oldCategory = legacy[category] ?? {};
    for (const key of keys) {
      const oldKey = key === "animalAbuse" ? "AnimalAbuse" : key === "institutionalViolence" ? "InstitutionalViolence" : key;
      if (LEVELS.includes(oldCategory[oldKey])) profile.categories[category].levels[key] = oldCategory[oldKey];
    }
    for (const [key, value] of Object.entries(oldCategory)) {
      if (value && typeof value === "object" && (value.value || value.level !== "default")) {
        profile.categories[category].custom.push({
          id: foundry.utils.randomID(),
          label: String(value.value || localize(itemKey(category, key), key)),
          level: LEVELS.includes(value.level) ? value.level : "default"
        });
      }
    }
  }
  return profile;
}

async function getOwnProfile() {
  const storage = getProfileStorage();
  const stored = storage?.getFlag(MODULE_ID, DATA_FLAG);
  if (stored) return normalizeProfile(stored);
  if (!storage) game.socket.emit(`module.${MODULE_ID}`, { type: "provision-storage", userId: game.user.id });
  const legacy = game.user.character?.getFlag(MODULE_ID, "preferences");
  if (!legacy) return emptyProfile();
  const migrated = migrateActorProfile(legacy);
  migrated.updatedAt = new Date().toISOString();
  if (storage) await storage.setFlag(MODULE_ID, DATA_FLAG, migrated);
  ui.notifications.info(localize("CONSENT.MIGRATION_SUCCESS"));
  return migrated;
}

async function saveOwnProfile(profile) {
  let storage = getProfileStorage();
  if (!storage) {
    game.socket.emit(`module.${MODULE_ID}`, { type: "provision-storage", userId: game.user.id });
    throw new Error("Consent profile storage is not available yet");
  }
  if (!storage.isOwner) throw new Error("Consent profile storage is not writable");
  await storage.setFlag(MODULE_ID, DATA_FLAG, normalizeProfile(profile));
}

function levelOptions() {
  return LEVELS.map(value => ({
    value,
    label: localize(`CONSENT.LEVEL_${value.toUpperCase()}`),
    color: LEVEL_COLORS[value]
  }));
}

function prepareCategories(profile) {
  return Object.entries(CATALOG).map(([id, keys], index) => ({
    id,
    open: index === 0,
    label: localize(categoryKey(id), id),
    answered: keys.filter(key => profile.categories[id].levels[key] !== "default").length
      + profile.categories[id].custom.filter(row => row.level !== "default").length,
    total: keys.length + profile.categories[id].custom.length,
    items: keys.map(key => ({
      key,
      label: localize(itemKey(id, key), key),
      definition: localize(definitionKey(key), ""),
      level: profile.categories[id].levels[key],
      levelLabel: localize(`CONSENT.LEVEL_${profile.categories[id].levels[key].toUpperCase()}`)
    })),
    custom: profile.categories[id].custom.map(row => ({
      ...row,
      levelLabel: localize(`CONSENT.LEVEL_${row.level.toUpperCase()}`)
    }))
  }));
}

class XCardHudApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "consent-form-x-card-hud",
    classes: ["consent-x-hud-app"],
    position: { width: 72, height: 112 },
    window: {
      title: "",
      icon: false,
      minimizable: true,
      resizable: true,
      controls: []
    }
  };

  static PARTS = {
    hud: { template: "modules/consent-form/templates/x-card-hud.html" }
  };

  get title() {
    return localize("CONSENT.X_CARD_BUTTON");
  }

  _initializeApplicationOptions(options) {
    options = super._initializeApplicationOptions(options);
    const saved = game.settings.get(MODULE_ID, "xCardHudPosition");
    const layoutVersion = game.settings.get(MODULE_ID, "xCardHudLayoutVersion");
    if (saved?.left !== undefined) {
      options.position = {
        ...options.position,
        left: saved.left,
        top: saved.top,
        ...(layoutVersion >= 2 && Number.isFinite(saved.width) ? { width: saved.width } : {}),
        ...(layoutVersion >= 2 && Number.isFinite(saved.height) ? { height: saved.height } : {})
      };
    } else {
      options.position = {
        ...options.position,
        left: Math.max(16, window.innerWidth - 150),
        top: Math.max(16, window.innerHeight - 209)
      };
    }
    return options;
  }

  _onPosition(position) {
    super._onPosition(position);
    game.settings.set(MODULE_ID, "xCardHudPosition", {
      left: position.left,
      top: position.top,
      width: position.width,
      height: position.height
    });
  }

  async close(options = {}) {
    if (options?.force) return super.close(options);
    return this;
  }

  _onRender(...args) {
    super._onRender(...args);
    this.window.close?.remove();
    this.window.controls?.remove();
    const card = this.element.querySelector("[data-action='x-card']");
    card?.addEventListener("click", () => triggerXCard());
    if (game.settings.get(MODULE_ID, "xCardHudLayoutVersion") < 2) game.settings.set(MODULE_ID, "xCardHudLayoutVersion", 2);
  }
}

class ConsentPlayerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "consent-form-player",
    classes: ["consent-form-app", "consent-player-app"],
    tag: "form",
    window: { icon: "fa-solid fa-shield-heart", resizable: true },
    position: { width: 820, height: 780 },
    form: { closeOnSubmit: false }
  };

  static PARTS = {
    form: { template: "modules/consent-form/templates/player-app.html" }
  };

  profile = emptyProfile();
  saveQueue = Promise.resolve();
  saveTimer = null;
  pendingScrollTop = null;
  openCategories = new Set([Object.keys(CATALOG)[0]]);

  get title() {
    return localize("CONSENT.PLAYER_APP_TITLE");
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    this.profile = await getOwnProfile();
    const categories = prepareCategories(this.profile).map(category => ({ ...category, open: this.openCategories.has(category.id) }));
    const answered = categories.reduce((total, category) => total + category.answered, 0);
    const questionCount = categories.reduce((total, category) => total + category.total, 0);
    return foundry.utils.mergeObject(context, {
      categories,
      levels: levelOptions(),
      notes: this.profile.notes,
      answered,
      questionCount,
      completionPercent: questionCount ? Math.round(answered / questionCount * 100) : 0,
      updatedAt: this.profile.updatedAt ? new Date(this.profile.updatedAt).toLocaleString() : localize("CONSENT.NEVER_SAVED")
    }, { inplace: false });
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const content = this.element.querySelector(".consent-app-content");
    if (this.pendingScrollTop !== null) {
      if (content) content.scrollTop = this.pendingScrollTop;
      this.pendingScrollTop = null;
    }
    this.element.querySelectorAll("[data-set-level]").forEach(button => button.addEventListener("click", event => this.#changeLevel(event)));
    this.element.querySelectorAll("input[data-custom-label]").forEach(input => input.addEventListener("input", event => this.#changeCustomLabel(event)));
    this.element.querySelector("textarea[name='notes']")?.addEventListener("input", event => this.#changeNotes(event));
    this.element.querySelectorAll("[data-action='add-custom']").forEach(button => button.addEventListener("click", event => this.#addCustom(event)));
    this.element.querySelectorAll("[data-action='remove-custom']").forEach(button => button.addEventListener("click", event => this.#removeCustom(event)));
    this.element.querySelectorAll("[data-action='x-card']").forEach(button => button.addEventListener("click", () => triggerXCard()));
    this.element.querySelector("[data-action='export-profile']")?.addEventListener("click", () => this.#exportProfile());
    this.element.querySelector("[data-action='import-profile']")?.addEventListener("click", () => this.element.querySelector("[data-import-file]")?.click());
    this.element.querySelector("[data-import-file]")?.addEventListener("change", event => this.#importProfile(event));
  }

  async #persist({ render = false } = {}) {
    if (render) {
      this.pendingScrollTop = this.element?.querySelector(".consent-app-content")?.scrollTop ?? null;
      this.openCategories = new Set([...(this.element?.querySelectorAll(".consent-category[open]") ?? [])]
        .map(details => details.querySelector("[data-category-progress]")?.dataset.categoryProgress)
        .filter(Boolean));
    }
    this.profile.updatedAt = new Date().toISOString();
    const snapshot = normalizeProfile(this.profile);
    const status = this.element?.querySelector("[data-save-status]");
    if (status) status.textContent = localize("CONSENT.SAVING");
    this.saveQueue = this.saveQueue.then(() => saveOwnProfile(snapshot));
    try {
      await this.saveQueue;
      if (render) await this.render();
      else if (status) status.textContent = `${localize("CONSENT.SAVED")} · ${new Date(this.profile.updatedAt).toLocaleTimeString()}`;
    } catch (error) {
      if (render) this.pendingScrollTop = null;
      console.error("Consent Form | Profile save failed", error);
      if (status) status.textContent = localize("CONSENT.SAVE_ERROR");
      ui.notifications.error(localize("CONSENT.SAVE_ERROR"));
      this.saveQueue = Promise.resolve();
    }
  }

  #schedulePersist() {
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.#persist(), 500);
  }

  async #changeLevel(event) {
    event.preventDefault();
    const clickedButton = event.currentTarget;
    const { category, key, customId } = clickedButton.dataset;
    const requestedLevel = clickedButton.dataset.setLevel;
    if (customId) {
      const row = this.profile.categories[category].custom.find(entry => entry.id === customId);
      if (row) row.level = row.level === requestedLevel ? "default" : requestedLevel;
    } else {
      const currentLevel = this.profile.categories[category].levels[key];
      this.profile.categories[category].levels[key] = currentLevel === requestedLevel ? "default" : requestedLevel;
    }
    await this.#persist();
    this.#refreshProgress(category, clickedButton);
  }

  #refreshProgress(category, clickedButton) {
    const categoryData = this.profile.categories[category];
    const answered = Object.values(categoryData.levels).filter(level => level !== "default").length
      + categoryData.custom.filter(row => row.level !== "default").length;
    const total = Object.keys(categoryData.levels).length + categoryData.custom.length;
    const categoryProgress = this.element.querySelector(`[data-category-progress="${category}"]`);
    if (categoryProgress) categoryProgress.textContent = `${answered} / ${total}`;

    const allCategories = Object.values(this.profile.categories);
    const overallAnswered = allCategories.reduce((sum, entry) => sum
      + Object.values(entry.levels).filter(level => level !== "default").length
      + entry.custom.filter(row => row.level !== "default").length, 0);
    const overallTotal = allCategories.reduce((sum, entry) => sum + Object.keys(entry.levels).length + entry.custom.length, 0);
    const percent = overallTotal ? Math.round(overallAnswered / overallTotal * 100) : 0;
    const overallProgress = this.element.querySelector("[data-overall-progress]");
    const overallBar = this.element.querySelector("[data-overall-progress-bar]");
    if (overallProgress) overallProgress.textContent = `${percent}%`;
    if (overallBar) overallBar.style.width = `${percent}%`;

    const group = clickedButton.closest(".consent-level-buttons");
    if (group) {
      const { key, customId } = clickedButton.dataset;
      const selectedLevel = customId
        ? categoryData.custom.find(row => row.id === customId)?.level ?? "default"
        : categoryData.levels[key];
      group.querySelectorAll("[data-set-level]").forEach(button => {
        const selected = button.dataset.setLevel === selectedLevel;
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
    }
  }

  async #changeCustomLabel(event) {
    const { category, customId } = event.currentTarget.dataset;
    const row = this.profile.categories[category].custom.find(entry => entry.id === customId);
    if (row) row.label = event.currentTarget.value.trim();
    this.#schedulePersist();
  }

  async #changeNotes(event) {
    this.profile.notes = event.currentTarget.value;
    this.#schedulePersist();
  }

  async #addCustom(event) {
    event.preventDefault();
    const category = event.currentTarget.dataset.category;
    this.profile.categories[category].custom.push({ id: foundry.utils.randomID(), label: "", level: "default" });
    await this.#persist({ render: true });
  }

  async #removeCustom(event) {
    event.preventDefault();
    const { category, customId } = event.currentTarget.dataset;
    this.profile.categories[category].custom = this.profile.categories[category].custom.filter(row => row.id !== customId);
    await this.#persist({ render: true });
  }

  #exportProfile() {
    const payload = {
      format: MODULE_ID,
      formatVersion: 1,
      moduleVersion: game.modules.get(MODULE_ID)?.version ?? "",
      exportedAt: new Date().toISOString(),
      playerName: game.user.name,
      profile: normalizeProfile(this.profile)
    };
    const safeName = game.user.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "") || "player";
    foundry.utils.saveDataToFile(
      JSON.stringify(payload, null, 2),
      "application/json",
      `consent-form-${safeName}.json`
    );
    ui.notifications.info(localize("CONSENT.EXPORT_SUCCESS"));
  }

  async #importProfile(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    try {
      if (file.size > IMPORT_MAX_BYTES) throw new Error("Import file is too large");
      const payload = JSON.parse(await file.text());
      const imported = validateImportedProfile(payload, file.size);
      const categories = prepareCategories(imported);
      const answered = categories.reduce((total, category) => total + category.answered, 0);
      const total = categories.reduce((sum, category) => sum + category.total, 0);

      const content = document.createElement("div");
      const warning = document.createElement("p");
      warning.textContent = localize("CONSENT.IMPORT_CONFIRM_WARNING");
      const summary = document.createElement("p");
      summary.textContent = game.i18n.format("CONSENT.IMPORT_CONFIRM_SUMMARY", {
        playerName: String(payload.playerName ?? localize("CONSENT.UNKNOWN_PLAYER")),
        answered,
        total
      });
      content.append(warning, summary);

      const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: localize("CONSENT.IMPORT_CONFIRM_TITLE") },
        content,
        rejectClose: false,
        modal: true,
        yes: { label: localize("CONSENT.IMPORT_REPLACE") }
      });
      if (!confirmed) return;

      imported.updatedAt = new Date().toISOString();
      this.profile = imported;
      await saveOwnProfile(imported);
      await this.render();
      ui.notifications.info(localize("CONSENT.IMPORT_SUCCESS"));
    } catch (error) {
      console.error("Consent Form | Profile import failed", error);
      ui.notifications.error(localize("CONSENT.IMPORT_ERROR"));
    }
  }
}

function analyzeProfiles(users) {
  const totals = { default: 0, narrative: 0, discuss: 0, forbidden: 0 };
  const topics = new Map();
  const categoryStats = new Map(Object.keys(CATALOG).map(id => [id, {
    id,
    label: localize(categoryKey(id), id),
    discuss: 0,
    forbidden: 0
  }]));
  let completed = 0;
  for (const entry of users) {
    if (!entry.profile.updatedAt) continue;
    completed += 1;
    for (const category of prepareCategories(entry.profile)) {
      for (const item of [...category.items, ...category.custom.map(row => ({ ...row, key: row.id, custom: true }))]) {
        const level = item.level ?? "default";
        totals[level] += 1;
        if (["discuss", "forbidden"].includes(level)) categoryStats.get(category.id)[level] += 1;
        if (level === "default") continue;
        const normalizedCustomLabel = item.label.trim().toLocaleLowerCase();
        const id = item.custom && normalizedCustomLabel
          ? `${category.id}.custom.${normalizedCustomLabel}`
          : `${category.id}.${item.key}`;
        const topic = topics.get(id) ?? { label: item.label || localize("CONSENT.UNNAMED_TOPIC"), category: category.label, categoryId: category.id, narrative: [], discuss: [], forbidden: [] };
        topic[level].push(entry.user.name);
        topics.set(id, topic);
      }
    }
  }
  const priorities = [...topics.values()]
    .filter(topic => topic.forbidden.length || topic.discuss.length)
    .sort((a, b) => (b.forbidden.length * 100 + b.discuss.length) - (a.forbidden.length * 100 + a.discuss.length));
  const stats = [...categoryStats.values()];
  const buildChart = level => {
    const rows = stats.filter(row => row[level] > 0).sort((a, b) => b[level] - a[level] || a.label.localeCompare(b.label));
    const maximum = Math.max(1, ...rows.map(row => row[level]));
    return rows.map(row => ({
      id: row.id,
      label: row.label,
      value: row[level],
      percent: Math.round(row[level] / maximum * 100)
    }));
  };
  return { totals, completed, priorities, charts: { forbidden: buildChart("forbidden"), discuss: buildChart("discuss") } };
}

class ConsentDashboardApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "consent-form-dashboard",
    classes: ["consent-form-app", "consent-dashboard-app"],
    window: { icon: "fa-solid fa-chart-pie", resizable: true },
    position: { width: 980, height: 800 }
  };

  static PARTS = {
    dashboard: { template: "modules/consent-form/templates/gm-dashboard.html" }
  };

  selectedUserId = null;
  gmSaveTimer = null;
  chartFilter = null;
  scrollPositions = new Map();
  scrollSaveTimer = null;

  get title() {
    return localize("CONSENT.GM_APP_TITLE");
  }

  render(options = {}) {
    this.#captureScrollPositions();
    return super.render(options);
  }

  #captureScrollPositions() {
    if (!this.element) return;
    for (const [key, selector] of Object.entries({ main: ".consent-app-content", priorities: ".priority-list" })) {
      const element = this.element.querySelector(selector);
      if (element) this.scrollPositions.set(key, { top: element.scrollTop, left: element.scrollLeft });
    }
  }

  #saveScrollPositions() {
    window.clearTimeout(this.scrollSaveTimer);
    this.scrollSaveTimer = window.setTimeout(() => {
      const positions = Object.fromEntries(this.scrollPositions);
      game.settings.set(MODULE_ID, "dashboardScrollPositions", positions);
    }, 150);
  }

  #restoreScrollPositions() {
    for (const [key, selector] of Object.entries({ main: ".consent-app-content", priorities: ".priority-list" })) {
      const element = this.element.querySelector(selector);
      const position = this.scrollPositions.get(key);
      if (!element || !position) continue;
      element.scrollTop = position.top;
      element.scrollLeft = position.left;
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const users = game.users.filter(user => !user.isGM).map(user => ({
      user,
      profile: normalizeProfile(getProfileStorage(user.id)?.getFlag(MODULE_ID, DATA_FLAG)),
      active: user.active
    }));
    const analysis = analyzeProfiles(users);
    const gmNotes = getGmStorage()?.getFlag(MODULE_ID, "gmNotes") ?? {};
    const selected = users.find(entry => entry.user.id === this.selectedUserId) ?? users[0] ?? null;
    this.selectedUserId = selected?.user.id ?? null;
    const selectedCategories = selected
      ? prepareCategories(selected.profile).map(category => ({
        ...category,
        items: category.items.filter(item => item.level !== "default"),
        custom: category.custom.filter(item => item.level !== "default")
      })).filter(category => category.items.length || category.custom.length)
      : [];
    const priorities = this.chartFilter
      ? analysis.priorities.filter(topic => topic.categoryId === this.chartFilter.categoryId)
      : analysis.priorities;
    return foundry.utils.mergeObject(context, {
      players: users.map(entry => ({ id: entry.user.id, name: entry.user.name, active: entry.active, completed: Boolean(entry.profile.updatedAt), selected: entry.user.id === this.selectedUserId, updatedAt: entry.profile.updatedAt ? new Date(entry.profile.updatedAt).toLocaleString() : "" })),
      playerCount: users.length,
      completed: analysis.completed,
      completionPercent: users.length ? Math.round(analysis.completed / users.length * 100) : 0,
      totals: analysis.totals,
      priorities,
      charts: {
        forbidden: analysis.charts.forbidden.map(row => ({ ...row, selected: this.chartFilter?.level === "forbidden" && this.chartFilter.categoryId === row.id })),
        discuss: analysis.charts.discuss.map(row => ({ ...row, selected: this.chartFilter?.level === "discuss" && this.chartFilter.categoryId === row.id }))
      },
      chartFilterActive: Boolean(this.chartFilter),
      selected: selected ? {
        id: selected.user.id,
        name: selected.user.name,
        updatedAt: selected.profile.updatedAt ? new Date(selected.profile.updatedAt).toLocaleString() : localize("CONSENT.NEVER_SAVED"),
        categories: selectedCategories,
        notes: selected.profile.notes,
        gmNote: String(gmNotes[selected.user.id] ?? "")
      } : null
    }, { inplace: false });
  }

  _onRender(context, options) {
    super._onRender(context, options);
    if (!this.scrollPositions.size) {
      this.scrollPositions = new Map(Object.entries(game.settings.get(MODULE_ID, "dashboardScrollPositions") ?? {}));
    }
    this.#restoreScrollPositions();
    for (const selector of [".consent-app-content", ".priority-list"]) {
      this.element.querySelector(selector)?.addEventListener("scroll", () => {
        this.#captureScrollPositions();
        this.#saveScrollPositions();
      }, { passive: true });
    }
    this.element.querySelectorAll("[data-user-id]").forEach(button => button.addEventListener("click", async event => {
      this.selectedUserId = event.currentTarget.dataset.userId;
      await this.render();
    }));
    this.element.querySelectorAll("[data-chart-category]").forEach(button => button.addEventListener("click", async event => {
      const { chartCategory: categoryId, chartLevel: level } = event.currentTarget.dataset;
      this.chartFilter = this.chartFilter?.categoryId === categoryId && this.chartFilter?.level === level
        ? null
        : { categoryId, level };
      await this.render();
    }));
    this.element.querySelector("[data-clear-chart-filter]")?.addEventListener("click", async () => {
      this.chartFilter = null;
      await this.render();
    });
    this.element.querySelector("[data-gm-note]")?.addEventListener("input", event => {
      window.clearTimeout(this.gmSaveTimer);
      this.gmSaveTimer = window.setTimeout(() => this.#saveGmNote(event), 500);
    });
  }

  async #saveGmNote(event) {
    const textarea = event.currentTarget;
    const userId = textarea.dataset.userId;
    const storage = getGmStorage();
    if (!storage || !game.user.isGM) return;
    const notes = { ...(storage.getFlag(MODULE_ID, "gmNotes") ?? {}) };
    const value = textarea.value.trim();
    if (value) notes[userId] = value;
    else delete notes[userId];
    const status = this.element.querySelector("[data-gm-note-status]");
    if (status) status.textContent = localize("CONSENT.SAVING");
    try {
      await storage.setFlag(MODULE_ID, "gmNotes", notes);
      if (status) status.textContent = localize("CONSENT.SAVED");
    } catch (error) {
      console.error("Consent Form | GM note save failed", error);
      if (status) status.textContent = localize("CONSENT.SAVE_ERROR");
      ui.notifications.error(localize("CONSENT.SAVE_ERROR"));
    }
  }
}

class BreakControlApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "consent-form-break-control",
    classes: ["consent-form-app", "consent-break-app"],
    window: { icon: "fa-solid fa-mug-hot", resizable: false },
    position: { width: 520, height: "auto" }
  };

  static PARTS = {
    control: { template: "modules/consent-form/templates/break-control.html" }
  };

  get title() {
    return localize("CONSENT.BREAK_CONTROL_TITLE");
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const activeBreak = game.settings.get(MODULE_ID, "activeBreak");
    return foundry.utils.mergeObject(context, {
      breakActive: Boolean(activeBreak?.id),
      breakStatus: activeBreak?.endsAt ? localize("CONSENT.BREAK_TIMED_ACTIVE") : localize("CONSENT.BREAK_OPEN_ACTIVE")
    }, { inplace: false });
  }

  _onRender(context, options) {
    super._onRender(context, options);
    this.element.querySelector("[data-action='start-timed-break']")?.addEventListener("click", async () => {
      const input = this.element.querySelector("[data-break-minutes]");
      const minutes = Math.min(180, Math.max(1, Math.round(Number(input?.value) || 10)));
      await startTableBreak(minutes);
    });
    this.element.querySelector("[data-action='start-open-break']")?.addEventListener("click", () => startTableBreak());
    this.element.querySelector("[data-action='end-break']")?.addEventListener("click", () => endTableBreak());
  }
}

async function startTableBreak(minutes = null) {
  if (!game.user.isGM) return;
  const startedAt = Date.now();
  const durationMinutes = Number.isFinite(minutes) ? minutes : null;
  await game.settings.set(MODULE_ID, "activeBreak", {
    id: foundry.utils.randomID(),
    startedAt,
    endsAt: durationMinutes ? startedAt + durationMinutes * 60_000 : null,
    durationMinutes
  });
}

async function endTableBreak() {
  if (!game.user.isGM) return;
  await game.settings.set(MODULE_ID, "activeBreak", {});
}

function formatBreakTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function syncTableBreak(activeBreak) {
  window.clearInterval(tableBreakTimer);
  tableBreakTimer = null;
  document.querySelector(".consent-table-break")?.remove();
  if (!activeBreak?.id) return;

  const overlay = document.createElement("div");
  overlay.className = "consent-table-break";
  overlay.dataset.breakId = activeBreak.id;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  const panel = document.createElement("div");
  panel.className = "consent-table-break__panel";
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-mug-hot consent-table-break__icon";
  icon.setAttribute("aria-hidden", "true");
  const title = document.createElement("h2");
  title.textContent = localize("CONSENT.BREAK_OVERLAY_TITLE");
  const message = document.createElement("p");
  message.textContent = activeBreak.endsAt ? localize("CONSENT.BREAK_OVERLAY_TIMED") : localize("CONSENT.BREAK_OVERLAY_OPEN");
  const time = document.createElement("strong");
  time.className = "consent-table-break__time";
  time.setAttribute("aria-live", "polite");
  panel.append(icon, title, message);
  if (activeBreak.endsAt) panel.append(time);

  if (game.user.isGM) {
    const end = document.createElement("button");
    end.type = "button";
    end.innerHTML = `<i class="fa-solid fa-stop" aria-hidden="true"></i> ${localize("CONSENT.BREAK_END")}`;
    end.addEventListener("click", () => endTableBreak());
    panel.append(end);
  }
  overlay.append(panel);
  document.body.append(overlay);

  const updateTime = () => {
    if (!activeBreak.endsAt) return;
    const remaining = activeBreak.endsAt - Date.now();
    time.textContent = formatBreakTime(remaining);
    if (remaining > 0) return;
    window.clearInterval(tableBreakTimer);
    tableBreakTimer = null;
    const activeGms = game.users.filter(user => user.isGM && user.active).sort((a, b) => a.id.localeCompare(b.id));
    if (activeGms[0]?.id === game.user.id) endTableBreak();
  };
  updateTime();
  if (activeBreak.endsAt) tableBreakTimer = window.setInterval(updateTime, 1000);
}

function getXCardChoices(profile) {
  return prepareCategories(profile).map(category => ({
    id: category.id,
    label: category.label,
    icon: CATEGORY_ICONS[category.id] ?? "fa-solid fa-circle-exclamation",
    items: [...category.items, ...category.custom]
      .filter(item => ["discuss", "forbidden"].includes(item.level))
      .map(item => ({ label: item.label || localize("CONSENT.UNNAMED_TOPIC"), level: item.level }))
  })).filter(category => category.items.length);
}

function createXCardButton({ label, icon, level = null, className = "" }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `consent-x-choice ${className}`.trim();
  if (level) button.classList.add(`consent-x-choice--${level}`);
  const iconElement = document.createElement("i");
  iconElement.className = icon;
  iconElement.setAttribute("aria-hidden", "true");
  const labelElement = document.createElement("span");
  labelElement.textContent = label;
  button.append(iconElement, labelElement);
  return button;
}

function showXCard({ interactive = false, profile = null, pauseId = null, onComplete = null, onEnd = null, canEnd = false, returnFocus = null } = {}) {
  const existing = document.querySelector(".consent-x-card");
  if (existing?.classList.contains("consent-x-card--interactive") && !interactive) return;
  existing?.remove();
  const previousFocus = returnFocus ?? document.activeElement;
  const overlay = document.createElement("div");
  overlay.className = `consent-x-card${interactive ? " consent-x-card--interactive" : ""}`;
  if (pauseId) overlay.dataset.pauseId = pauseId;
  overlay.setAttribute("role", interactive ? "dialog" : "status");
  if (interactive) overlay.setAttribute("aria-modal", "true");
  const panel = document.createElement("div");
  panel.className = "consent-x-card__panel";
  const x = document.createElement("div");
  x.className = "consent-x-card__x";
  x.textContent = "X";
  const title = document.createElement("h2");
  title.id = `consent-x-card-title-${foundry.utils.randomID()}`;
  title.textContent = localize(interactive ? "CONSENT.X_CARD_TITLE" : "CONSENT.X_CARD_TABLE_TITLE");
  overlay.setAttribute("aria-labelledby", title.id);
  const message = document.createElement("p");
  message.id = `consent-x-card-description-${foundry.utils.randomID()}`;
  message.textContent = localize(interactive ? "CONSENT.X_CARD_MESSAGE" : "CONSENT.X_CARD_TABLE_MESSAGE");
  overlay.setAttribute("aria-describedby", message.id);
  panel.append(x, title, message);
  overlay.append(panel);

  const endPause = () => {
    overlay.remove();
    previousFocus?.focus?.();
    onEnd?.();
  };

  const showEndAction = () => {
    const endState = document.createElement("section");
    endState.className = "consent-x-end-state";
    message.textContent = localize("CONSENT.X_CARD_DETAIL_RECORDED");
    const end = createXCardButton({ label: localize("CONSENT.X_CARD_END_PAUSE"), icon: "fa-solid fa-check", className: "consent-x-choice--primary" });
    end.addEventListener("click", endPause);
    endState.append(end);
    panel.querySelector(".consent-x-refinement")?.replaceWith(endState);
    end.focus();
  };

  const finishDetail = selection => {
    onComplete?.(selection);
    showEndAction();
  };

  if (interactive) {
    const choices = getXCardChoices(profile ?? emptyProfile());
    const refinement = document.createElement("section");
    refinement.className = "consent-x-refinement";
    const prompt = document.createElement("p");
    prompt.className = "consent-x-refinement__prompt";
    prompt.textContent = localize("CONSENT.X_CARD_CATEGORY_PROMPT");
    const privacy = document.createElement("aside");
    privacy.className = "consent-x-refinement__privacy";
    const privacyIcon = document.createElement("i");
    privacyIcon.className = "fa-solid fa-lock";
    privacyIcon.setAttribute("aria-hidden", "true");
    const privacyText = document.createElement("span");
    privacyText.textContent = localize("CONSENT.X_CARD_DETAIL_PRIVACY");
    privacy.append(privacyIcon, privacyText);
    const choiceGrid = document.createElement("div");
    choiceGrid.className = "consent-x-choices";

    const showCategories = () => {
      prompt.textContent = localize("CONSENT.X_CARD_CATEGORY_PROMPT");
      choiceGrid.replaceChildren();
      for (const category of choices) {
        const button = createXCardButton({ label: category.label, icon: category.icon });
        button.addEventListener("click", () => {
          prompt.textContent = localize("CONSENT.X_CARD_TOPIC_PROMPT");
          choiceGrid.replaceChildren();
          for (const item of category.items) {
            const itemButton = createXCardButton({
              label: item.label,
              icon: item.level === "forbidden" ? "fa-solid fa-ban" : "fa-solid fa-comments",
              level: item.level
            });
            itemButton.addEventListener("click", () => finishDetail({ category, item }));
            choiceGrid.append(itemButton);
          }
          const back = createXCardButton({ label: localize("CONSENT.BACK"), icon: "fa-solid fa-arrow-left", className: "consent-x-choice--secondary" });
          back.addEventListener("click", showCategories);
          choiceGrid.append(back);
          choiceGrid.querySelector("button")?.focus();
        });
        choiceGrid.append(button);
      }

      const skip = createXCardButton({ label: localize("CONSENT.X_CARD_SKIP_DETAIL"), icon: "fa-solid fa-shield", className: "consent-x-choice--secondary" });
      skip.addEventListener("click", () => finishDetail(null));
      choiceGrid.append(skip);
      choiceGrid.querySelector("button")?.focus();
    };

    refinement.append(prompt, privacy, choiceGrid);
    const actions = document.createElement("div");
    actions.className = "consent-x-actions";
    const close = createXCardButton({ label: localize("CONSENT.X_CARD_END_PAUSE"), icon: "fa-solid fa-check", className: "consent-x-choice--primary" });
    close.addEventListener("click", endPause);
    actions.append(close);
    if (choices.length) {
      const specify = createXCardButton({ label: localize("CONSENT.X_CARD_SPECIFY"), icon: "fa-solid fa-chevron-down", className: "consent-x-choice--secondary" });
      specify.addEventListener("click", () => {
        actions.replaceWith(refinement);
        showCategories();
      });
      actions.append(specify);
    }
    panel.append(actions);
  } else if (canEnd) {
    const actions = document.createElement("div");
    actions.className = "consent-x-actions";
    const end = createXCardButton({ label: localize("CONSENT.X_CARD_GM_END_PAUSE"), icon: "fa-solid fa-check", className: "consent-x-choice--secondary" });
    end.addEventListener("click", endPause);
    actions.append(end);
    panel.append(actions);
  }
  document.body.append(overlay);
  if (interactive) {
    const focusableSelector = "button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    overlay.querySelector(focusableSelector)?.focus();
    overlay.addEventListener("keydown", event => {
      if (event.key !== "Tab") return;
      const focusable = [...overlay.querySelectorAll(focusableSelector)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }
}

async function sendXCardWhisper(selection) {
  const gmIds = game.users.filter(user => user.isGM).map(user => user.id);
  if (!gmIds.length) return;
  const detail = selection
    ? `<div class="consent-chat-alert__context">
        <div class="consent-chat-alert__field">
          <span><i class="${selection.category.icon}"></i>${localize("CONSENT.X_CARD_CATEGORY")}</span>
          <strong>${escapeHTML(selection.category.label)}</strong>
        </div>
        <div class="consent-chat-alert__field consent-chat-alert__field--topic">
          <span><i class="fa-solid fa-crosshairs"></i>${localize("CONSENT.X_CARD_TOPIC")}</span>
          <strong>${escapeHTML(selection.item.label)}</strong>
        </div>
        <div class="consent-chat-alert__level consent-chat-alert__level--${selection.item.level}">
          <i class="${selection.item.level === "forbidden" ? "fa-solid fa-ban" : "fa-solid fa-comments"}"></i>
          ${localize(`CONSENT.LEVEL_${selection.item.level.toUpperCase()}`)}
        </div>
      </div>`
    : `<div class="consent-chat-alert__no-detail"><i class="fa-solid fa-shield"></i><span>${localize("CONSENT.X_CARD_NO_DETAIL")}</span></div>`;
  const initiator = escapeHTML(game.i18n.format("CONSENT.X_CARD_PRIVATE_MESSAGE", { playerName: game.user.name }));
  await ChatMessage.create({
    content: `<article class="consent-chat-alert">
      <header class="consent-chat-alert__header">
        <span class="consent-chat-alert__x">X</span>
        <span><small>${localize("CONSENT.SAFETY_TOOL")}</small><strong>${localize("CONSENT.X_CARD_PRIVATE_TITLE")}</strong></span>
      </header>
      <div class="consent-chat-alert__body"><p class="consent-chat-alert__initiator">${initiator}</p>${detail}</div>
    </article>`,
    whisper: gmIds
  });
}

async function endXCardPause(pauseId) {
  if (!pauseId) return;
  const activeGms = game.users.filter(user => user.isGM && user.active);
  if (!activeGms.length) return;
  try {
    await ChatMessage.create(game.user.isGM ? {
      content: localize("CONSENT.X_CARD_END_SIGNAL_TECHNICAL"),
      whisper: game.users.filter(user => user.active).map(user => user.id),
      flags: { [MODULE_ID]: { xCardEndSignal: true, pauseId } }
    } : {
      content: localize("CONSENT.X_CARD_END_REQUEST_TECHNICAL"),
      whisper: activeGms.map(user => user.id),
      flags: { [MODULE_ID]: { xCardEndRequest: true, pauseId } }
    });
  } catch (error) {
    console.error("Consent Form | X-Card end request failed", error);
    ui.notifications.error(localize("CONSENT.X_CARD_SEND_ERROR"));
  }
}

async function triggerXCard() {
  const now = Date.now();
  const remaining = X_CARD_COOLDOWN_MS - (now - lastXCardAt);
  if (remaining > 0) {
    ui.notifications.warn(game.i18n.format("CONSENT.X_CARD_COOLDOWN", { seconds: Math.ceil(remaining / 1000) }));
    return;
  }
  lastXCardAt = now;
  const pauseId = foundry.utils.randomID();
  let detailSent = false;
  const profile = await getOwnProfile();
  showXCard({
    interactive: true,
    profile,
    pauseId,
    onComplete: selection => {
      detailSent = true;
      sendXCardWhisper(selection);
    },
    onEnd: () => {
      if (!detailSent) sendXCardWhisper(null);
      endXCardPause(pauseId);
    }
  });
  const gmIds = game.users.filter(user => user.isGM && user.active).map(user => user.id);
  if (!gmIds.length) {
    ui.notifications.warn(localize("CONSENT.X_CARD_NO_GM"));
    return;
  }
  try {
    await ChatMessage.create(game.user.isGM ? {
      content: localize("CONSENT.X_CARD_SIGNAL_TECHNICAL"),
      whisper: game.users.filter(user => user.active).map(user => user.id),
      flags: { [MODULE_ID]: { xCardSignal: true, senderId: game.user.id, pauseId } }
    } : {
      content: localize("CONSENT.X_CARD_REQUEST_TECHNICAL"),
      whisper: gmIds,
      flags: { [MODULE_ID]: { xCardRequest: true, pauseId } }
    });
  } catch (error) {
    lastXCardAt = 0;
    console.error("Consent Form | X-Card request failed", error);
    ui.notifications.error(localize("CONSENT.X_CARD_SEND_ERROR"));
  }
}

async function relayXCardRequest(message) {
  if (!game.user.isGM || message.author?.isGM) return;
  const activeGms = game.users.filter(user => user.isGM && user.active).sort((a, b) => a.id.localeCompare(b.id));
  if (activeGms[0]?.id !== game.user.id) return;
  const senderId = message.author?.id;
  const pauseId = message.getFlag(MODULE_ID, "pauseId");
  if (!senderId || typeof pauseId !== "string" || !pauseId) return;
  const now = Date.now();
  const lastRequest = xCardRequests.get(senderId) ?? 0;
  if (now - lastRequest < X_CARD_COOLDOWN_MS) return;
  xCardRequests.set(senderId, now);
  activeXCards.set(pauseId, senderId);
  await ChatMessage.create({
    content: localize("CONSENT.X_CARD_SIGNAL_TECHNICAL"),
    whisper: game.users.filter(user => user.active).map(user => user.id),
    flags: { [MODULE_ID]: { xCardSignal: true, senderId, pauseId } }
  });
}

async function relayXCardEndRequest(message) {
  if (!game.user.isGM || message.author?.isGM) return;
  const activeGms = game.users.filter(user => user.isGM && user.active).sort((a, b) => a.id.localeCompare(b.id));
  if (activeGms[0]?.id !== game.user.id) return;
  const pauseId = message.getFlag(MODULE_ID, "pauseId");
  if (typeof pauseId !== "string" || activeXCards.get(pauseId) !== message.author?.id) return;
  await ChatMessage.create({
    content: localize("CONSENT.X_CARD_END_SIGNAL_TECHNICAL"),
    whisper: game.users.filter(user => user.active).map(user => user.id),
    flags: { [MODULE_ID]: { xCardEndSignal: true, pauseId } }
  });
}

function openPlayerApp() {
  if (game.user.isGM) return;
  const existing = foundry.applications.instances.get("consent-form-player");
  if (existing) existing.bringToFront();
  else new ConsentPlayerApp().render({ force: true });
}

function openDashboard() {
  if (!game.user.isGM) return;
  const existing = foundry.applications.instances.get("consent-form-dashboard");
  if (existing) existing.bringToFront();
  else new ConsentDashboardApp().render({ force: true });
}

function addConsentLinksToSettings(application, htmlElement) {
  const html = htmlElement instanceof HTMLElement ? htmlElement : htmlElement?.[0];
  if (!html || html.querySelector(".consent-form-links")) return;
  const settingsBlocks = [...html.querySelectorAll("section.settings.flexcol")];
  const targetBlock = settingsBlocks.find(block => block.querySelector('button[data-action="openApp"][data-app="configure"]'));
  if (!targetBlock) {
    console.warn("Consent Form | Settings block not found");
    return;
  }
  const buttons = targetBlock.querySelectorAll('button[data-action="openApp"]');
  const lastButton = buttons[buttons.length - 1];
  if (!lastButton) {
    console.warn("Consent Form | No settings buttons found");
    return;
  }

  const section = document.createElement("section");
  section.classList.add("settings", "flexcol", "consent-form-links");
  const heading = document.createElement("h4");
  heading.className = "divider";
  heading.style.marginTop = "1rem";
  heading.textContent = "Consent Form";
  section.append(heading);

  const links = [
    { icon: "fab fa-github", labelKey: "CONSENT.LINK_REPOSITORY", urlKey: "CONSENT.LINK_REPOSITORY_URL" },
    { icon: "fa-regular fa-mug-hot fa-bounce", labelKey: "CONSENT.LINK_DONATION", urlKey: "CONSENT.LINK_DONATION_URL" }
  ];
  for (const { icon, labelKey, urlKey } of links) {
    const button = document.createElement("button");
    button.type = "button";
    const mainIcon = document.createElement("i");
    mainIcon.className = icon;
    mainIcon.setAttribute("aria-hidden", "true");
    const label = document.createTextNode(game.i18n.localize(labelKey));
    const external = document.createElement("sup");
    external.innerHTML = '<i class="fa-light fa-up-right-from-square" aria-hidden="true"></i>';
    button.append(mainIcon, label, external);
    button.addEventListener("click", event => {
      event.preventDefault();
      const opened = window.open(game.i18n.localize(urlKey), "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
    });
    section.append(button);
  }
  targetBlock.insertBefore(section, lastButton.nextSibling);
}

Hooks.once("init", () => {
  console.log("Consent Form | Initializing v3 for Foundry VTT 14");
  game.settings.register(MODULE_ID, "xCardHudPosition", {
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });
  game.settings.register(MODULE_ID, "xCardHudLayoutVersion", {
    scope: "client",
    config: false,
    type: Number,
    default: 0
  });
  game.settings.register(MODULE_ID, "dashboardScrollPositions", {
    scope: "client",
    config: false,
    type: Object,
    default: {}
  });
  game.settings.register(MODULE_ID, "gmNotes", {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
  game.settings.register(MODULE_ID, "activeBreak", {
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });
  game.settings.registerMenu(MODULE_ID, "playerApp", {
    name: "CONSENT.PLAYER_APP_TITLE",
    label: "CONSENT.OPEN_PLAYER_APP",
    hint: "CONSENT.OPEN_PLAYER_APP_HINT",
    icon: "fa-solid fa-shield-heart",
    type: ConsentPlayerApp,
    restricted: false
  });
  game.settings.registerMenu(MODULE_ID, "gmDashboard", {
    name: "CONSENT.GM_APP_TITLE",
    label: "CONSENT.OPEN_GM_APP",
    hint: "CONSENT.OPEN_GM_APP_HINT",
    icon: "fa-solid fa-chart-pie",
    type: ConsentDashboardApp,
    restricted: true
  });
  game.settings.registerMenu(MODULE_ID, "breakControl", {
    name: "CONSENT.BREAK_CONTROL_TITLE",
    label: "CONSENT.BREAK_OPEN_CONTROL",
    hint: "CONSENT.BREAK_CONTROL_HINT",
    icon: "fa-solid fa-mug-hot",
    type: BreakControlApp,
    restricted: true
  });
});

Hooks.once("ready", async () => {
  try {
    await provisionStorage();
  } catch (error) {
    console.error("Consent Form | Storage provisioning failed", error);
    if (game.user.isGM) ui.notifications.error(localize("CONSENT.STORAGE_ERROR"));
  }
  if (game.user.isGM) game.settings.menus.delete(`${MODULE_ID}.playerApp`);
  else {
    new XCardHudApp().render(true);
  }
  syncTableBreak(game.settings.get(MODULE_ID, "activeBreak"));
  game.socket.on(`module.${MODULE_ID}`, data => {
    if (data?.type !== "provision-storage" || !game.user.isGM) return;
    const user = game.users.get(data.userId);
    if (!user || user.isGM || getProfileStorage(user.id)) return;
    provisionStorage().catch(error => console.error("Consent Form | Storage provisioning failed", error));
  });
});

Hooks.on("updateSetting", setting => {
  if (setting.key !== `${MODULE_ID}.activeBreak`) return;
  syncTableBreak(game.settings.get(MODULE_ID, "activeBreak"));
  foundry.applications.instances.get("consent-form-break-control")?.render();
});

Hooks.on("createChatMessage", message => {
  if (message.getFlag(MODULE_ID, "xCardEndRequest")) {
    relayXCardEndRequest(message).catch(error => console.error("Consent Form | X-Card end relay failed", error));
    return;
  }
  if (message.getFlag(MODULE_ID, "xCardEndSignal") && message.author?.isGM) {
    const pauseId = message.getFlag(MODULE_ID, "pauseId");
    const overlay = document.querySelector(".consent-x-card");
    if (overlay?.dataset.pauseId === pauseId) overlay.remove();
    activeXCards.delete(pauseId);
    return;
  }
  if (message.getFlag(MODULE_ID, "xCardRequest")) {
    relayXCardRequest(message).catch(error => console.error("Consent Form | X-Card relay failed", error));
    return;
  }
  if (!message.getFlag(MODULE_ID, "xCardSignal") || !message.author?.isGM) return;
  const senderId = message.getFlag(MODULE_ID, "senderId");
  const pauseId = message.getFlag(MODULE_ID, "pauseId");
  if (typeof pauseId !== "string" || !pauseId) return;
  activeXCards.set(pauseId, senderId);
  if (senderId !== game.user.id) showXCard({ pauseId, canEnd: game.user.isGM, onEnd: () => endXCardPause(pauseId) });
  if (game.user.isGM) ui.notifications.info(localize("CONSENT.X_CARD_GM_NOTIFICATION"), { permanent: false });
});

Hooks.on("renderChatMessageHTML", (message, html) => {
  const technical = ["xCardRequest", "xCardSignal", "xCardEndRequest", "xCardEndSignal"]
    .some(flag => message.getFlag(MODULE_ID, flag));
  if (!technical) return;
  const element = html instanceof HTMLElement ? html : html?.[0];
  if (element) element.style.display = "none";
});

Hooks.on("updateUser", (user, changes) => {
  if (game.user.isGM && !user.isGM && !getProfileStorage(user.id)) provisionStorage();
  foundry.applications.instances.get("consent-form-dashboard")?.render();
});

Hooks.on("updateJournalEntry", journal => {
  if (journal.getFlag(MODULE_ID, STORAGE_FLAG) !== PROFILE_STORAGE) return;
  foundry.applications.instances.get("consent-form-dashboard")?.render();
});

Hooks.on("preDeleteJournalEntry", journal => {
  if (!isModuleStorage(journal)) return true;
  ui.notifications.warn(localize("CONSENT.STORAGE_DELETE_BLOCKED"));
  return false;
});

Hooks.on("renderJournalDirectoryHTML", (application, html) => hideStorageFromJournalDirectory(html));
Hooks.on("renderJournalDirectory", (application, html) => hideStorageFromJournalDirectory(html));
Hooks.on("renderSettings", addConsentLinksToSettings);

globalThis.ConsentForm = { openPlayerApp, openDashboard, triggerXCard };
