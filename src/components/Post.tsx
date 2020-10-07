import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as PostsStore from '../store/Posts'
import { ListItem, Typography } from '@material-ui/core';

// At runtime, Redux will merge together...
type PostProps =
  { post: Models.Post }
  & typeof PostsStore.actionCreators;

// TODO: get the posts into the board props
class Post extends React.PureComponent<PostProps> {
  public render() {    
    const d = new Date();
    const id : number = this.props.post ? this.props.post.id : d.getTime();
    const title : string = this.props.post ? this.props.post.title : "";
    return (
      <ListItem key={id}>
        <Typography variant="h6">Hola, soy un post</Typography>
        <Typography variant="h6">{title}</Typography>
      </ListItem>
    );
  }  
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
)(Post as any);
