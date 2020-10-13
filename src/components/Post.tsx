import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as CommentsStore from '../store/Comments'
import Comment from './Comment'
import { Input, ListItem, Typography, Card, CardContent, Container, CardActions, Button } from '@material-ui/core';

// At runtime, Redux will merge together...
type PostProps =
  Models.Post
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators;

interface IPostState {
  showReplyBox: boolean;
  newCommentMessage: string;
}


// TODO: get the posts into the board props
class Post extends React.PureComponent<PostProps, IPostState> {    
  constructor(props: PostProps) {
    super(props);
    this.state={
      newCommentMessage: "",
      showReplyBox: false,
    }
  }
  public componentDidMount() {
    this.ensureDataFetched();
  }

  private ensureDataFetched() {
    this.props.requestComments(this.props.id);
  }

  private handlePostReply() {
    const newComment = { message: this.state.newCommentMessage }
    this.props.addComment(this.props.id, newComment)
  }

  //TODO: This code is repeated on the comment component! => take to another component
  private renderReplyBox = () => {
    return (      
      <form>
        <Input defaultValue="please reply here!" onChange={e => this.handleReplyChange(e.target.value)} required={true}></Input>
        <Button color="secondary" onClick={this.handleReplySubmit}>Reply!</Button>
      </form>      
    )
  }

  private handleReplySubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();    
    const comment = { message: this.state.newCommentMessage, likes: 0 }
    this.props.addComment(this.props.id, comment)
  }
  
  private handleReplyChange = (value : string) => {        
    this.setState({
      newCommentMessage: value      
    })
  }

  private handleTextClick = () => {
    this.setState(prevState => ({
      showReplyBox: !prevState.showReplyBox
    })
    )
  }

  // * ------- *

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
              <Button onClick={this.handleTextClick}>Create Top Comment</Button>                 
              {this.state.showReplyBox && this.renderReplyBox()}
              <Typography variant="h6">Comments</Typography>              
                {this.props.comments.map((comment : Models.Comment) => {                  
                  return <Comment {...comment}/>                  
                })}              
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
