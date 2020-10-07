import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import { REQUEST_COMMENTS, RECEIVE_COMMENTS, REQUEST_ADD_COMMENT, ADDED_COMMENT } from '../constants/action-types';
import { BASE_URL } from '../constants/url';
import * as HttpClient from '../services/HttpClient';

export interface CommentsState {
    isLoading: boolean;
    comments: Models.Comment[];
}

interface RequestCommentsAction {
    type: typeof REQUEST_COMMENTS
}

interface ReceiveCommentsAction {
    type: typeof RECEIVE_COMMENTS;
    comments: Models.Comment[];
}

interface addCommentAction {
    type: typeof REQUEST_ADD_COMMENT;
    comment: Models.Comment;
}
interface addedCommentAction {
    type: typeof ADDED_COMMENT;
    comment: Models.Comment;
}

type KnownAction = RequestCommentsAction | ReceiveCommentsAction | addCommentAction | addedCommentAction;



export const actionCreators = {
    requestComments: (postId: number, startRange?: number, endRange?: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        let filters = new Map<string,string>();
        if(startRange){filters.set("startRange",startRange.toString());}
        if(endRange){filters.set("endRange",endRange.toString());}
        if (appState && appState.posts && appState.posts.posts.length === 0 && !appState.posts.isLoading) {
            HttpClient.get(BASE_URL + "posts/" + postId + "/comments",filters)
                .then(response => response.json() as Promise<Models.Comment[]>)
                .then(data => {
                    dispatch({ type: RECEIVE_COMMENTS, comments: data });
                });

            dispatch({ type: REQUEST_COMMENTS });
        }
    },
    addComment: (postId: number, comment: Models.Comment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.posts && appState.posts.posts.length === 0 && !appState.posts.isLoading) {
            HttpClient.post(BASE_URL + "posts/" + postId + "/comments", comment)
                .then(response => response.json() as Promise<Models.Comment>)
                .then(data => {
                    dispatch({ type: ADDED_COMMENT, comment: data });
                });

            dispatch({ type: REQUEST_ADD_COMMENT, comment: comment });
        }
    }
};


const unloadedState: CommentsState = { comments: [], isLoading: false };

export const reducer: Reducer<CommentsState> = (state: CommentsState | undefined, action: KnownAction): CommentsState => {
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case REQUEST_COMMENTS:
            return {
                comments: [],
                isLoading: true
            };
        case RECEIVE_COMMENTS:
            return {
                comments: action.comments,
                isLoading: false
            };
        default:
            return state;
    };
};
