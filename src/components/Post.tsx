import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as PostsStore from '../store/Posts'

// At runtime, Redux will merge together...
type PostProps =
  { post: Models.Post }
  & typeof PostsStore.actionCreators;


class Post extends React.PureComponent<PostProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    //this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    //this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        <h2 id="tabelLabel">Posts</h2>
        {this.renderPostsTable()}
      </React.Fragment>
    );
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

        </tbody>
      </table>
    );
  }

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
)(Post as any);
