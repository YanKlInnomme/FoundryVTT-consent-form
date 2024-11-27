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

  // Enregistrer la feuille personnalisée pour tous les types d'acteurs sauf npc
  Actors.registerSheet("consent", ConsentSheet, {
    types: Object.keys(CONFIG.Actor.dataModels).filter(type => type !== "npc"),
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
        arachnophobia: "default",
        belonephobia: "default",
        claustrophobia: "default",
        coulrophobia: "default",
        entomophobia: "default",
        herpetophobia: "default",
        bodyHorror: "default",
        nyctophobia: "default",
        lossOfControl: "default",
        gore: "default",
        thanatophobia: "default",
        other1: { value: "", level: "default" },
        other2: { value: "", level: "default" },
        other3: { value: "", level: "default" }
      },
      realWorld: {
        contemporary: "default",
        historical: "default",
        parody: "default"
      },
      punishment: {
        corporal: "default",
        execution: "default",
        humiliation: "default",
        screaming: "default",
        incarceration: "default",
        isolation: "default",
        psychological: "default",
        forcedLabor: "default"
      },
      romance: {
        implicit: "default",
        explicit: "default",
        betweenPCs: "default",
        betweenNPCs: "default",
        pcNpc: "default",
        taboo1: { value: "", level: "default" },
        taboo2: { value: "", level: "default" },
        polyamory: "default"
      },
      sex: {
        implicit: "default",
        explicit: "default",
        betweenPCs: "default",
        betweenNPCs: "default",
        pcNpc: "default",
        bdsm1: { value: "", level: "default" },
        bdsm2: { value: "", level: "default" },
        bdsm3: { value: "", level: "default" }
      },
      violence: {
        childAbuse: "default",
        policeViolence: "default",
        harassment: "default",
        sexualHarassment: "default",
        incest: "default",
        torture: "default",
        rape: "default",
        domesticViolence: "default",
        animalViolence: "default",
        childViolence: "default",
        sexualViolence: "default"
      },
      discrimination: {
        racism: "default",
        nonBinary: "default",
        sexism: "default",
        ableism: "default",
        homophobia: "default",
        transphobia: "default"
      },
      health: {
        selfHarm: "default",
        abortion: "default",
        addiction1: { value: "", level: "default" },
        addiction2: { value: "", level: "default" },
        illness1: { value: "", level: "default" },
        illness2: { value: "", level: "default" },
        mentalIllness1: { value: "", level: "default" },
        mentalIllness2: { value: "", level: "default" }
      },
      extremism: {
        abandonment: "default",
        bestiality: "default",
        cannibalism: "default",
        sexualDeviance: "default",
        slavery: "default",
        politicalExtremism: "default",
        religiousExtremism: "default",
        murder: "default",
        suicide: "default"
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