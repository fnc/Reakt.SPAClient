import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as PostsStore from '../store/Posts'
import NewBox from '../components/NewBox'
import { List, Container, Typography } from '@material-ui/core'
import Post from './Post'

// At runtime, Redux will merge together...
type BoardProps =
  { board: Models.Board, posts: Models.Post[], isLoading: boolean }    
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
        {/* <h2 id="tabelLabel">Posts</h2> */}
        {this.renderPostsTable()}
      </React.Fragment>
    );
  }

  private ensureDataFetched() {        
    this.props.requestPosts(this.props.board.id);
  }

  private handleSubmit = (title: string, description: string) => {
    const post = { title, description }            
    this.props.addPost(this.props.board.id, post);
  }
  
  private renderPostsTable() {    
    return (   
      <Container>
        <Typography variant="h3">Posts</Typography>             
        <NewBox text="New Post" color="primary" handleSubmit={this.handleSubmit}></NewBox>
          {(this.props.posts && this.props.posts.length > 0) ? (            
            <List>              
              {this.props.posts.map((post: Models.Post) => <Post {...post}/> )}
            </List>                
            ) :
            (<Typography variant="h6">No hay Posts!</Typography>)            
          }      
      </Container>
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
  board: state.boards ? state.boards.currentBoard : undefined,
  posts: state.posts?state.posts.posts:undefined,
  isLoading: state.posts?state.posts.isLoading:undefined,
});

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  PostsStore.actionCreators // Selects which action creators are merged into the component's props
)(Board as any);
