# Services

Les services fournissent des interfaces entre les différents API et des objets JS natifs.

Ces objets peuvent ensuite être utilisés dans les screens pour modifier l'état des grappes REACT.

* [Storage](Storage.md)
* [Api](Api.md) permet d'utiliser simplement des APIs REST GET, POST, PUT, DELETE.
* [Portail](Portail.md) se connecter à l'oauth du portail du SiMDE, et fournit un singleton pour utiliser des services de l'API du portail. Hérite de 
*Api*.
* [CASAuth](CASAuth.md) se connecter directement au CAS de l'UTC, et fournit des Service Tickets pour utiliser des services protégés par le CAS de l'UTC. Hérite de *Api*.

## Services utilisant CASAuth

* [ActualitesUTC](ActualitesUTC.md) télécharger des articles de l'actualité interne de l'UTC. Hérite de *Api*. *NE DOIT PAS ETRE UTILISEE DIRECTEMENT*.
