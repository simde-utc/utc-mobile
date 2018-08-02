import Api from './Api'

export class ActualitesUTC extends Api {

	static ACTUS_FEED = 'https://actualites.utc.fr/feed/'

	constructor(st) {
		super(ActualitesUTC.ACTUS_FEED);
		this._st = st;
		this._loaded = false;
		this._upToDate = false;
	}


	loadArticles() {
		return this.call(
			Api.GET,
			{},
			{
				ticket: this._st;
			}
		).then(([response, status]) => { // Si on a une 20x
			console.log(response + " --- "+ status);
		}).catch([response, status]) => {
			console.log(response + " --- "+ status);
		});
	}

}

export default new ActualitesUTC();
