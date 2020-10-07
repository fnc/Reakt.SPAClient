import { Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as Models from '../models/Models';
import { REQUEST_BOARDS, RECEIVE_BOARDS, CHANGE_CURR_BOARD  } from '../constants/action-types';


// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface BoardsState {
    isLoading: boolean;    
    boards: Models.Board[];
    currentBoard: Models.Board;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestBoardsAction {
    type: typeof REQUEST_BOARDS
}

interface ReceiveBoardAction {
    type: typeof RECEIVE_BOARDS;    
    boards: Models.Board[];
}

interface ChangeCurrBoard {
    type: typeof CHANGE_CURR_BOARD;
    currentBoard: Models.Board;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestBoardsAction | ReceiveBoardAction | ChangeCurrBoard;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestBoards: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();        
        if (appState && appState.boards && appState.boards.boards.length === 0 && !appState.boards.isLoading) {            
            dispatch({ type: REQUEST_BOARDS });
            fetch("https://localhost:44387/api/boards")            
                .then(response => response.json() as Promise<Models.Board[]>)
                .then(data => {
                    dispatch({ type: RECEIVE_BOARDS, boards: data });
                });
        }
    },
    setCurrentBoard: (board: Models.Board): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // TODO: only fetch board if it isn't current board. Should this be on Posts? 
        const appState = getState();        
        if (appState && appState.boards && appState.boards.currentBoard && appState.boards.currentBoard.id !== board.id) {            
            //const board = appState.boards?.boards.find((x) => {return x.id === requestedId});
            dispatch({ type: CHANGE_CURR_BOARD, currentBoard: board });
        }       
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: BoardsState = { boards: [], isLoading: false, currentBoard: { id: 0, title: "", description: "", posts:[] } };

export const reducer: Reducer<BoardsState> = (state: BoardsState | undefined, action: KnownAction): BoardsState => {        
    if (state === undefined) {
        return unloadedState;
    }

    switch (action.type) {
        case REQUEST_BOARDS:
            return {                
                boards: [],
                isLoading: true,
                currentBoard: state.currentBoard,
            };
        case RECEIVE_BOARDS:                  
            return {                
                boards: action.boards,
                isLoading: false,
                currentBoard: state.currentBoard,
            };   
        case CHANGE_CURR_BOARD:
            return {
                boards: state.boards,
                isLoading: false,
                currentBoard: action.currentBoard,
            };        
        default: 
            return state;
    };        
};
