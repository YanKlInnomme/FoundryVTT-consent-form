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
 - Création du module (sur une idée initialement intégrée dans le module `apocalypse-world`)

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

1. Une fois le module activé, allez dans l'onglet Acteurs de votre monde.
2. Créez un nouvel acteur ou dupliquez un acteur existant.
3. Ouvrez sa fiche, puis cliquez sur ⚙️ Sheet en haut à droite.
4. La configuration de la feuille s'affiche. Dans la liste déroulante, choisissez Consent Form.
5. La fiche de consentement apparaît alors.
5. Utilisez ensuite la Ownership Configuration pour attribuer la fiche de consentement au joueur correspondant.
6. Le joueur pourra alors remplir la fiche, indiquant ses préférences et ses limites.

### En cours de partie

Si un sujet sensible est abordé durant la partie, les joueurs peuvent utiliser les boutons d'alerte de la fiche pour envoyer un message privé au MJ, rappelant les points sensibles spécifiques.

### Support

Pour toute question ou problème, veuillez consulter la documentation du module ou ouvrir une issue sur le dépôt GitHub.
