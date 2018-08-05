# CASAuth

[Spécification du protocole CAS](https://apereo.github.io/cas/5.1.x/protocol/CAS-Protocol-Specification.html)

## Résumé du protocole

* Le client se connecte au CAS en envoyant son username/password, et reçoit un Ticket Granting Ticket (*TGT*), qui est valable pour la durée de la session.
* Le client envoie au CAS son *TGT* et l'URL d'un *service* (e.g. _https://actualites.utc.fr/feed_). Il reçoit un Service Ticket (*ST*), qui est utilisable une seule fois, et dans les secondes qui suivent sa création.
* Le client se connecte au service désiré à l'aide du *ST*.
* Le service, de son côté, demande au CAS si le *ST* est valide. Il peut par cette occasion récupérer le login de l'utilisateur, et éventuellement d'autres infos (nom, prénom, etc.).
* Le CAS supprime le *ST*.
* A la déconnexion, le *TGT* est supprimé (fin de la session PHP avec le CAS, ou demande de déconnexion).

## Utilisation de la classe CASAuth

* Importer la classe : `import CASAuth from '../services/CASAuth';`
* Créer l'objet : `this.cas = new CASAuth();`
Je vous conseille de mettre ceci dans le constructeur de votre screen.
Il est possible de passer en paramètre l'adresse du racine de l'API ticket du CAS, sinon, par défaut c'est `https://cas.utc.fr/cas/v1/tickets/`.
* Se connecter et obtenir un TGT:

		promise = this.cas.login("jeanmichelestmonlogin", "1234estuntrèsbonmotdepasse");
		promise.then(([text, status, url]) => {
			console.log(text +" "+status+" "+url);
			//l'utilisateur est connecté, ces paramètres de retour sont utiles pour faire du debug mais il n'y a pas besoin de les afficher à l'utilisateur				
		}
		).catch( ([text, status, url]) => {
			console.log(text + " "+status+" "+url, true);
			//l'utilisateur n'est pas connecté. Si status=401, c'est que les identifiants sont incorrects. Si status=523, c'est une erreur de connexion au réseau ou un bug dans CASAuth. Sinon, j'en sais rien, débrouillez-vous pour être gentil avec l'utilisateur.
			
		});

* Vérifier qu'on est connecté et qu'on a un TGT :

		cas.isConnected() //renvoie true ou false

* Obtenir le TGT (normalement vous n'avez pas besoin de ça, mais c'est pratique pour le debug)

		cas.tgt

* Demander un ST

		promise = this.cas.getService(service);
		promise.then(([text, status, url]) => {
				console.log(text +" "+status+" "+url);
				//vous avez obtenu un ST, c'est text
				
				
		}
		).catch( ([text, status, url]) => {
				console.log(text + " "+status+" "+url, true);
				//Houston, on a un problème (peut-être que l'URL de votre service est mal foutue?)
		});
