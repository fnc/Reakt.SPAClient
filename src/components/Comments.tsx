import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import { Button, Container, List, ListItem, Typography } from '@material-ui/core';
import * as CommentsStore from '../store/Comments';

// At runtime, Redux will merge together...
type CommentsProps =
  Models.Comment
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators;


class Comment extends React.PureComponent<CommentsProps> {    
  public render() {        
    return (
      <Container>       
        <Typography variant="h6">{this.props.message}</Typography>                 
        <Button>Reply</Button>        
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
                            isPostingComment = {this.props.isPostingComment}
                            isLoading={this.props.isLoading} 
                            postId={comment.id} 
                            comments={this.props.comments} 
                            requestComments={this.props.requestComments} 
                            addComment={this.props.addComment} 
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
