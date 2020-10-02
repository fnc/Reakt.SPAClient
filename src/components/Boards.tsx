import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as BoardsStore from '../store/Boards'

// At runtime, Redux will merge together...
type BoardsProps =
  BoardsStore.BoardsState // ... state we've requested from the Redux store
  & typeof BoardsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters


class Boards extends React.PureComponent<BoardsProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Weather forecast</h1>
        <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
        {this.renderBoardsTable()}        
      </React.Fragment>
    );
  }

  private ensureDataFetched() {    
    this.props.requestBoards();
  }

  private renderBoardsTable() {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th># Posts</th>            
          </tr>
        </thead>
        <tbody>
          {this.props.boards.map((board: BoardsStore.Board) =>
            <tr key={board.id}>
              <td>{board.title}</td>
              <td>{board.description}</td>
              <td>{board.posts.length}</td>              
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  // private renderPagination() {
  //   const prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
  //   const nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

  //   return (
  //     <div className="d-flex justify-content-between">
  //       <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
  //       {this.props.isLoading && <span>Loading...</span>}
  //       <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
  //     </div>
  //   );
  // }
}

export default connect(
  (state: ApplicationState) => state.boards, // Selects which state properties are merged into the component's props
  BoardsStore.actionCreators // Selects which action creators are merged into the component's props
)(Boards as any);
