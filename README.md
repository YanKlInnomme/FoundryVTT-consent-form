<img width="1919" height="1006" alt="Capture d&#39;écran 2026-07-21 013215" src="https://github.com/user-attachments/assets/7f5d1368-1ccd-4f8a-8efa-16702f372eaf" />
![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FYanKlInnomme%2FFoundryVTT-consent-form%2Fmaster%2Fmodule.json&query=%24.compatibility.verified&label=foundry%20vtt&color=%23ee9b3a) ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FYanKlInnomme%2FFoundryVTT-consent-form%2Fmaster%2Fmodule.json&query=%24.version&label=version&color=%230f2f2b) ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/YanKlInnomme/FoundryVTT-consent-form/total) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-raw/YanKlInnomme/FoundryVTT-consent-form) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues-closed-raw/YanKlInnomme/FoundryVTT-consent-form) ![GitHub forks](https://img.shields.io/github/forks/YanKlInnomme/FoundryVTT-consent-form) ![GitHub Repo stars](https://img.shields.io/github/stars/YanKlInnomme/FoundryVTT-consent-form) <a href="https://www.buymeacoffee.com/yank">![Static Badge](https://img.shields.io/badge/buy_me_a_coffee-FFDD00?logo=Buy%20Me%20A%20Coffee&logoColor=black)</a>

<img width="1919" height="918" alt="Capture d&#39;écran 2026-07-21 012919" src="https://github.com/user-attachments/assets/9378e102-73ea-44ea-8993-43316b87e9f5" />
<img width="1908" height="947" alt="Capture d&#39;écran 2026-07-21 012753" src="https://github.com/user-attachments/assets/fa2a1178-2977-45e9-9759-42220e8984e5" />
<img width="1910" height="943" alt="Capture d&#39;écran 2026-07-21 012555" src="https://github.com/user-attachments/assets/1eaddac8-0630-46f6-b637-18ec81288bc0" />
<img width="1910" height="945" alt="Capture d&#39;écran 2026-07-21 012614" src="https://github.com/user-attachments/assets/490db0cf-9d3d-44f6-9d76-66e31b12e7f7" />
<img width="1919" height="1006" alt="Capture d&#39;écran 2026-07-21 013057" src="https://github.com/user-attachments/assets/3d3a2ab1-e7de-417d-8a0b-3975f779ed27" />
<img width="1919" height="1006" alt="Capture d&#39;écran 2026-07-21 013239" src="https://github.com/user-attachments/assets/81d52f3c-a4bc-4da6-a2e1-3f9719da1459" />
<img width="1919" height="1006" alt="Capture d&#39;écran 2026-07-21 013328" src="https://github.com/user-attachments/assets/c6327520-49e8-4334-b19f-93daeb994f88" />


**[See below for the English version](#module-consent-form-for-foundry-vtt)**

# Module consent-form pour Foundry VTT

Ce module permet d'intégrer des fiches de consentement simples et intuitives pour chaque joueur dans n'importe quel système Foundry VTT. Cette solution pratique aide à créer un environnement de jeu respectueux et sécurisé pour tous les participants.

Si vous appréciez le module et que vous avez les moyens de le faire, vous pouvez me soutenir en m'offrant un café sur Buy Me a Coffee (https://www.buymeacoffee.com/yank). Votre geste serait grandement apprécié et contribuerait à soutenir le développement continu. Quoi qu'il en soit, je vous souhaite une expérience enrichissante et divertissante. N'hésitez pas à me contacter pour partager vos commentaires ou signaler tout problème éventuel.

## Version 3.1.1

- Conservation de la position de défilement lors de l'ajout ou de la suppression d'un sujet personnalisé.
- Refonte de l'écran X-Carte avec une présentation plus calme, une précision facultative en plusieurs étapes et une pause maintenue pour toute la table.
- Ajout d'un contrôle MJ permettant de lancer une pause minutée ou sans durée définie.
- Ajout de thèmes clair et sombre distincts suivant automatiquement le thème choisi dans Foundry VTT.

## Version 3.0.1

- Correction d'une erreur de compatibilité (erreur dans le maximum du fichier module.json).

## Version 3.0.0

- Refonte complète pour Foundry VTT 14 avec les interfaces Application V2.
- Ajout d'une fiche personnelle enregistrée automatiquement pour chaque joueur.
- Ajout d'un tableau de bord MJ avec synthèse de la table et consultation individuelle des fiches.
- Ajout d'une X-Carte en temps réel, anonyme pour la table, avec précision facultative envoyée uniquement aux MJ.
- Ajout d'un mini-HUD X-Carte toujours visible, déplaçable et redimensionnable.
- Ajout de l'import et de l'export JSON des fiches.
- Stockage des fiches dans des entrées de journal privées protégées par les permissions Foundry.
- Stockage séparé des notes de travail réservées aux MJ.
- Migration automatique des anciennes fiches basées sur les Actors et des anciens flags User.
- Amélioration de l'accessibilité, de la navigation au clavier et de la compatibilité avec les thèmes clairs et sombres.

## Version 2.1.0

- Prise en compte de la spécificité du système "Pathfinder Second Edition" pour le choix de la fiche de consentement sur les fiches de Personnages Joueurs.

## Version 2.0.0

- Ajout d'entrées libres dans l'ensemble des catégories.
- Ajout de nouvelles entrées dans l'ensemble des catégories afin de couvrir un plus large spectre de thèmes.
- Ajout d'infobulles pour expliquer chaque thème évoqué.

## Version 1.0.0

- Création du module.

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
- **En groupe** : Le MJ consulte la synthèse de la table afin de préparer une expérience de jeu qui respecte les limites de chacun.
- **En cours de jeu** : Si un thème sensible apparaît, la fiche sert de référence et la X-Carte permet d'interrompre immédiatement la scène sans devoir se justifier.

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

### Utilisation par les joueurs

1. Une fois le module activé, ouvrez "Paramètres du jeu" > "Paramètres des modules".
2. Sélectionnez "Consent Form - Emotional Safety Tool".
3. Cliquez sur "Ouvrir ma fiche".
4. Choisissez un niveau pour les thèmes que vous souhaitez renseigner. Il n'est pas nécessaire de répondre à toutes les propositions.
5. Les modifications sont enregistrées automatiquement.
6. Utilisez les boutons "Exporter" et "Importer" pour transférer votre fiche vers un autre monde ou une autre table.

Chaque joueur dispose également d'un mini-HUD X-Carte toujours visible. Sa position et ses dimensions sont mémorisées localement dans le navigateur.

### Utilisation par le MJ

1. Ouvrez "Paramètres du jeu" > "Paramètres des modules".
2. Sélectionnez "Consent Form - Emotional Safety Tool".
3. Cliquez sur "Ouvrir le tableau de bord MJ".
4. Consultez la synthèse des limites absolues et des sujets à discuter.
5. Sélectionnez un joueur pour consulter ses réponses, ses notes et ajouter une note de travail réservée aux MJ.

### En cours de partie

Lorsqu'une scène doit être interrompue, un joueur peut déclencher la X-Carte depuis son mini-HUD ou sa fiche. Une X-Carte anonyme apparaît immédiatement chez toutes les personnes connectées. Le joueur peut ensuite, sans limite de temps, préciser facultativement une catégorie et un sujet. Seuls les MJ reçoivent son identité et ce détail dans un message privé.

Une temporisation de 30 secondes par joueur empêche les déclenchements répétés abusifs sans bloquer la X-Carte des autres participants.

### Données et confidentialité

Chaque fiche est enregistrée dans une entrée de journal technique dédiée dont les permissions Foundry autorisent uniquement le joueur concerné et les MJ du monde. Les notes de travail des MJ sont conservées séparément dans une entrée réservée aux MJ. Ces entrées techniques sont masquées dans le répertoire des journaux et protégées contre la suppression accidentelle.

Ces informations restent enregistrées dans la base de données du monde et ne sont pas chiffrées. Il est recommandé de ne pas y consigner de secrets ou d'informations médicales qui ne devraient pas être stockés dans Foundry.

### Support

Pour toute question ou problème, veuillez consulter la documentation du module ou ouvrir une issue sur le dépôt GitHub.

---------------------------------------------------------------------

# Module consent-form for Foundry VTT

This module allows you to integrate simple and intuitive consent forms for each player in any Foundry VTT system. This convenient solution helps create a respectful and safe gaming environment for all participants.

If you like the module and have the means to do so, you can support me by offering me a coffee on Buy Me a Coffee (https://www.buymeacoffee.com/yank). Your support would be greatly appreciated and will aid ongoing development. In any case, I hope you have a rewarding and enjoyable experience. Please feel free to contact me with any comments or issues.

## Version 3.1.1

- Preserved the scroll position when adding or removing a custom topic.
- Redesigned the X-Card screen with a calmer presentation, optional progressive detail selection, and a pause maintained for the entire table.
- Added a GM control for starting a timed or untimed table break.
- Added distinct light and dark themes that automatically follow the theme selected in Foundry VTT.

## Version 3.0.1
- Fixed a compatibility error (error in the maximum of the module.json file).

## Version 3.0.0

- Complete Foundry VTT 14 redesign using Application V2 interfaces.
- Added an automatically saved personal consent form for every player.
- Added a GM dashboard with a table summary and individual form review.
- Added a real-time X-Card, anonymous to the table, with optional details sent only to GMs.
- Added an always-visible, movable and resizable X-Card mini HUD.
- Added JSON import and export for player forms.
- Forms are stored in private Journal Entries protected by Foundry permissions.
- GM working notes use separate GM-only storage.
- Automatic migration of former Actor-based forms and previous User flags.
- Improved accessibility, keyboard navigation, and compatibility with light and dark themes.

## Version 2.1.0

- Added support for the "Pathfinder Second Edition" system to choose the consent form on Player Character sheets.

## Version 2.0.0

- Added free entries in all categories.
- Added new entries in all categories to cover a wider range of themes.
- Added tooltips to explain each theme mentioned.

## Version 1.0.0

- Module creation.

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

- Extreme violence (torture, mutilation)
- Explicit sexual relationships
- Mental or physical illness
- Discrimination (racism, sexism, homophobia)
- Specific fears (phobias like spiders or confined spaces)

### Practical use

- **Before the game**: Each player fills out the form, indicating their preferences and limits.
- **As a group**: The GM reviews the table summary to prepare a gaming experience that respects everyone's limits.
- **During the game**: If a sensitive theme arises, the form serves as a reference and the X-Card can stop the scene immediately without requiring an explanation.

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

### Player use

1. Once the module is active, open "Game Settings" > "Module Settings".
2. Select "Consent Form - Emotional Safety Tool".
3. Click "Open my form".
4. Choose a level for the topics you wish to answer. You do not need to answer every topic.
5. Changes are saved automatically.
6. Use the "Export" and "Import" buttons to transfer your form to another world or table.

Every player also receives an always-visible X-Card mini HUD. Its position and dimensions are stored locally in the browser.

### GM use

1. Open "Game Settings" > "Module Settings".
2. Select "Consent Form - Emotional Safety Tool".
3. Click "Open the GM dashboard".
4. Review the summary of hard limits and topics requiring discussion.
5. Select a player to review their answers and notes, or add a GM-only working note.

### During the game

When a scene must stop, a player can trigger the X-Card from the mini HUD or their form. An anonymous X-Card immediately appears for every connected participant. The player may then, without a time limit, optionally specify a category and topic. Only the GMs receive the player's identity and these details in a private message.

A 30-second per-player cooldown prevents repeated abusive triggers without blocking another participant's X-Card.

### Data and privacy

Each form is stored in a dedicated technical Journal Entry whose Foundry permissions grant access only to that player and the world's GMs. GM working notes are stored separately in a GM-only entry. These technical entries are hidden from the Journal directory and protected against accidental deletion.

This information remains stored in the world database and is not encrypted. Avoid recording secrets or medical information that should not be stored in Foundry.

### Support

For any questions or issues, please refer to the module documentation or open an issue on the GitHub repository.
