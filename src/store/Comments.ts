import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import * as ApiModels from '../services/ApiModels';
import * as Actions from '../constants/action-types';
import * as CommentService from '../services/CommentService';

export interface CommentsState {
    isLoading: boolean;
    isPostingComment: boolean;
    commentsStore: Models.Comment[];
    postId: number;
}

interface RequestCommentsAction {
    type: typeof Actions.REQUEST_COMMENTS
}

interface ReceiveCommentsAction {
    type: typeof Actions.RECEIVE_COMMENTS;
    comments: ApiModels.Comment[];
    postId: number;
}

interface AddCommentAction {
    type: typeof Actions.REQUEST_ADD_COMMENT;
    message: string;
}
interface AddedCommentAction {
    type: typeof Actions.ADDED_COMMENT;
    comment: ApiModels.Comment;
    postId: number;
}

interface RequestAddReplyAction {
    type: typeof Actions.REQUEST_ADD_REPLY,
}

interface AddedReplyAction {
    type: typeof Actions.ADDED_REPLY,
    reply: ApiModels.Comment,
    commentParentId: number,
}

interface RequestRepliesAction {
    type: typeof Actions.REQUEST_REPLIES
}

interface ReceiveRepliesAction {
    type: typeof Actions.RECEIVE_REPLIES;
    replies: ApiModels.Comment[];
    commentId: number;
}

// TODO: there are oh so many actions
interface RequestCommentLikeAction {
  type: typeof Actions.REQUEST_COMMENT_LIKE;
}

interface UpdatedCommentLikeAction {
  type: typeof Actions.UPDATED_COMMENT_LIKE;
  likes: number;
  commentId: number;
}



type KnownAction = 
    RequestCommentsAction
    | ReceiveCommentsAction
    | AddCommentAction
    | AddedCommentAction
    | RequestAddReplyAction
    | AddedReplyAction
    | RequestRepliesAction
    | ReceiveRepliesAction
    | RequestCommentLikeAction
    | UpdatedCommentLikeAction
    ;


export const actionCreators = {
    requestComments: (requestedPostId: number, startRange?: number, endRange?: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.comments && appState.comments.postId !== requestedPostId && !appState.comments.isLoading) {
            CommentService.getComments(requestedPostId, startRange, endRange)
                .then(data => {
                    dispatch({ type: Actions.RECEIVE_COMMENTS, comments: data, postId: requestedPostId });
                });
            dispatch({ type: Actions.REQUEST_COMMENTS });
        }
    },
    requestReplies: (requestedCommentId: number, startRange?: number, endRange?: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.comments && !appState.comments.isLoading) {
            CommentService.getReplies(requestedCommentId, startRange, endRange)
                .then(data => {
                    dispatch({ type: Actions.RECEIVE_REPLIES, replies: data, commentId: requestedCommentId });
                })
                .catch((error) => { console.error('Error:', error) });
            dispatch({ type: Actions.REQUEST_REPLIES });
        }
    },
    addReply: (commentParentId: number, message: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState.comments && !appState.comments.isLoading) {
            CommentService.addReply(commentParentId, {message: message} )
                .then(data => {
                    dispatch({ type: Actions.ADDED_REPLY, reply: data, commentParentId })
                })
                .catch((error) => { console.error('Error:', error) });
            dispatch({ type: Actions.REQUEST_ADD_REPLY });
        }
    },
    addComment: (requestedPostId: number, message: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        CommentService.addComment(requestedPostId,{message: message})
            .then(data => {
                dispatch({ type: Actions.ADDED_COMMENT, comment: data, postId: requestedPostId });
            });
        dispatch({ type: Actions.REQUEST_ADD_COMMENT, message: message });
    },
    handleCommentLike: (amount: number, commentId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
      const appState = getState();
      if (appState && appState.comments && !appState.comments.isLoading) {
        dispatch({ type: Actions.REQUEST_COMMENT_LIKE});      
        CommentService.likeAComment(amount, commentId)
          .then(data => {
            dispatch({ type: Actions.UPDATED_COMMENT_LIKE, likes: data.likes, commentId: data.id })
          })
      }
    }
};


const unloadedState: CommentsState = { commentsStore: [], isPostingComment: false, isLoading: false, postId: 0 };

export const reducer: Reducer<CommentsState> = (state: CommentsState | undefined, action: KnownAction): CommentsState => {
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case Actions.REQUEST_COMMENTS:
            return {
                commentsStore: [],
                isLoading: true,
                isPostingComment: state.isPostingComment,
                postId: 0
            };
        case Actions.RECEIVE_COMMENTS:
            return {
                commentsStore: action.comments.map((c):Models.Comment => ({...c, isRootComment: true, replies:[]})),
                isLoading: false,
                isPostingComment: state.isPostingComment,
                postId: action.postId
            };
        case Actions.REQUEST_ADD_COMMENT:
            return {
                commentsStore: state.commentsStore,
                isLoading: state.isLoading,
                isPostingComment: true,
                postId: state.postId
            };
        case Actions.ADDED_COMMENT:
            return {
                commentsStore: [...state.commentsStore, {...(action.comment), isRootComment: true, replies:[]}],
                isLoading: state.isLoading,
                isPostingComment: false,
                postId: state.postId
            };
        case Actions.REQUEST_ADD_REPLY:
            return {
                commentsStore: state.commentsStore,
                isLoading: true,
                postId: state.postId,
                isPostingComment: false,
            }
        case Actions.ADDED_REPLY:
            return {
                commentsStore: addReplyFunc(state.commentsStore, action),
                isLoading: false,
                postId: state.postId,
                isPostingComment: false,
            }
        case Actions.REQUEST_REPLIES:
            return {
                commentsStore: state.commentsStore,
                isLoading: true,
                isPostingComment: state.isPostingComment,
                postId: 0
            };
        case Actions.RECEIVE_REPLIES:
            return {
                commentsStore: action.replies ? receiveRepliesFunc(state.commentsStore, action.replies, action.commentId) : state.commentsStore,
                isLoading: false,
                isPostingComment: state.isPostingComment,
                postId: state.postId
            };
        case Actions.REQUEST_COMMENT_LIKE: 
            return {
              commentsStore: state.commentsStore,
              isLoading: true,
              isPostingComment: state.isPostingComment,
              postId: state.postId,
            }
        case Actions.UPDATED_COMMENT_LIKE: 
            return {
              commentsStore: likeACommentFunc(state.commentsStore, action.commentId, action.likes),
              isLoading: false,
              isPostingComment: state.isPostingComment,
              postId: state.postId,
            }
        default:
            return state;
    };
};

const addReplyFunc = (comments: Models.Comment[], action: AddedReplyAction) => {
    let commentsCopy = comments.slice();
    commentsCopy.forEach(c => {
        if (c.id === action.commentParentId) {
            c.replies.push(action.reply.id);
        }
    });   
    commentsCopy.push(action.reply as Models.Comment); // TODO: Apparently casting works as maping.
    return commentsCopy;
}

const receiveRepliesFunc = (comments: Models.Comment[], replies: ApiModels.Comment[], commentId: number) => {
    let repliesIds = replies.map(r => r.id);
    let commentsCopy = comments.filter(c=>(!repliesIds.includes(c.id)));
    let parenComment = commentsCopy.find(c => ( c.id === commentId ));
    if(parenComment){parenComment.replies.push(...repliesIds);}   
    let mappedReplies = replies as Models.Comment[]; // TODO: Same as the other cast, is this ok? 
    commentsCopy.push(...mappedReplies);
    return commentsCopy;
}

const likeACommentFunc = (comments: Models.Comment[], commentId: number, likes: number) : Models.Comment[] => {
  const commentsCopy = comments.slice();
  commentsCopy.forEach((c) => {
    if (c.id === commentId) {
      c.likes = likes;
    }
  })
  return commentsCopy;
}