import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import * as Actions from '../constants/action-types';
import { BASE_URL } from '../constants/url';

export interface PostsState {
    isLoading: boolean;    
    posts: Models.Post[];
    boardId: number;
}

interface RequestPostsAction {
    type: typeof Actions.REQUEST_POSTS
}

interface ReceivePostAction {
    type: typeof Actions.RECEIVE_POSTS;    
    posts: Models.Post[];
    boardId: number;
}

type KnownAction = RequestPostsAction | ReceivePostAction;



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
    }
};


const unloadedState: PostsState = { posts: [], isLoading: false, boardId: 0 };

export const reducer: Reducer<PostsState> = (state: PostsState | undefined, action: KnownAction): PostsState => {        
    if (state === undefined) {
        return unloadedState;
    }
    
    switch (action.type) {
        case Actions.REQUEST_POSTS:
            return {                
                posts: [],
                isLoading: true,
                boardId: 0
            };
        case Actions.RECEIVE_POSTS:        
            return {                
                posts: action.posts,
                isLoading: false,
                boardId: action.boardId
            };         
        default: 
            return state;
    };        
};
