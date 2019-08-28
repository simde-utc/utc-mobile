import {actionTypes, syncStates} from "../constants/index";
import PortailApi from "../../services/Portail";
export function addPortailArticle(payload) {
	return { type: actionTypes.ADD_PORTAIL_ARTICLE, payload }
}
export function addUTCArticle(payload) {
	return { type: actionTypes.ADD_UTC_ARTICLE, payload }
}
export function addNotification(payload) {
	return { type: actionTypes.ADD_NOTIFICATION, payload }
}
export function reactToPortailArticle(id, like = false, dislike = false) {
	return {
		type: actionTypes.REACT_TO_PORTAIL_ARTICLE,
		{
			"id": id,
			reaction: {"like": like, "dislike": dislike, syncState: syncStates.LOCAL}
		}
	}
}
export function updatePortailArticleReactionSyncState(id, syncState) {
	return {
		type: actionTypes.UPDATE_PORTAIL_ARTICLE_REACTION_SYNC_STATE,
		{
			"id": id,
			"syncState": syncState
		}
	}
}
export function commentPortailArticle(id, commentBody, visibilityId, syncStateSubscriberId) {
	PortailApi.postArticleTopLevelComment(id, comment, visibilityId).then([response, status] => {
			updatePortailArticleCommentDataAndSyncState(id, syncStateSubscriberId, response, syncStates.UPLOADED);
		}).catch([response, status] => {
			if(status == 523) {
				updatePortailArticleCommentSyncState(id, syncStateSubscriberId, syncStates.NETWORK_FAILED);
			}
			else {
				updatePortailArticleCommentSyncState(id, syncStateSubscriberId, syncStates.REFUSED);
			}
		});
	return {
		type: actionTypes.COMMENT_PORTAIL_ARTICLE,
		{
			"id": id,
			"comment": {
				"comment": {"commentBody": commentBody, "visibilityId": visibilityId},
				syncState: syncStates.LOCAL,
				"syncStateSubscriberId": syncStateSubscriberId
			}
		}
	}
}
export function commentUTCArticle(id, comment, syncStateSubscriberId) {
	return {
		type: actionTypes.COMMENT_UTC_ARTICLE,
		{
			"id": id,
			"comment": {
				"comment": {"commentBody": commentBody},
				syncState: syncStates.LOCAL,
				"syncStateSubscriberId": syncStateSubscriberId
			}
		}
	}
}
export function updatePortailArticleCommentSyncState(articleId, syncStateSubscriberId, syncState) {
	return {
		type: actionTypes.UPDATE_PORTAIL_ARTICLE_COMMENT_SYNC_STATE,
		{
			"articleId": articleId,
			"syncStateSubscriberId": syncStateSubscriberId,
			"syncState": syncState
		}
	}
}
export function updatePortailArticleCommentDataAndSyncState(articleId, syncStateSubscriberId, upStreamData, syncState) {
	return {
		type: actionTypes.UPDATE_PORTAIL_ARTICLE_COMMENT_DATA_AND_SYNC_STATE,
		{
			"articleId": articleId,
			"syncStateSubscriberId": syncStateSubscriberId,
			"upStreamData": upStreamData,
			"syncState": syncState
		}
	}
}
export function updateUTCArticleCommentSyncState(articleId, syncStateSubscriberId, syncState) {
	return {
		type: actionTypes.UPDATE_UTC_ARTICLE_COMMENT_SYNC_STATE,
		{
			"articleId": articleId,
			"syncStateSubscriberId": syncStateSubscriberId,
			"syncState": syncState
		}
	}
}
export function updateUTCArticleCommentDataAndSyncState(articleId, syncStateSubscriberId, upStreamData, syncState) {
	return {
		type: actionTypes.UPDATE_UTC_ARTICLE_COMMENT_DATA_AND_SYNC_STATE,
		{
			"articleId": articleId,
			"syncStateSubscriberId": syncStateSubscriberId,
			"upStreamData": upStreamData,
			"syncState": syncState
		}
	}
}
