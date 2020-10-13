import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import { REQUEST_COMMENTS, RECEIVE_COMMENTS, REQUEST_ADD_COMMENT, ADDED_COMMENT } from '../constants/action-types';
import { BASE_URL } from '../constants/url';
import * as HttpClient from '../services/HttpClient';

export interface CommentsState {
    isLoading: boolean;
    isPostingComment: boolean;
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
        let filters = new Map<string, string>();
        if (startRange) { filters.set("startRange", startRange.toString()); }
        if (endRange) { filters.set("endRange", endRange.toString()); }
        if (appState && appState.comments && appState.comments.postId !== requestedPostId && !appState.comments.isLoading) {
            dispatch({ type: REQUEST_COMMENTS });
            HttpClient.get(`${BASE_URL}posts/${requestedPostId}/comments`, filters)
                .then(response => response.json() as Promise<Models.Comment[]>)
                .then(data => {
                    dispatch({ type: RECEIVE_COMMENTS, comments: data, postId: requestedPostId });
                });
        }
    },
    addComment: (requestedPostId: number, comment: Models.Comment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        HttpClient.post(`${BASE_URL}posts/${requestedPostId}/comments`, comment)
            .then(response => response.json() as Promise<Models.Comment>)
            .then(data => {
                dispatch({ type: ADDED_COMMENT, comment: data, postId: requestedPostId });
            });
        dispatch({ type: REQUEST_ADD_COMMENT, comment: comment });
    }
};


const unloadedState: CommentsState = { comments: [], isPostingComment: false, isLoading: false, postId: 0 };

export const reducer: Reducer<CommentsState> = (state: CommentsState | undefined, action: KnownAction): CommentsState => {
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case REQUEST_COMMENTS:
            return {
                comments: [],
                isLoading: true,
                isPostingComment: state.isPostingComment,
                postId: 0
            };
        case RECEIVE_COMMENTS:
            return {
                comments: action.comments,
                isLoading: false,
                isPostingComment: state.isPostingComment,
                postId: action.postId
            };
        case REQUEST_ADD_COMMENT:
            return {
                comments: state.comments,
                isLoading: state.isLoading,
                isPostingComment: true,
                postId: state.postId
            };
        case ADDED_COMMENT:
            return {
                comments: [...state.comments,action.comment],
                isLoading: state.isLoading,
                isPostingComment: false,
                postId: state.postId
            };
        default:
            return state;
    };
};
