/**
 * Quelques méthodes utiles pour l'affichage et la gestion des objets Date
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

const monthNames = {
'en-US' : ["January", "February", "March", "April", "May", "June",  "July", "August", "September", "October", "November", "December"],
'fr-FR' : ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
};

export class PrettyDate {
    shortDate(date, locale = "en-US") {
        switch (locale) {
			case "fr-FR":
				return date.getDate() + (date.getDate() == 1 ? "er" : "") + " " + monthNames['fr-FR'][date.getMonth()] + " " + date.getFullYear();
				break;
			case "en-US":
			default:
				return monthNames['en-US'][date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
				break;
        }
    }
}

export default new PrettyDate();