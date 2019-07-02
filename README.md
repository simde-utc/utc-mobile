# Application UTC

## Table des matières
- [Application UTC](#Application-UTC)
	- [Table des matières](#Table-des-mati%C3%A8res)
	- [À propos](#%C3%80-propos)
	- [Utilisation](#Utilisation)
	- [Organisation des fichiers](#Organisation-des-fichiers)
	- [Développer](#D%C3%A9velopper)
## À propos

Ce repo contient le code source de l'application officielle [UTC](https://www.utc.fr). L'applicaltion permet aux extérieurs de découvrir l'actualité UTCéenne, mais aussi aux étudiants d'accéder à un certain nombre de services proposés par le [SiMDE](https://assos.utc.fr/simde) (Service informatique de la Maison des Étudiants), notamment au [Portail des Associations](https://assos.utc.fr).


## Utilisation

Il est nécessaire d'avoir NodeJS installé sur sa machine.
* Télécharger le repo (`git clone https://github.com/simde-utc/utc-mobile.git`)
* Installer les dépendances (`npm install`)
* Lancer l'environement de test :
	* `npm start` pour lancer le serveur [expo](https://expo.io/tools)
	* `npm run android` pour lancer sur un émulateur android ou sur un appareil android en debug USB
	* `npm run ios` pour lancer sur un émulateur ios (uniquement sous mac)


En cas de problème de connexion au serveur expo avec Windows, pensez à désactiver VirtualBox Network dans : Panneau de Configuration > Réseau et Internet > Centre Réseau et Partage > Modifier les paramètres de la carte (menu à gauche) > clic droit sur VirtualBox Network > Désactiver.


## Organisation des fichiers

[Convention, voir cet article.](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1)

## Développer

- Nous utilisons le workflow Gitflow, présenté dans cet (article)[https://nvie.com/files/Git-branching-model.pdf]. Il y a cependant une exception: nous n'utilisons pas la branche `release`. Cela implique que toutes les PR sont merge dans la branche `develop`. Une fois ce code testé, il est mis en production par version sur `master`.
- Nom des branches:
  * `feature/<issue shortname>` pour les dévelopments classiques.
  * `fix/<issue shortname>` pour les fix de bug.
  * `hot/<issue shortname>` pour les fix urgents.
- Commenter en français
- Si besoin installer `eslint` via npm (`npm i -g eslint`)
- Respecter le linter ESlint (c.f. `.eslint.json`) et vérifier en lançant `eslint .` depuis la racine du projet. 
- Amusez vous!