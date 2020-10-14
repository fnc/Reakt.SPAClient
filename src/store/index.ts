import * as Boards from './Boards';
import * as Posts from './Posts'
import * as Comments from './Comments'

// The top-level state object
export interface ApplicationState {    
    boards: Boards.BoardsState | undefined;
    posts: Posts.PostsState | undefined;    
    comments: Comments.CommentsState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {    
    boards: Boards.reducer,
    posts: Posts.reducer,
    comments: Comments.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
