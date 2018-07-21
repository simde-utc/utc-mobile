# Application UTC

## Table des matières

* [À propos](#à-propos)
* [Utilisation](#utilisation)
* [Organisation des fichiers](#organisation-des-fichiers)

## À propos

Ce repo contient le code source de l'application officielle [UTC](https://www.utc.fr). L'applicaltion permet aux extérieurs de découvrir l'actualité UTCéenne, mais aussi aux étudiants d'accéder à un certain nombre de services proposés par le [SiMDE](https://assos.utc.fr/simde) (Service informatique de la Maison des Étudiants), notamment au [Portail des Associations](https://assos.utc.fr).


## Utilisation

Il est nécessaire d'avoir NodeJS installé sur sa machine.
* Télécharger le repo (`git clone https://github.com/simde-utc/portail-mobile`)
* Installer les dépendances (`npm install`)
* Lancer l'environement de test :
	* `npm start` pour lancer le serveur [expo](https://expo.io/tools)
	* `npm run android` pour lancer sur un émulateur android ou sur un appareil android en debug USB
	* `npm run ios` pour lancer sur un émulateur ios (uniquement sous mac)


En cas de problème de connexion au serveur expo avec Windows, pensez à désactiver VirtualBox Network dans : Panneau de Configuration > Réseau et Internet > Centre Réseau et Partage > Modifier les paramètres de la carte (menu à gauche) > clic droit sur VirtualBox Network > Désactiver.


## Organisation des fichiers

[Convention, voir cet article.](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1)

