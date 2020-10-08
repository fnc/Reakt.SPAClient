import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as PostsStore from '../store/Posts'
import { ListItem, Typography, Card, CardContent, Container, CardActions, Button } from '@material-ui/core';

// At runtime, Redux will merge together...
type PostProps =
  Models.Post
  & typeof PostsStore.actionCreators;

// TODO: get the posts into the board props
class Post extends React.PureComponent<PostProps> {  

  public render() {    
    const d = new Date();
    let id: number = d.getTime();
    let title: string = "I'm a placeholder title";
    let description: string = "I'm a placeholder description"
    if (this.props) {
      id = this.props.id;
      title = this.props.title;
      description = this.props.description;
    }    
    return (
      //TODO: Add all comments to this, expand to accordion, [loading icon], create Post
      <ListItem key={id}>
        <Container>
          <Card>
            <CardContent>
              <Typography variant="h5">{title}</Typography>
              <Typography variant="h6">{description}</Typography>
            </CardContent>
            <CardActions>
              <Button></Button>
            </CardActions>
          </Card>
        </Container>
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
