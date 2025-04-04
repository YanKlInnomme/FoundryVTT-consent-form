// Enregistrement de la feuille de consentement
Hooks.once('init', () => {
  console.log("Consent Form | Initialization");

  // Enregistrer l'helper uppercase pour Handlebars
  if (!Handlebars.helpers['uppercase']) {
    Handlebars.registerHelper('uppercase', function(str) {
      return str.toUpperCase();
    });
  }

  // Enregistrer l'helper concat pour Handlebars
  if (!Handlebars.helpers['concat']) {
    Handlebars.registerHelper('concat', function(...args) {
      args.pop(); // Retire le dernier argument (contexte Handlebars)
      return args.join('');
    });
  }

  let actorTypes;

  if (game.system.id === "pf2e") {
    // Pathfinder 2e stocke les fiches différemment
    actorTypes = Object.keys(CONFIG.PF2E.Actor.documentClasses).filter(type => type !== "npc");
  } else {
    // Pour les autres systèmes
    actorTypes = Object.keys(CONFIG.Actor.dataModels).filter(type => type !== "npc");
  }

  // Enregistrement de la feuille pour les types d'acteurs définis
  Actors.registerSheet("consent", ConsentSheet, {
    types: actorTypes,
    makeDefault: false,
    label: "CONSENT.SHEET_NAME"
  });

}); 

class ConsentSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["consent-sheet"],
      template: "modules/consent-form/templates/consent.html",
      width: 700,
      height: 800,
      tabs: [{ 
        navSelector: ".sheet-tabs", 
        contentSelector: ".sheet-body", 
        initial: "fears" 
      }],
      scrollY: [".sheet-body"]
    });
  }

  getData() {
    const data = super.getData();
    data.consent = this.actor.getFlag("consent-form", "preferences") || this._getDefaultData();
    data.consentLevels = {
      default: `${game.i18n.localize("CONSENT.LEVEL_DEFAULT")}`,
      narrative: `🟢 ${game.i18n.localize("CONSENT.LEVEL_NARRATIVE")}`,
      discuss: `🟡 ${game.i18n.localize("CONSENT.LEVEL_DISCUSS")}`,
      forbidden: `🔴 ${game.i18n.localize("CONSENT.LEVEL_FORBIDDEN")}`
    };
    return data;
  }

  _getDefaultData() {
    return {
      fears: {
        acrophobia: "default",
        aerophobia: "default",
        agoraphobia: "default",
        arachnophobia: "default",
        belonephobia: "default",
        claustrophobia: "default",
        coulrophobia: "default",
        cynophobia: "default",
        entomophobia: "default",
        hematophobia: "default",
        herpetophobia: "default",
        lossOfControlPhobia: "default",
        necrophobia: "default",
        nyctophobia: "default",
        ophiophobia: "default",
        phasmophobia: "default",
        teratophobia: "default",
        thanatophobia: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      realWorld: {
        currentWars: "default",
        historicalWars: "default",
        currentGenocides: "default",
        historicalGenocides: "default",
        terroristAttacks: "default",
        industrialDisasters: "default",
        naturalDisasters: "default",
        pandemics: "default",
        migrationCrisis: "default",
        faminesAndPoverty: "default",
        politicalEvents: "default",
        parodiesAndSatires: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      punishment: {
        corporalPunishment: "default",
        physicalTorture: "default",
        executions: "default",
        exile: "default",
        publicHumiliation: "default",
        solitaryConfinement: "default",
        mentalManipulation: "default",
        psychologicalTorture: "default",
        incarceration: "default",
        forcedLabor: "default",
        restrictionOfFreedom: "default",
        religiousPunishments: "default",
        culturalPunishments: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      romance: {
        romanceImplicit: "default",
        romanceExplicit: "default",
        romanceBetweenPCs: "default",
        romanceBetweenNPCs: "default",
        romancePcNpc: "default",
        polyamory: "default",
        infidelity: "default",
        forbiddenRelationships: "default",
        toxicRelationships: "default",
        unrequitedLove: "default",
        forcedMarriage: "default",
        taboo1: { value: "", level: "default" },
        taboo2: { value: "", level: "default" },
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      sex: {
        sexImplicit: "default",
        sexExplicit: "default",
        sexBetweenPCs: "default",
        sexBetweenNPCs: "default",
        sexPcNpc: "default",
        softBDSM: "default",
        moderateBDSM: "default",
        extremeBDSM: "default",
        bdsm1: { value: "", level: "default" },
        bdsm2: { value: "", level: "default" },
        bdsm3: { value: "", level: "default" },
        sexWork: "default",
        sexualViolence: "default",
        sexualManipulation: "default",
        incest: "default",
        paedophilia: "default",
        zoophilia: "default",
        necrophilia: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      violence: {
        abandonment: "default",
        domesticViolence: "default",
        murdersAndAssassinations: "default",
        physicalAggression: "default",
        bullying: "default",
        mutilationsAndAmputations: "default",
        childAbuse: "default",
        AnimalAbuse: "default",
        realisticCombat: "default",
        verbalAbuse: "default",
        InstitutionalViolence: "default",
        religiousPersecution: "default",
        ethnicPersecution: "default",
        medicalExperimentation: "default",
        slavery: "default",
        demonicPossession: "default",
        ritualSacrifices: "default",
        cannibalism: "default",
        bodyTransformations: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      discrimination: {
        ableism: "default",
        afrophobia: "default",
        ageism: "default",
        antisemitism: "default",
        arophobia: "default",
        asexualphobia: "default",
        biphobia: "default",
        classism: "default",
        colorism: "default",
        fatphobia: "default",
        heteronormativity: "default",
        heterophobia: "default",
        homophobia: "default",
        islamophobia: "default",
        intersexphobia: "default",
        languageDiscrimination: "default",
        lesbophobia: "default",
        neurodivergenceDiscrimination: "default",
        nonBinaryphobia: "default",
        panphobia: "default",
        racism: "default",
        religiousDiscrimination: "default",
        romaphobia: "default",
        sexism: "default",
        systemicRacism: "default",
        sizeism: "default",
        thinphobia: "default",
        transphobia: "default",
        xenophobia: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      health: {
        cancer: "default",
        neurodegenerativeDiseases: "default",
        sidaVIH: "default",
        chronicDiseases: "default",
        illness1: { value: "", level: "default" },
        illness2: { value: "", level: "default" },
        depression: "default",
        suicide: "default",
        psychoses: "default",
        anxietyDisorders: "default",
        addiction1: { value: "", level: "default" },
        addiction2: { value: "", level: "default" },
        eatingDisorders: "default",
        selfHarm: "default",
        mentalIllness1: { value: "", level: "default" },
        mentalIllness2: { value: "", level: "default" },
        miscarriage: "default",
        infertility: "default",
        abortion: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }        
      },
      extremism: {
        totalitarianIdeologies: "default",
        authoritarianCommunism: "default",
        theocraticRegimes: "default",
        chauvinism: "default",
        indoctrination: "default",
        religiousFanaticism: "default",
        sectarianGroups: "default",
        proselytizing: "default",
        racialSupremacism: "default",
        eugenicIdeologies: "default",
        hateGroups: "default",
        complotism: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }        
      },
      notes: ""
    };
  }

  async _updateObject(event, formData) {
    const currentData = this.actor.getFlag("consent-form", "preferences") || this._getDefaultData();
    const updateData = foundry.utils.mergeObject(currentData, formData);
    await this.actor.setFlag("consent-form", "preferences", updateData);
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Gérer les changements de select
    html.find('select').on('change', async (event) => {
      event.preventDefault();
      const select = event.currentTarget;
      const [category, name, field] = select.name.split('.');
      
      const currentData = this.actor.getFlag("consent-form", "preferences") || this._getDefaultData();
      
      if (field === 'level') {
        // Pour les champs combinés (input + select)
        foundry.utils.setProperty(currentData, `${category}.${name}.level`, select.value);
      } else {
        // Pour les selects simples
        foundry.utils.setProperty(currentData, `${category}.${name}`, select.value);
      }
      
      await this.actor.setFlag("consent-form", "preferences", currentData);
    });

    // Gérer les changements d'input text
    html.find('input[type="text"]').on('change', async (event) => {
      event.preventDefault();
      const input = event.currentTarget;
      const [category, name, field] = input.name.split('.');
      
      const currentData = this.actor.getFlag("consent-form", "preferences") || this._getDefaultData();
      
      if (!currentData[category][name]) {
        currentData[category][name] = { value: "", level: "default" };
      }
      
      currentData[category][name].value = input.value;
      await this.actor.setFlag("consent-form", "preferences", currentData);
    });

    // Gérer les changements de textarea
    html.find('textarea[name="notes"]').on('change', async (event) => {
      event.preventDefault();
      const textarea = event.currentTarget;
      const currentData = this.actor.getFlag("consent-form", "preferences") || this._getDefaultData();
      currentData.notes = textarea.value;
      await this.actor.setFlag("consent-form", "preferences", currentData);
    });

    // Gérer les clics sur les boutons d'alerte
    html.find('.alert-button').on('click', async (event) => {
      event.preventDefault();
      const button = event.currentTarget;
      const category = button.dataset.category;
      const key = button.dataset.key;
      
      const currentData = this.actor.getFlag("consent-form", "preferences") || this._getDefaultData();
      let value = foundry.utils.getProperty(currentData, `${category}.${key}`);
      let theme = '';
      
      // Gérer les cas spéciaux avec input
      if (typeof value === 'object') {
        if (value.value) {
          theme = value.value;
        } else {
          // Si pas de valeur personnalisée, utiliser la clé de traduction standard
          theme = game.i18n.localize(`CONSENT.${category.toUpperCase()}_${key.toUpperCase()}`);
        }
        value = value.level;
      } else {
        // Pour les autres cas, utiliser la clé de traduction standard
        theme = game.i18n.localize(`CONSENT.${category.toUpperCase()}_${key.toUpperCase()}`);
      }

      // Ajouter l'emoji approprié au niveau de consentement
      let levelEmoji = '';
      switch (value) {
        case 'narrative':
          levelEmoji = '🟢 ';
          break;
        case 'discuss':
          levelEmoji = '🟡 ';
          break;
        case 'forbidden':
          levelEmoji = '🔴 ';
          break;
        default:
          levelEmoji = '';
      }
      
      const consentLevel = `${levelEmoji}${game.i18n.localize(`CONSENT.LEVEL_${value.toUpperCase()}`)}`;

      // Récupérer le nom du joueur et du personnage
      const playerName = game.user.name;
      const characterName = this.actor.name;

      // Message dans le chat
      const chatData = {
        content: game.i18n.format("CONSENT.ALERT_CHAT", {
          playerName: playerName,
          characterName: characterName,
          theme: theme,
          level: consentLevel
        }),
        whisper: [game.user.id, ...game.users.filter(u => u.isGM).map(u => u.id)]
      };
      
      ChatMessage.create(chatData);

      // Notification pour le MJ avec une durée de 15 secondes
      const notificationOptions = { permanent: false, localize: false, duration: 15000 };
      
      if (!game.user.isGM) {
        // Envoyer la notification aux MJs via socket
        game.socket.emit("module.consent-form", {
          type: "alertGM",
          data: {
            playerName: playerName,
            options: notificationOptions
          }
        });
      } else {
        // Si c'est le MJ qui clique, montrer directement la notification
        ui.notifications.info(game.i18n.format("CONSENT.ALERT_GM", {
          playerName: playerName
        }), notificationOptions);
      }
    });
  }
}

// Gestion des messages socket pour les notifications GM
Hooks.once('ready', () => {
  game.socket.on("module.consent-form", (data) => {
    if (game.user.isGM && data.type === "alertGM") {
      ui.notifications.info(game.i18n.format("CONSENT.ALERT_GM", {
        playerName: data.data.playerName
      }), data.data.options);
    }
  });
});

// Ajout de boutons de liens dans les paramètres
Hooks.on("renderSettings", (app, html) => {
  const links = {
    git: {
      title: "Module deposit",
      url: "https://github.com/YanKlInnomme/FoundryVTT-consent-form",
      iconClass: "fab fa-github"
    },
    donation: {
      title: "Buy me a coffee",
      url: "https://www.buymeacoffee.com/yank",
      iconClass: "fa-regular fa-mug-hot fa-bounce"
    }
  };

  const createButton = (text, iconClass, url) => {
    const button = $(`<button><i class="${iconClass}"></i> ${text}</button>`);
    button.on("click", ev => {
      ev.preventDefault();
      window.open(url, "_blank");
    });
    return button;
  };

  const addLinkButton = (container, link) => {
    const button = createButton(link.title, link.iconClass, link.url);
    container.append(button);
  };

  const title = "Consent Form · Links";
  const lotdSection = $(`<h2>${title} <i class="fa-light fa-up-right-from-square"></i></h2>`);
  html.find("#settings-game").after(lotdSection);

  const lotdDiv = $(`<div></div>`);
  lotdSection.after(lotdDiv);

  Object.values(links).forEach(link => {
    addLinkButton(lotdDiv, link);
  });
});
