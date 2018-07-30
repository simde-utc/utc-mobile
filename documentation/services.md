# Services


## Storage

Pour sauvegarder des données même après fermeture de l'appli, deux types de stores sont disponibles, l'un est crypté et l'autre non.
Une interface a été créée pour simplifier


### Utilisation

Tout d'abord, importez le service
```
import Storage from "./path-to/src/service/Storage";
```
puis, dans une fonction asynchrone :
```
myFunc = async () => {
    let key = "test_sauvegarde"
    await Storage.setItem(key, value);
    Storage.getItem(key)
        .then(valueRead => console.log(valueRead));
        .catch(error => console.warn("Error fetching data", error))
}
```
Pour plus d'informations sur les fonctions asynchrones, [voir ici.](https://medium.com/@_bengarrison/javascript-es8-introducing-async-await-functions-7a471ec7de8a)


### Méthodes

Pour chaque type de sauvegarde il existe 3 fonctions élémentaires.
Toutes renvoient des Promises.
- **get...** : récupérer une donnée dans le store
- **set...** : enregistrer une donnée dans le store
- **remove...** : supprimer une donnée dans le store

Les arguments sont
- **key** : une chaîne de charactères alphanumériques avec potentiellement les charactères `.-_`
- **value** : un objet, entier ou string

#### Sauvegarde simple

Ici, les informations ne sont pas cryptées, il ne faut donc pas y stocker de données sensibles.

- **getItem(key)**
- **setItem(key, value)**
- **removeItem(key)**

#### Sauvegarde sécurisée

Les informations y sont [cryptées](https://docs.expo.io/versions/v28.0.0/sdk/securestore).

- **getSensitiveData(key)**
- **setSensitiveData(key, value)**
- **removeSensitiveData(key)**
