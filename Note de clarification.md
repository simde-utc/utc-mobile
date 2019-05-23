# Objectif

L'application UTC/BDE-UTC a pour but de centraliser dans une nouvelle application, toutes les fonctionnalités importantes en facilitant leurs accès.

Cette application, serait capable d'envoyer des notifications Push pour signaler la publication, la modification et même la suppression d'une ressource intéressant l'utilisateur.

# Publication

Pour qu'elle puisse être acceptée et utilisée de tous, il est nécessaire que l'application soit disponible sur les deux stores d'applications mobiles: le Play Store (pour Android) et l'Apple Store (pour iOS).

Le public visé doit être le public le plus large possible: que ce soit des membres UTC ou de personnes simplement intéressées par l'UTC et/ou sa vie associative.

# Contraintes

Comme l'application doit mêler le contenu "administratif" de l'UTC et le contenu associatif de l'UTC, il est important de pouvoir distinguer les deux au sein de l'application et de même pouvoir choisir de n'afficher qu'une partie.

En étant membre de l'UTC, certaines fonctionnalités et certains accès doivent être donnés. Des scopes de visilibilité sont donc requis.

La TX a pour but de continuer un projet monté il y a maintenant 1 an. Il est donc important de respecter toutes les contraintes et de suivre la maquette qui a été réalisée initialement.

2 étudiants sont aussi en job étu et participeront au développement de cette application et des fonctionnalités développées ci-dessous.

# Fonctionnalités

Pas mal de fonctionnalités ont déjà été développées mais un grand nombre d'entre elles manquent de finission ou nécessite d'être refaites.

Voici la liste des fonctionnalités à développer ou à paufiner dans le cadre de la TX:
1. Corriger la page d'introduction:
    - nouveau logo UTC
    - affichage non conforme à la maquette
    - reformulation des différents textes
    - ajout des CGU
    - intégrer la police de caractères
- Refaire fonctionner la connexion en tant qu'extérieur:
    - du côté du Portail des associations
    - revoir la gestion au sein de toute l'application
- Développer une fonctionnalité permettant de donner des accès à certaines fonctionnalités ou non en fonction du type du public
- L'application est totalement en français:
    - intégrer l'i18n
    - repérer les ressources pouvant être affichés en langue étrangère (articles UTC ?)
- Améliorer la stack de données (voir avec redux peut-être ?)
- Revoir aussi la bar de navigation et le menu qui se rapproche de la CG (charte graphique) mais qui manque de finitions
- Réaliser la page d'accueil "Home":
    - afficher les tops articles:
        - réaliser une route du côté du Portail renvoyant les meilleurs articles
        - afficher avec un slider ces articles
    - gérer les blocs raccourcis:
        - les afficher sur le menu d'accueil
        - les agencer par défaut en fonction du type de public
        - créer une API pour générer dynamiquement des raccourcis (par exemple raccourcis assos)
        - réfléchir à leurs fonctionnalités, dispositions, tailles
- Améliorer la page d'articles:
    - optimiser son chargement
    - revoir le système de récupération des articles des côtés de l'UTC et du Portail
    - améliorer la gestion des tags, la recherche par tag
    - améliorer le clic sur un article
    - paufiner les détails, l'affichage des articles pour suivre la charte graphique
    - afficher les actions et gérer leurs actions:
        - like
        - commentaire (uniquement UTC/CAS)
        - partager
        - événement lié
    - revoir l'affichage simple et long des articles
    - corriger la vue d'un article
    - gérer les flux prédéfinis (flux assos suivies, flux événement, etc...)
    - gérer la recherche dynamique (et avancée):
        - par tag
        - par asso
        - par titre
- Améliorer la page calendrier:
    - afficher les événements des calendriers sélectionnés
    - rechercher:
        - par calendrier
        - par association
        - etc.
    - commencer la semaine avec le lundi
    - afficher les calendriers suivis
    - créer une API pour pouvoir afficher facilement le calendrier d'une association par exemple
    - beaucoup de paufinement nécessaire
- Réaliser la page de notification
    - afficher les notifications reçues:
        - par le Portail
        - par l'UTC
    - récupérer le certificat et voir avec la DSI l'accès aux notifications Push
- Améliorer l'affichage des associations:
    - supprimer l'en-tête inutile
    - ne pas afficher, ou cacher les associations mortes
    - afficher et gérer les moyens de contacts sur les pages association
    - afficher le flux d'articles de l'association comme pour la page articles
    - afficher les événements de l'association
    - améliorer l'affichage du trombinoscope:
        - uniformiser le texte
        - afficher une icône lorsqu'il n'y a pas d'image
- Réaliser le FAQ:
    - intégration au sein du Portail ?
    - nouveau service ?
    - afficher dans l'application
    - permettre de poser des questions ou de proposer du contenu
    - créer une section de recherche
- Réaliser la page de configuration:
    - modifier les préférences:
        - choix d'affichage
        - autres ?
    - modifier ses données personnelles (à voir)
- Afficher les accès manquants dans le menu et réaliser les pages suivantes:
    - Cartes UTC
    - Restauration:
        - menus Crous
        - menus Picasso
        - autre ?
    - WebTV (simple webview suffit)
    - Magasine Intéraction (webview)
    - Profil UTC (mon dossier étu)
    - UVs
- Afficher le titre de la page en haut, sur un fond grisaillé
- Afficher les moyens de contacts:
    - réseaux sociaux
    - urls
    - contacts rapides et centraux
- Revoir le stack de navigation. Les différentes pages sont parfois mal orchestrées

Problèmes critiques:
- Application au rendu horrible sur iOS
- Compiler l'application:
    - Android
    - iOS
