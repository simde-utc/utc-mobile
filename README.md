# Application UTC

## Table des matières

- [Application UTC](#Application-UTC)
	- [À propos](#%C3%80-propos)
	- [Utilisation](#Utilisation)
	- [Organisation des fichiers](#Organisation-des-fichiers)
	- [Développer](#D%C3%A9velopper)

## À propos

Ce répertoire contient le code source de l'application officielle [UTC](https://www.utc.fr). L'application permet aux extérieurs de découvrir l'actualité UTCéenne, mais aussi aux étudiants d'accéder à un certain nombre de services proposés par le [SiMDE](https://assos.utc.fr/simde) (Service informatique de la Maison des Étudiants), notamment au [Portail des Associations](https://assos.utc.fr).


## Utilisation

Il est nécessaire d'avoir NodeJS installé sur sa machine.
* Télécharger le répertoire (`git clone https://github.com/simde-utc/utc-mobile.git`)
* Installer les dépendances (`npm install`)
* Installer Expo CLI de manière globale (`npm install expo-cli --global`)
* Copier `config.example.js` et le coller au même emplacement en tant que `config.js`
* Lancer l'environnement de test :
	* `npm start` pour lancer le serveur [expo](https://expo.io/tools). Il est ainsi possible de tester directement sur votre smartphone en suivant ce [lien](https://facebook.github.io/react-native/docs/getting-started.html#running-your-react-native-application)
	* `npm run android` pour lancer sur un émulateur Android ou sur un appareil Android en debug USB
	* `npm run ios` pour lancer sur un émulateur iOS (uniquement sous Mac)

En cas de problème de connexion au serveur expo avec Windows, pensez à désactiver VirtualBox Network dans : Panneau de Configuration > Réseau et Internet > Centre Réseau et Partage > Modifier les paramètres de la carte (menu à gauche) > clic droit sur VirtualBox Network > Désactiver.

## Organisation des fichiers

[Convention, voir cet article.](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1)

## Développer

Voir le fichier [`CONTRIBUTING.md`](CONTRIBUTING.md)
