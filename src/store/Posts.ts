import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import { REQUEST_POSTS, RECEIVE_POSTS } from '../constants/action-types';
import { BASE_URL } from '../constants/url';

export interface PostsState {
    isLoading: boolean;    
    posts: Models.Post[];
}

interface RequestPostsAction {
    type: typeof REQUEST_POSTS
}

interface ReceivePostAction {
    type: typeof RECEIVE_POSTS;    
    posts: Models.Post[];
}

type KnownAction = RequestPostsAction | ReceivePostAction;



export const actionCreators = {
    requestPosts: (boardId: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();        
        dispatch({ type: REQUEST_POSTS });
        if (appState && appState.posts && appState.posts.posts.length === 0 && !appState.posts.isLoading) {
            fetch( BASE_URL + "boards/"+boardId+"/posts")            
                .then(response => response.json() as Promise<Models.Post[]>)
                .then(data => {
                    dispatch({ type: RECEIVE_POSTS, posts: data });
                });
        }
    }
};


const unloadedState: PostsState = { posts: [], isLoading: false };

export const reducer: Reducer<PostsState> = (state: PostsState | undefined, action: KnownAction): PostsState => {        
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case REQUEST_POSTS:
            return {                
                posts: [],
                isLoading: true
            };
        case RECEIVE_POSTS:        
            return {                
                posts: action.posts,
                isLoading: false
            };                 
        default: 
            return state;
    };        
};
