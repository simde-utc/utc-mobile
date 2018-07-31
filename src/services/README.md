# Services

Les services fournissent des interfaces entre les différents API et des objets JS natifs.
Ces objets peuvent ensuite être utilisés dans les screens pour modifier l'état des grappes REACT.

## Api

permet d'utiliser simplement des APIs REST GET, POST, PUT, DELETE.

### Classes héritant d'Api

* Portail : se connecter à l'oauth du portail du SiMDE, et utiliser des services fournis par l'API du portail
* [CASAuth](CASAuth.README.md) : se connecter directement au CAS de l'UTC, et utiliser des services fournis par l'UTC

### Classes utilisant CASAuth

** ActualitesUTC : télécharge des articles sur le wordpress des actualités internes de l'UTC et les fournit dans un format identique à celui des actualités des assos.
