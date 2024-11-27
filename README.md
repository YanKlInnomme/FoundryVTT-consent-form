![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FYanKlInnomme%2FFoundryVTT-consent-form%2Fmaster%2Fmodule.json&query=%24.compatibility.verified&label=foundry%20vtt&color=%23ee9b3a) ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FYanKlInnomme%2FFoundryVTT-consent-form%2Fmaster%2Fmodule.json&query=%24.version&label=version&color=%230f2f2b) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/YanKlInnomme/FoundryVTT-consent-form/total) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-raw/YanKlInnomme/FoundryVTT-consent-form) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed-raw/YanKlInnomme/FoundryVTT-consent-form) ![GitHub forks](https://img.shields.io/github/forks/YanKlInnomme/FoundryVTT-consent-form) ![GitHub Repo stars](https://img.shields.io/github/stars/YanKlInnomme/FoundryVTT-consent-form) <a href="https://www.buymeacoffee.com/yank">![Static Badge](https://img.shields.io/badge/buy_me_a_coffee-FFDD00?logo=Buy%20Me%20A%20Coffee&logoColor=black)</a>

**See below for the English version**

# Module consent-form pour Foundry VTT

Le Module consent-form permet d'intégrer des fiches de consentement simples et intuitives pour chaque joueur dans n'importe quel système Foundry VTT. Cette solution pratique aide à créer un environnement de jeu respectueux et sécurisé pour tous les participants.

![Capture d'écran 2024-11-27 111258](https://github.com/user-attachments/assets/5ccda1a4-ba3f-45a1-a730-1d805c20b327)
![Capture d'écran 2024-11-27 111622](https://github.com/user-attachments/assets/129b9d81-c726-4fc4-8cde-a8734fb95643)
![Capture d'écran 2024-11-27 112115](https://github.com/user-attachments/assets/a7d440c1-5089-4dc4-ae18-bbb78bd46f7c)
![Capture d'écran 2024-11-27 135218](https://github.com/user-attachments/assets/dad518bc-c3f5-4a05-8ba3-94389eec5219)

Si vous appréciez le module et que vous avez les moyens de le faire, vous pouvez me soutenir en m'offrant un café sur Buy Me a Coffee (https://www.buymeacoffee.com/yank). Votre geste serait grandement apprécié et contribuerait à soutenir le développement continu. Quoi qu'il en soit, je vous souhaite une expérience enrichissante et divertissante. N'hésitez pas à me contacter pour partager vos commentaires ou signaler tout problème éventuel.

## Version 1.0.0
 - Création du module

## Qu'est-ce qu'une fiche de consentement ?

Une fiche de consentement est un outil utilisé pour assurer une expérience de jeu respectueuse et sécurisée pour tous les participants. Elle permet aux joueuses, aux joueurs et au MJ de définir ensemble les thèmes qui sont acceptables, ceux qui nécessitent une discussion préalable et ceux qui sont strictement interdits.

### Objectifs principaux

- **Prévenir le malaise ou les traumatismes** : Certains thèmes peuvent rappeler des expériences personnelles douloureuses ou déclencher des émotions négatives.
- **Favoriser une communication ouverte** : La fiche encourage une discussion préalable pour définir les attentes de chacun.
- **Créer un cadre de jeu inclusif et respectueux** : Tous les participants ont leur mot à dire sur ce qui sera abordé ou non.

### Contenu typique d'une fiche de consentement

- *Thèmes sensibles ou tabous* : Par exemple, la violence, les abus, la discrimination, la santé mentale, la sexualité.

- **Niveaux de tolérance** : Chaque thème peut être classé selon un système à trois niveaux :
    - 🟢 **Narration libre** : Le thème peut être abordé sans restriction.
    - 🟡 **Sous réserve de discussion** : Le thème peut être abordé, mais seulement après une discussion pour clarifier les limites.
    - 🔴 **Thème interdit** : Le thème est totalement exclu du jeu.

### Exemples de thèmes courants

- Violence extrême (torture, mutilation)
- Relations sexuelles explicites
- Maladie mentale ou physique
- Discrimination (racisme, sexisme, homophobie)
- Peurs spécifiques (phobies comme les araignées ou les espaces confinés)

### Utilisation pratique

- **Avant la partie** : Chaque joueur remplit la fiche, indiquant ses préférences et ses limites.
- **En groupe** : Le MJ compile ces informations pour créer une expérience de jeu qui respecte les limites de chacun.
- **En cours de jeu** : Si un thème sensible apparaît, la fiche sert de référence pour savoir comment le traiter.

### Avantages

- Renforce la confiance entre joueurs.
- Évite les situations inconfortables ou potentiellement traumatisantes.
- Encourage des parties plus immersives et agréables pour toutes et tous.

**C’est un outil particulièrement utile pour les jeux aux thèmes sombres ou réalistes, comme Kult: Divinité Perdue ou les scénarios d’horreur, mais il peut s’appliquer à n’importe quel type de jeu.**

## Comment utiliser le module

### Installation

1. Téléchargez le module depuis la page des modules de Foundry VTT ou depuis le dépôt GitHub.
2. Dans Foundry VTT, allez dans l'onglet "Modules" et cliquez sur "Installer le module".
3. Recherchez "consent-form" et cliquez sur "Installer".

### Activation

1. Ouvrez votre monde dans Foundry VTT.
2. Allez dans "Paramètres du jeu" > "Gérer les modules".
3. Cochez la case à côté de "consent-form" et cliquez sur "Enregistrer les modifications".

### Utilisation

1. Une fois le module activé, allez dans l'onglet "Acteurs" de votre monde.
2. Créez un nouvel acteur ou dupliquez un acteur existant.
3. Ouvrez sa fiche, puis cliquez sur ⚙️ Feuille en haut à droite.
4. La configuration de la feuille s'affiche. Dans la liste déroulante "Cette Fiche", choisissez "Fiche de Consentement", sauvegardez.
5. La fiche de consentement apparaît alors.
5. Utilisez ensuite l'option "Configurer les droits" pour attribuer la fiche de consentement au joueur correspondant.
6. Le joueur pourra alors remplir la fiche, indiquant ses préférences et ses limites.

### En cours de partie

Si un sujet sensible est abordé durant la partie, les joueurs peuvent utiliser les boutons d'alerte de la fiche pour envoyer un message privé au MJ, rappelant les points sensibles spécifiques.

### Support

Pour toute question ou problème, veuillez consulter la documentation du module ou ouvrir une issue sur le dépôt GitHub.

---------------------------------------------------------------------

# Module consent-form for Foundry VTT

The consent-form Module allows you to integrate simple and intuitive consent forms for each player in any Foundry VTT system. This convenient solution helps create a respectful and safe gaming environment for all participants.

If you like the module and have the means to do so, you can support me by offering me a coffee on Buy Me a Coffee (https://www.buymeacoffee.com/yank). Your support would be greatly appreciated and will aid ongoing development. This will enable me to prepare additional ready-to-play scenarios for you. In any case, I hope you have a rewarding and enjoyable experience. Please feel free to contact me with any comments or issues.

## Version 1.0.0
 - Module creation

## What is a consent form?

A consent form is a tool used to ensure a respectful and safe gaming experience for all participants. It allows players and the GM to define together which themes are acceptable, which require prior discussion, and which are strictly forbidden.

### Main objectives

- **Prevent discomfort or trauma**: Some themes may recall painful personal experiences or trigger negative emotions.
- **Foster open communication**: The form encourages a prior discussion to define everyone's expectations.
- **Create an inclusive and respectful gaming framework**: All participants have a say in what will be addressed or not.

### Typical content of a consent form

- *Sensitive or taboo themes*: For example, violence, abuse, discrimination, mental health, sexuality.

- **Tolerance levels**: Each theme can be classified according to a three-level system:
    - 🟢 **Free narration**: The theme can be addressed without restriction.
    - 🟡 **Subject to discussion**: The theme can be addressed, but only after a discussion to clarify the limits.
    - 🔴 **Forbidden theme**: The theme is totally excluded from the game.

### Examples of common themes

- Extreme violence (torture, mutil)
- Explicit sexual relationships
- Mental or physical illness
- Discrimination (racism, sexism, homophobia)
- Specific fears (phobias like spiders or confined spaces)

### Practical use

- **Before the game**: Each player fills out the form, indicating their preferences and limits.
- **As a group**: The GM compiles this information to create a gaming experience that respects everyone's limits.
- **During the game**: If a sensitive theme arises, the form serves as a reference for how to handle it.

### Advantages

- Builds trust between players.
- Avoids uncomfortable or potentially traumatic situations.
- Encourages more immersive and enjoyable games for everyone.

**This is a particularly useful tool for games with dark or realistic themes, such as Kult: Divinity Lost or horror scenarios, but it can apply to any type of game.**

## How to use the module

### Installation

1. Download the module from the Foundry VTT modules page or from the GitHub repository.
2. In Foundry VTT, go to the "Modules" tab and click on "Install Module".
3. Search for "consent-form" and click on "Install".

### Activation

1. Open your world in Foundry VTT.
2. Go to "Game Settings" > "Manage Modules".
3. Check the box next to "consent-form" and click "Save Changes".

### Use

1. Once the module is activated, go to the "Actors" tab of your world.
2. Create a new actor or duplicate an existing actor.
3. Open its sheet, then click on ⚙️ Sheet in the top right.
4. The sheet configuration appears. In the "This Sheet" dropdown list, choose "Consent Form".
5. The consent form then appears.
5. Then use the Ownership Configuration to assign the consent form to the corresponding player.
6. The player can then fill out the form, indicating their preferences and limits.

### During the game

If a sensitive subject is addressed during the game, players can use the form's alert buttons to send a private message to the GM, reminding them of specific sensitive points.

### Support

For any questions or issues, please refer to the module documentation or open an issue on the GitHub repository.