import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import * as ApiModels from '../services/ApiModels'
import { post } from '../services/HttpClient';
import * as Actions from '../constants/action-types';
import { BASE_URL } from '../constants/url';

export interface PostsState {
  isLoading: boolean;    
  posts: Models.Post[];
  boardId: number;
  expandedPost: number;
}

interface RequestPostsAction {
    type: typeof Actions.REQUEST_POSTS
}

interface ReceivePostAction {
    type: typeof Actions.RECEIVE_POSTS;    
    posts: Models.Post[];
    boardId: number;
}

interface RequestAddPostAction {
  type: typeof Actions.REQUEST_ADD_POST;
}

interface AddedPostAction {
  type: typeof Actions.ADDED_POST;
  post: Models.Post;
}

interface ChangeExpandedPostAction {
  type: typeof Actions.CHANGE_EXPANDED_POST;
  postId: number;
}

interface RequestPostLikeAction {
  type: typeof Actions.REQUEST_POST_LIKE
}

// TODO: Technically, it would always be a +1. but maybe a super user could give +5 someday. would it be ok to keep it this way? No harm done after all
interface UpdatedPostLikeAction {
  type: typeof Actions.UPDATED_POST_LIKE;
  amount: number;
  postId: number;
}

type KnownAction =
  RequestPostsAction 
 | ReceivePostAction 
 | RequestAddPostAction 
 | AddedPostAction 
 | ChangeExpandedPostAction 
 | RequestPostLikeAction
 | UpdatedPostLikeAction
 ;



export const actionCreators = {
  requestPosts: (boardRequest: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
      // Only load data if it's something we don't already have (and are not already loading)
      const appState = getState();        
      if (appState && appState.posts && appState.posts.boardId !== boardRequest && !appState.posts.isLoading) {
          dispatch({ type: Actions.REQUEST_POSTS });            
          fetch( BASE_URL + "boards/"+boardRequest+"/posts")            
          .then(response => response.json() as Promise<Models.Post[]>)
          .then(data => {
              dispatch({ type: Actions.RECEIVE_POSTS, posts: data, boardId: boardRequest });
          });
      }
  },
  addPost: (boardId: number, newPost: ApiModels.NewPost): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (appState && appState.posts && !appState.posts.isLoading) {
      dispatch({ type: Actions.REQUEST_ADD_POST });
      post(`${BASE_URL}boards/${boardId}/posts`, newPost)
      .then(r => r.json() as Promise<Models.Post>)
      .then(data => {
        dispatch({ type: Actions.ADDED_POST, post: data });
      })
      .catch((error) => {console.log(error)});
    }
  },
  changeExpandedPost: (postId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (appState.posts && appState.posts.expandedPost !== postId) {
      dispatch({ type: Actions.CHANGE_EXPANDED_POST, postId });
    }
  },
  handlePostLike: (amount: number, postId: number): AppThunkAction<KnownAction> => (dispatch) => {
    // TODO: Hit the server! 
    dispatch({ type: Actions.REQUEST_POST_LIKE });
    dispatch({ type: Actions.UPDATED_POST_LIKE, amount, postId });
  }
};


const unloadedState: PostsState = { posts: [], isLoading: false, boardId: 0, expandedPost: 0 };

export const reducer: Reducer<PostsState> = (state: PostsState | undefined, action: KnownAction): PostsState => {        
    if (state === undefined) {
        return unloadedState;
    }
    
    switch (action.type) {
      case Actions.REQUEST_POSTS:
        return {                
          posts: [],
          isLoading: true,
          boardId: 0,
          expandedPost: state.expandedPost,
        };
      case Actions.RECEIVE_POSTS:        
        return {                
          posts: action.posts,
          isLoading: false,
          boardId: action.boardId,
          expandedPost: state.expandedPost,
        };                 
      case Actions.REQUEST_ADD_POST:
        return {
          posts: state.posts,
          isLoading: true,
          boardId: state.boardId,
          expandedPost: state.expandedPost,
        }
      case Actions.ADDED_POST:
        return {
          posts: [...state.posts, action.post],
          isLoading: false,
          boardId: state.boardId,
          expandedPost: state.expandedPost,
        }
      case Actions.CHANGE_EXPANDED_POST:
        return {
          posts: state.posts,
          isLoading: false,
          boardId: state.boardId,
          expandedPost: action.postId,
        }
      case Actions.REQUEST_POST_LIKE:
        return {
          posts: state.posts,
          isLoading: true,
          boardId: state.boardId,
          expandedPost: state.expandedPost,
        }
      case Actions.UPDATED_POST_LIKE:
        return {
          posts: likeAPostFunc(state.posts, action.postId, action.amount),
          isLoading: true,
          boardId: state.boardId,
          expandedPost: state.expandedPost,
        }
      default: 
          return state;
    };        
};

const likeAPostFunc = (posts: Models.Post[], postId: number, amount: number) => {
  const postsCopy = posts.slice();
  postsCopy.forEach(x => {
    if (x.id === postId) {
      x.likes += amount;
    }
  });
  return postsCopy;
}