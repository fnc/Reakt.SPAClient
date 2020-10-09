import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import { REQUEST_COMMENTS, RECEIVE_COMMENTS, REQUEST_ADD_COMMENT, ADDED_COMMENT } from '../constants/action-types';
import { BASE_URL } from '../constants/url';
import * as HttpClient from '../services/HttpClient';

export interface CommentsState {
    isLoading: boolean;
    comments: Models.Comment[];
    postId: number;
}

interface RequestCommentsAction {
    type: typeof REQUEST_COMMENTS
}

interface ReceiveCommentsAction {
    type: typeof RECEIVE_COMMENTS;
    comments: Models.Comment[];
    postId: number;
}

interface addCommentAction {
    type: typeof REQUEST_ADD_COMMENT;
    comment: Models.Comment;
}
interface addedCommentAction {
    type: typeof ADDED_COMMENT;
    comment: Models.Comment;
    postId: number;
}

type KnownAction = RequestCommentsAction | ReceiveCommentsAction | addCommentAction | addedCommentAction;



export const actionCreators = {
    requestComments: (requestedPostId: number, startRange?: number, endRange?: number): AppThunkAction<KnownAction> => (dispatch, getState) => {        
        const appState = getState();
        let filters = new Map<string,string>();
        if(startRange){filters.set("startRange",startRange.toString());}
        if(endRange){filters.set("endRange",endRange.toString());}
        if (appState && appState.comments && appState.comments.postId !== requestedPostId && !appState.comments.isLoading) {
            dispatch({ type: REQUEST_COMMENTS });
            HttpClient.get(BASE_URL + "posts/" + requestedPostId + "/comments",filters)
                .then(response => response.json() as Promise<Models.Comment[]>)
                .then(data => {
                    dispatch({ type: RECEIVE_COMMENTS, comments: data, postId: requestedPostId });
                });
        }
    },
    addComment: (requestedPostId: number, comment: Models.Comment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        //const appState = getState();
        // TODO: Add validation here
        //if (appState && appState.posts && appState.posts.posts.length === 0 && !appState.posts.isLoading) {
        if (true) {
            dispatch({ type: REQUEST_ADD_COMMENT, comment: comment });
            HttpClient.post(BASE_URL + "posts/" + requestedPostId + "/comments", comment)
                .then(response => response.json() as Promise<Models.Comment>)
                .then(data => {
                    dispatch({ type: ADDED_COMMENT, comment: data, postId: requestedPostId });
                });
        }
    }
};


const unloadedState: CommentsState = { comments: [], isLoading: false, postId: 0 };

export const reducer: Reducer<CommentsState> = (state: CommentsState | undefined, action: KnownAction): CommentsState => {
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case REQUEST_COMMENTS:
            return {
                comments: [],
                isLoading: true,
                postId: 0,
            };
        case RECEIVE_COMMENTS:
            return {
                comments: action.comments,
                isLoading: false,
                postId: action.postId,
            };
        default:
            return state;
    };
};
