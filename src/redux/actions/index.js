import {actionTypes} from "../constants/index";
export function addArticle(payload) {
  return { type: actionTypes.ADD_ARTICLE, payload }
};
