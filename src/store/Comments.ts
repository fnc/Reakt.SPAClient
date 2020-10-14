import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import * as ApiModels from '../services/ApiModels';
import * as Actions from '../constants/action-types';
import { BASE_URL } from '../constants/url';
import * as HttpClient from '../services/HttpClient';

export interface CommentsState {
    isLoading: boolean;
    isPostingComment: boolean;
    comments: Models.Comment[];
    postId: number;
}

interface RequestCommentsAction {
    type: typeof Actions.REQUEST_COMMENTS
}

interface ReceiveCommentsAction {
    type: typeof Actions.RECEIVE_COMMENTS;
    comments: Models.Comment[];
    postId: number;
}

interface AddCommentAction {
    type: typeof Actions.REQUEST_ADD_COMMENT;
    comment: Models.Comment;
}
interface AddedCommentAction {
    type: typeof Actions.ADDED_COMMENT;
    comment: Models.Comment;
    postId: number;
}

interface ToggleCommentTextboxAction {
    type: typeof Actions.TOGGLE_COMMENT_TEXTBOX;
    commentId: number;
}

interface RequestAddReplyAction {
    type: typeof Actions.REQUEST_ADD_REPLY,
}

interface AddedReplyAction {
    type: typeof Actions.ADDED_REPLY,
    reply: Models.Comment,
    commentParentId: number,
}

interface RequestRepliesAction {
    type: typeof Actions.REQUEST_REPLIES
}

interface ReceiveRepliesAction {
    type: typeof Actions.RECEIVE_REPLIES;
    comments: Models.Comment[];
    postId: number;
}

type KnownAction = RequestCommentsAction |
                   ReceiveCommentsAction |
                   AddCommentAction |
                   AddedCommentAction |
                   ToggleCommentTextboxAction |
                   RequestAddReplyAction |
                   AddedReplyAction |
                   RequestRepliesAction |
                   ReceiveRepliesAction;                   

export const actionCreators = {
    requestComments: (requestedPostId: number, startRange?: number, endRange?: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        let filters = new Map<string, string>();
        if (startRange) { filters.set("startRange", startRange.toString()); }
        if (endRange) { filters.set("endRange", endRange.toString()); }
        if (appState && appState.comments && appState.comments.postId !== requestedPostId && !appState.comments.isLoading) {
            dispatch({ type: Actions.REQUEST_COMMENTS });
            HttpClient.get(`${BASE_URL}posts/${requestedPostId}/comments`, filters)
                .then(response => response.json() as Promise<Models.Comment[]>)
                .then(data => {
                    dispatch({ type: Actions.RECEIVE_COMMENTS, comments: data, postId: requestedPostId });
                });
        }
    },
    requestReplies: (requestedCommentId: number, startRange?: number, endRange?: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        let filters = new Map<string, string>();
        if (startRange) { filters.set("startRange", startRange.toString()); }
        if (endRange) { filters.set("endRange", endRange.toString()); }
        if (appState && appState.comments && appState.comments.postId !== requestedCommentId && !appState.comments.isLoading) {
            dispatch({ type: Actions.REQUEST_COMMENTS });
            HttpClient.get(`${BASE_URL}comments/${requestedCommentId}/replies`, filters)
                .then(response => response.json() as Promise<Models.Comment[]>)
                .then(data => {
                    dispatch({ type: Actions.RECEIVE_COMMENTS, comments: data, postId: requestedCommentId });
                });
        }
    },
    addReply: (commentParentId: number, reply: ApiModels.Reply): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState.comments && !appState.comments.isLoading) {
            dispatch({ type: Actions.REQUEST_ADD_REPLY });
            HttpClient.post(`${BASE_URL}comments/${commentParentId}/replies`, reply)
                .then(response => response.json() as Promise<Models.Comment>)
                .then(data => {
                    dispatch({ type: Actions.ADDED_REPLY, reply: data, commentParentId })
                })
                .catch((error) => { console.error('Error:', error) });
        }
    },
    toggleTextBox: (commentId: number): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: Actions.TOGGLE_COMMENT_TEXTBOX, commentId });
    },
    addComment: (requestedPostId: number, comment: Models.Comment): AppThunkAction<KnownAction> => (dispatch, getState) => {
        HttpClient.post(`${BASE_URL}posts/${requestedPostId}/comments`, comment)
            .then(response => response.json() as Promise<Models.Comment>)
            .then(data => {
                dispatch({ type: Actions.ADDED_COMMENT, comment: data, postId: requestedPostId });
            });
        dispatch({ type: Actions.REQUEST_ADD_COMMENT, comment: comment });
    }
};


const unloadedState: CommentsState = { comments: [], isPostingComment: false, isLoading: false, postId: 0 };

export const reducer: Reducer<CommentsState> = (state: CommentsState | undefined, action: KnownAction): CommentsState => {
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case Actions.REQUEST_COMMENTS:
            return {
                comments: [],
                isLoading: true,
                isPostingComment: state.isPostingComment,
                postId: 0
            };
        case Actions.RECEIVE_COMMENTS:
            // TODO: this should be on default somewhere else; expects a return 
            action.comments.map((c) => { c.showTextBox = false; return null; });
            return {
                comments: action.comments,
                isLoading: false,
                isPostingComment: state.isPostingComment,
                postId: action.postId
            };
        case Actions.REQUEST_ADD_COMMENT:
            return {
                comments: state.comments,
                isLoading: state.isLoading,
                isPostingComment: true,
                postId: state.postId
            };
        case Actions.ADDED_COMMENT:
            return {
                comments: [...state.comments, action.comment],
                isLoading: state.isLoading,
                isPostingComment: false,
                postId: state.postId
            };
        case Actions.REQUEST_ADD_REPLY:
            return {
                comments: state.comments,
                isLoading: true,
                postId: state.postId,
                isPostingComment: false,
            }
        case Actions.ADDED_REPLY:
            return {
                comments: addReplyFunc(state.comments, action),
                isLoading: false,
                postId: state.postId,
                isPostingComment: false,
            }
        case Actions.TOGGLE_COMMENT_TEXTBOX:
            return {
                comments: toggleCommentFunc(state.comments, action),
                isLoading: false,
                postId: state.postId,
                isPostingComment: false,
            }
        case Actions.REQUEST_REPLIES:
            return {
                comments: [],
                isLoading: true,
                isPostingComment: state.isPostingComment,
                postId: 0
            };
        case Actions.RECEIVE_REPLIES:
            // TODO: this should be on default somewhere else; expects a return 
            action.comments.map((c) => { c.showTextBox = false; return null; });
            return {
                comments: action.comments,
                isLoading: false,
                isPostingComment: state.isPostingComment,
                postId: action.postId
            };
        default:
            return state;
    };
};

const toggleCommentFunc = (comments: Models.Comment[], action: ToggleCommentTextboxAction) => {
    let commentsCopy = comments.slice();
    commentsCopy.forEach(c => {
        if (c.id === action.commentId) {
            c.showTextBox = !c.showTextBox;
        }
    })
    return commentsCopy;
}

const addReplyFunc = (comments: Models.Comment[], action: AddedReplyAction) => {
    let commentsCopy = comments.slice();
    commentsCopy.forEach(c => {
        if (c.id === action.commentParentId) {
            c.replies.push(action.reply);
        }
    })
    return commentsCopy;
}
