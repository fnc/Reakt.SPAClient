import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import { REQUEST_POSTS, RECEIVE_POSTS } from '../constants/action-types';
import { BASE_URL } from '../constants/url';

export interface PostsState {
    isLoading: boolean;    
    posts: Models.Post[];
    boardId: number;
}

interface RequestPostsAction {
    type: typeof REQUEST_POSTS
}

interface ReceivePostAction {
    type: typeof RECEIVE_POSTS;    
    posts: Models.Post[];
    boardId: number;
}

type KnownAction = RequestPostsAction | ReceivePostAction;



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
    }
};


const unloadedState: PostsState = { posts: [], isLoading: false, boardId: 0 };

export const reducer: Reducer<PostsState> = (state: PostsState | undefined, action: KnownAction): PostsState => {        
    if (state === undefined) {
        return unloadedState;
    }
    
    switch (action.type) {
        case REQUEST_POSTS:
            return {                
                posts: [],
                isLoading: true,
                boardId: 0
            };
        case RECEIVE_POSTS:        
            return {                
                posts: action.posts,
                isLoading: false,
                boardId: action.boardId
            };                 
        default: 
            return state;
    };        
};
