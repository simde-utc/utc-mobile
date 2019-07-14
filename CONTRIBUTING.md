# Développer

- Nous utilisons le workflow Gitflow, présenté dans cet [article](https://nvie.com/files/Git-branching-model.pdf). Il y a cependant une exception : nous n'utilisons pas la branche `release`. Cela implique que toutes les PRs sont mergées dans la branche `develop`. Une fois ce code testé, il est mis en production par version sur `master`.
- Nom des branches:
  * `feature/<issue shortname>` pour les développements classiques.
  * `fix/<issue shortname>` pour les fix de bugs.
  * `hot/<issue shortname>` pour les fix urgents.
- Commenter en français
- Si besoin installer `eslint` via npm de manière globale (`npm i -g eslint`)
- Respecter le linter ESlint (c.f. `.eslintrc.json`) et vérifier en lançant `eslint .` depuis la racine du projet.
  - Il ne devrait pas y avoir d'erreurs
	- si jamais `config.js` pose problème, l'ajout de `/* eslint-disable prettier/prettier */` (exceptionnellement) au début de ce fichier permet de les ignorer. C'est acceptable car `config.js` est dans le `.gitignore`
- Si vous êtes une personne extérieure à l'association [SiMDE](https://assos.utc.fr/simde), pour contribuer il faut faire un fork du projet, puis créer une PR de votre fork vers le projet principal, comme expliqué [ici](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork)
- Amusez-vous !
