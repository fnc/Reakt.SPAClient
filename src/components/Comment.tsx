import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import { Container, List, ListItem, Typography } from '@material-ui/core';
import * as CommentsStore from '../store/Comments';
import ReplyBox from './ReplyBox';

// At runtime, Redux will merge together...
type CommentsProps =
  Models.Comment
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators;

interface IState 
  {
    commentReply: string,
  }

class Comment extends React.PureComponent<CommentsProps, IState> {         
  constructor(props: CommentsProps) {
    super(props)    
    this.state= {
      commentReply: "",
    }
  }

  public render() {        
    return (      
      <Container> 
        {this.props.isLoading ? (
          // TODO: This is not working, maybe it should go on Post component
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          ) : (      
          <React.Fragment>
            <Typography variant="h6">{this.props.message}</Typography>                 
            <ReplyBox handleSubmit={this.handleReplySubmit} text="Reply" color="secondary" />
            {this.props.replies && this.renderChildren()}
          </React.Fragment>
          )}
      </Container>      
    );
  }  
  
  private renderChildren() {
    return (      
      <Container>
        <List>                   
          {this.props.replies.map((comment: Models.Comment) => {                                
            return (
              <ListItem key={comment.id}>
                <Comment 
                // TODO: refactor this
                          isPostingComment={false}
                          isLoading={this.props.isLoading} 
                          postId={this.props.postId} 
                          comments={this.props.comments} 
                          requestComments={this.props.requestComments} 
                          addComment={this.props.addComment}                           
                          addReply={this.props.addReply}
                          {...comment}/>
              </ListItem>              
            )
          })}         
        </List>
      </Container>
    )
  } 

  private handleReplySubmit = (message: string) => {    
    const reply = { message, likes: 0 }
    this.props.addReply(this.props.id, reply);
  }  
}


const mapStateToProps = 
(state: ApplicationState) => ({
  board: state.boards ? state.boards.currentBoard : undefined,
  comments: state.comments ? state.comments.comments: undefined,
  isLoading: state.posts ? state.posts.isLoading: undefined,      
});

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  CommentsStore.actionCreators // Selects which action creators are merged into the component's props
)(Comment as any);
