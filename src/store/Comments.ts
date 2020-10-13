import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import * as ApiModels from '../services/ApiModels';
import { ADDED_REPLY, REQUEST_ADD_REPLY ,REQUEST_COMMENTS, RECEIVE_COMMENTS, REQUEST_ADD_COMMENT, ADDED_COMMENT, TOGGLE_COMMENT_TEXTBOX } from '../constants/action-types';
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

interface AddCommentAction {
    type: typeof REQUEST_ADD_COMMENT;
    comment: Models.Comment;
}
interface AddedCommentAction {
    type: typeof ADDED_COMMENT;
    comment: Models.Comment;
    postId: number;
}

interface ToggleCommentTextboxAction {
    type: typeof TOGGLE_COMMENT_TEXTBOX;
    commentId: number;
}

interface RequestAddReplyAction {
    type: typeof REQUEST_ADD_REPLY,    
}

interface AddedReplyAction {
    type: typeof ADDED_REPLY,
    reply: Models.Comment,
    commentParentId: number,
}


type KnownAction = RequestCommentsAction | ReceiveCommentsAction | AddCommentAction | AddedCommentAction | ToggleCommentTextboxAction | RequestAddReplyAction | AddedReplyAction;

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
    addReply: (commentParentId: number, reply: ApiModels.Reply): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState.comments && !appState.comments.isLoading) {
            dispatch({ type: REQUEST_ADD_REPLY });
            HttpClient.post(`${BASE_URL}comments/${commentParentId}/replies`, reply)
                .then(response => response.json() as Promise<Models.Comment>)
                .then(data => {
                    dispatch({ type: ADDED_REPLY, reply: data, commentParentId })
                })
                .catch((error) => {console.error('Error:', error)});
        }
    },
    toggleTextBox: (commentId: number) : AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({ type: TOGGLE_COMMENT_TEXTBOX, commentId });
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
            // TODO: this should be on default somewhere else; expects a return 
            action.comments.map((c) => {c.showTextBox = false; return null;});
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
        case REQUEST_ADD_REPLY: 
            return {
                comments: state.comments,
                isLoading: true,
                postId: state.postId,
                isPostingComment: false,
            }
        case ADDED_REPLY: 
            return {
                comments: addReplyFunc(state.comments, action),
                isLoading: false,
                postId: state.postId,
                isPostingComment: false,
            }    
        case TOGGLE_COMMENT_TEXTBOX:                   
            return {
                comments: toggleCommentFunc(state.comments, action),
                isLoading: false,
                postId: state.postId,
                isPostingComment: false,
            }
        default:
            return state;
    };
};

const toggleCommentFunc = (comments: Models.Comment[], action: ToggleCommentTextboxAction) => {    
    let commentsCopy = comments.slice();
    commentsCopy.forEach(c => {
        if(c.id === action.commentId) {
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
