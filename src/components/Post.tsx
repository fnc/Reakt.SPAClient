import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as CommentsStore from '../store/Comments'
import Comment from './Comments'
import { ListItem, Typography, Card, CardContent, Container, CardActions, Button } from '@material-ui/core';

// At runtime, Redux will merge together...
type PostProps =
  Models.Post
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators;

// TODO: get the posts into the board props
class Post extends React.PureComponent<PostProps> {    
  public componentDidMount() {
    this.ensureDataFetched();
  }

  private ensureDataFetched() {
    this.props.requestComments(this.props.id);
  }

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
              <Container>
                <Typography variant="h6">Comments</Typography>
                {this.props.comments.map((comment : Models.Comment) => {
                  if (!comment.parent) {
                    return <Comment {...comment}/>
                  }
                })}
              </Container>
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
  comments: state.comments?state.comments.comments:undefined,
  isLoading: state.posts?state.posts.isLoading:undefined,
});

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  CommentsStore.actionCreators // Selects which action creators are merged into the component's props
)(Post as any);
