import {actionTypes} from "../constants/index";
//maps are used with uuids as keys
const initialState = {
	portailArticles: new Map(),
	UTCArticles: new Map(),
	Notifications: new Map(),
};
function rootReducer(state = initialState, action) {
	//add
	//TODO: factorize adds
	if (action.type === actionTypes.ADD_PORTAIL_ARTICLE) {
		return Object.assign({}, state, {
			portailArticles: new Map([...state.portailArticles, [action.payload.id, action.payload]])
		});
	}
	if (action.type === actionTypes.ADD_UTC_ARTICLE) {
		return Object.assign({}, state, {
			UTCArticles: new Map([...state.UTCArticles, [action.payload.id, action.payload]])
		});
	}
	if (action.type === actionTypes.ADD_NOTIFICATION) {
		return Object.assign({}, state, {
			Notifications: new Map([...state.Notifications, [action.payload.id, action.payload]])
		});
	}
	//reactions to articles
	if (action.type === actionTypes.REACT_TO_PORTAIL_ARTICLE) {
		article = Object.assign({}, state.portailArticles.get(action.payload.id));
		article.actions = action.payload.reaction;
		return Object.assign({}, state, {
			PortailArticles: new Map([...state.PortailArticles, [article.id, article]])
		});
	}
	//comments
	if (action.type === actionTypes.COMMENT_PORTAIL_ARTICLE) {
		article = Object.assign({}, state.portailArticles.get(action.payload.id));
		if(article.comments == null) {article.comments = [];}
		article.comments.push(action.payload.comment);
		return Object.assign({}, state, {
			PortailArticles: new Map([...state.PortailArticles, [article.id, article]])
		});
	}
	if (action.type === actionTypes.COMMENT_UTC_ARTICLE) {
		article = Object.assign({}, state.UTCArticles.get(action.payload.id));
		if(article.comments == null) {article.comments = [];}
		article.comments.push(action.payload.comment);
		return Object.assign({}, state, {
			UTCArticles: new Map([...state.UTCArticles, [article.id, article]])
		});
	}
	//update data after sync (once the comment has been posted, notify if failed, or add extra data such as server-side generated uuid of comment)
	if(action.type === actionTypes.UPDATE_PORTAIL_ARTICLE_COMMENT_DATA_AND_SYNC_STATE || action.type === actionTypes.UPDATE_PORTAIL_COMMENT_SYNC_STATE || action.type === actionTypes.UPDATE_UTC_ARTICLE_COMMENT_DATA_AND_SYNC_STATE || action.type === actionTypes.UPDATE_UTC_ARTICLE_COMMENT_SYNC_STATE) {
		sourcePortail = action.type === actionTypes.UPDATE_PORTAIL_ARTICLE_COMMENT_DATA_AND_SYNC_STATE || action.type === actionTypes.UPDATE_PORTAIL_ARTICLE_COMMENT_SYNC_STATE;
		updateData = action.type === actionTypes.UPDATE_PORTAIL_ARTICLE_COMMENT_DATA_AND_SYNC_STATE || action.type === actionTypes.UPDATE_UTC_ARTICLE_COMMENT_DATA_AND_SYNC_STATE;
		if(sourcePortail) {
			ArticlesStore = state.PortailArticles;
		}
		else {
			ArticlesStore = state.UTCArticles;
		}
		localComments = Object.assign({}, ArticlesStore.get(action.payload.articleId).comments);
		commentIndex = localComments.findIndex(elmt => elmt.syncStateSubscriberId == action.payload.syncStateSubscriberId);
		if(commentIndex == -1) {throw "Tried to update state of a comment but it didn't turn up locally";}
		if(updateData) {
			localComments[commentIndex].comment = action.payload.upStreamData;
		}
		localComments[commentIndex].syncState = action.payload.syncState;
		updatedArticle = Object.assign({}, ArticlesStore.get(action.payload.articleId));
		updatedArticle.comments = localComments;
		if (sourcePortail) {
			return Object.assign({}, state, {
				PortailArticles : new Map([...ArticlesStore, [updatedArticle.id, updatedArticle]])
			});
		}
		else {
			return Object.assign({}, state, {
				UTCArticles : new Map([...ArticlesStore, [updatedArticle.id, updatedArticle]])
			});
		}
	}
	return state;
};
export default rootReducer;
