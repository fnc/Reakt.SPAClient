import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import { Input, Button, Container, List, ListItem, Typography } from '@material-ui/core';
import * as CommentsStore from '../store/Comments';

// At runtime, Redux will merge together...
type CommentsProps =
  Models.Comment
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators;

class Comment extends React.PureComponent<CommentsProps> {         
  constructor(props: CommentsProps) {
    super(props)
    this.state= {
      commentReply: "",
    }
  }
  public render() {        
    return (
      <Container>       
        <Typography variant="h6">{this.props.message}</Typography>                 
        <Button onClick={this.handleTextClick}>Reply to this MF</Button>                             
        {this.props && this.props.showTextBox && this.renderReplyBox()}
        {this.renderChildren()}
      </Container>
    );
  }  
  private renderChildren() {
    return (
      <Container>
        <List>
          {/* Should the parent actually have a list of its children? */}             
          {this.props.comments.map((comment: Models.Comment) => {                    
            if (comment.parent && comment.parent.id === this.props.id) {
              return (
                <ListItem key={comment.id}>
                  <Comment 
                  // TODO: Solve this
                            isLoading={this.props.isLoading} 
                            postId={comment.id} 
                            comments={this.props.comments} 
                            requestComments={this.props.requestComments} 
                            addComment={this.props.addComment} 
                            toggleTextBox={this.props.toggleTextBox}
                            {...comment}/>
              </ListItem>              
              )}
              else {
                return <p></p>
              } 
          })}         
        </List>
      </Container>
    )
  }
  
  private handleTextClick = () => {    
    this.props.toggleTextBox(this.props.id);    
  }

  private handleReplySubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newComment = { parent: this, likes: 0, message: this.state.commentReply, createdAt: Date.toString(), id: 0, showTextBox: false }
    this.props.addComment(this.props.postId, newComment);
  }
  
  private handleReplyChange = (value : string) => {        
    this.setState({
      commentReply: value      
    })
  }

  private renderReplyBox = () => {
    return (      
      <form>
        <Input defaultValue="please reply here!" onChange={e => this.handleReplyChange(e.target.value)} required={true}></Input>
        <Button color="secondary" onClick={this.handleReplySubmit}>Reply!</Button>
      </form>      
    )
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
)(Comment as any);
