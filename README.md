# Application UTC

## Table des matières

* [À propos](#à-propos)
* [Utilisation](#utilisation)
* [Organisation des fichiers](#organisation-des-fichiers)

## À propos

Ce repo contient le code source de l'application officielle [UTC](https://www.utc.fr). L'appicaltion permet également aux étudiants d'accéder à un certain nombre de services proposés par le [SiMDE](https://assos.utc.fr/simde) (Service informatique de la Maison des Étudiants), nottament au [portail des associations](https://assos.utc.fr).

## Utilisation

Il est nécessaire d'avoir node installé sur sa machine.
* Télécharger le repo (`git clone https://github.com/simde-utc/portail-mobile`) ;
* Installer les dépendances (`npm install`) ;
* Lancer l'environement de test :
	* `npm start` pour lancer le serveur [expo](https://expo.io/tools) ;
	* `npm run android` pour lancer sur un émulateur android ou sur un appareil android en debug USB ;
	* `npm run ios` pour lancer sur un émulateur ios (uniquement sous mac)

## Organisation des fichiers
Toutes les features qu'on code doivent être dans un de ces dossiers:
* `/components`
* `/scenes`
* `/services`

Chaque composant, scène ou service (en gros, une feature), doit avoir son propre dossier qui contient tout ce dont elle a besoin pour fonctionner (ses styles, images, strings traduits, événements, tests unitaires etc.). Ils doivent constituer des bouts de code indépendants qui seront utilisés dans l'application.
Voici des règles qui définissent quelle entité doit être créée pour quels besoins:
* Un `component` peut définir des `components` ou `services` **imbriqués** (*nested*). Il ne peut pas utiliser ou définir des `scenes`.
* Une `scene` peut définir des `components`, des `scenes` ou des `services` **imbriqués**.
* Un `service` peut définir des `services` **imbriqués**. Il ne peut pas utiliser ou définir des `components` ou des `scenes`.
* Les fonctionnalités **imbriquées** ne peuvent être utilisées **que par leurs parents** (père, grand-père, arrière-grand-père etc.).

En revanche, une feature non imbriquée peut être utilisée de n'importe où.

[Pour plus d'informations sur cette convention, voir cet article.](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1)

