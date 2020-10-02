import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import { REQUEST_BOARDS, RECEIVE_BOARDS } from '../constants/action-types'


// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface BoardsState {
    isLoading: boolean;    
    boards: Board[];
}

export interface Board {    
    id: number;
    title: string;
    description: string;
    posts: number[];    
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestBoardsAction {
    type: typeof REQUEST_BOARDS
}

interface ReceiveBoardAction {
    type: typeof RECEIVE_BOARDS;    
    boards: Board[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestBoardsAction | ReceiveBoardAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestBoards: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();        
        if (appState && !appState.boards) {
            fetch(`https://localhost:44387/api/boards`)
                .then(response => response.json() as Promise<Board[]>)
                .then(data => {
                    dispatch({ type: RECEIVE_BOARDS, boards: data });
                });

            dispatch({ type: REQUEST_BOARDS });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: BoardsState = { boards: [], isLoading: false };

export const reducer: Reducer<BoardsState> = (state: BoardsState | undefined, action: KnownAction): BoardsState => {        
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case REQUEST_BOARDS:
            return {                
                boards: [],
                isLoading: true
            };
        case RECEIVE_BOARDS:
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.            
            return {                
                boards: action.boards,
                isLoading: false
            };                 
    };        
};
