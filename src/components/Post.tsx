import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as PostsStore from '../store/Posts'
import { ListItem, Typography, Card, CardContent } from '@material-ui/core';

// At runtime, Redux will merge together...
type PostProps =
  { post: Models.Post }
  & typeof PostsStore.actionCreators;

// TODO: get the posts into the board props
class Post extends React.PureComponent<PostProps> {
  public render() {    
    const d = new Date();
    let id: number = 0;
    let title: string = "I'm a placeholder title";
    let description: string = "I'm a placeholder description"
    if (this.props.post) {
      id = this.props.post.id;
      title = this.props.post.title;
      description = this.props.post.description;
    }    
    return (
      <ListItem key={id}>
        <Card>
          <CardContent>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="h6">{description}</Typography>
          </CardContent>
        </Card>
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
