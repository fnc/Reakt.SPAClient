import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as PostsStore from '../store/Posts'
import Post from './Post';

// At runtime, Redux will merge together...
type BoardProps =
  { board: Models.Board }
  & PostsStore.PostsState // ... state we've requested from the Redux store
  & typeof PostsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters


class Board extends React.PureComponent<BoardProps> {
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
        <h2 id="tabelLabel">Posts</h2>
        {this.renderPostsTable()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {
    this.props.requestPosts(this.props.board.id);
  }

  private renderPostsTable() {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {this.props.posts.map((post: Models.Post) => post.title)}
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

const mapStateToProps = 
(state: ApplicationState) => ({
  board: state.currentBoard,
  posts: state.posts?state.posts.posts:undefined,
  isLoading: state.posts?state.posts.isLoading:undefined,
});

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  PostsStore.actionCreators // Selects which action creators are merged into the component's props
)(Board as any);
