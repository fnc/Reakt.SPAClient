import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import * as ApiModels from '../services/ApiModels'
import { post } from '../services/HttpClient';
import { CHANGE_EXPANDED_POST, REQUEST_POSTS, RECEIVE_POSTS, REQUEST_ADD_POST, ADDED_POST } from '../constants/action-types';
import { BASE_URL } from '../constants/url';

export interface PostsState {
  isLoading: boolean;    
  posts: Models.Post[];
  boardId: number;
  expandedPost: number;
}

interface RequestPostsAction {
  type: typeof REQUEST_POSTS
}

interface ReceivePostAction {
  type: typeof RECEIVE_POSTS;    
  posts: Models.Post[];
  boardId: number;
}

interface RequestAddPostAction {
  type: typeof REQUEST_ADD_POST;
}

interface AddedPostAction {
  type: typeof ADDED_POST;
  post: Models.Post;
}

interface ChangeExpandedPostAction {
  type: typeof CHANGE_EXPANDED_POST;
  postId: number;
}

type KnownAction = RequestPostsAction | ReceivePostAction | RequestAddPostAction | AddedPostAction | ChangeExpandedPostAction;



export const actionCreators = {
  requestPosts: (boardRequest: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
      // Only load data if it's something we don't already have (and are not already loading)
      const appState = getState();        
      if (appState && appState.posts && appState.posts.boardId !== boardRequest && !appState.posts.isLoading) {
          dispatch({ type: REQUEST_POSTS });            
          fetch( BASE_URL + "boards/"+boardRequest+"/posts")            
          .then(response => response.json() as Promise<Models.Post[]>)
          .then(data => {
              dispatch({ type: RECEIVE_POSTS, posts: data, boardId: boardRequest });
          });
      }
  },
  addPost: (boardId: number, newPost: ApiModels.NewPost): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (appState && appState.posts && !appState.posts.isLoading) {
      dispatch({ type: REQUEST_ADD_POST });
      post(`${BASE_URL}boards/${boardId}/posts`, newPost)
      .then(r => r.json() as Promise<Models.Post>)
      .then(data => {
        dispatch({ type: ADDED_POST, post: data });
      })
      .catch((error) => {console.log(error)});
    }
  },
  changeExpandedPost: (postId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
    const appState = getState();
    if (appState.posts && appState.posts.expandedPost !== postId) {
      dispatch({ type: CHANGE_EXPANDED_POST, postId });
    }
  }
};


const unloadedState: PostsState = { posts: [], isLoading: false, boardId: 0, expandedPost: 0 };

export const reducer: Reducer<PostsState> = (state: PostsState | undefined, action: KnownAction): PostsState => {        
    if (state === undefined) {
        return unloadedState;
    }
    
    switch (action.type) {
      case REQUEST_POSTS:
        return {                
          posts: [],
          isLoading: true,
          boardId: 0,
          expandedPost: state.expandedPost,
        };
      case RECEIVE_POSTS:        
        return {                
          posts: action.posts,
          isLoading: false,
          boardId: action.boardId,
          expandedPost: state.expandedPost,
        };                 
      case REQUEST_ADD_POST:
        return {
          posts: state.posts,
          isLoading: true,
          boardId: state.boardId,
          expandedPost: state.expandedPost,
        }
      case ADDED_POST:
        return {
          posts: [...state.posts, action.post],
          isLoading: false,
          boardId: state.boardId,
          expandedPost: state.expandedPost,
        }
      case CHANGE_EXPANDED_POST:
        return {
          posts: state.posts,
          isLoading: false,
          boardId: state.boardId,
          expandedPost: action.postId,
        }
      default: 
          return state;
    };        
};
