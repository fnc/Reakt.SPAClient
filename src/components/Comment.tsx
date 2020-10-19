import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import { Button, Container, List, ListItem, Typography } from '@material-ui/core';
import * as CommentsStore from '../store/Comments';
import ReplyBox from './ReplyBox';
import Like from './Like';

// At runtime, Redux will merge together...
type CommentProps =
  Models.Comment
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators;

interface IState {
  commentReply: string,
}

class Comment extends React.PureComponent<CommentProps, IState> {
  constructor(props: CommentProps) {
    super(props)
    this.state = {
      commentReply: "",
    }
  }
  
  private handleCommentLike = (amount: number) => {
    this.props.handleCommentLike(amount, this.props.id);
  }


  public render() {
    return (
      <Container>
        <Typography variant="h6">{this.props.message}</Typography>
        <ReplyBox handleSubmit={this.handleReplySubmit} text="Reply" color="secondary" />
        <Like parentId={this.props.id} likes={this.props.likes} handleClick={this.handleCommentLike}/>
        {this.props.replyCount > 0 && this.props.replies.length === 0 && this.renderLoadRepliesButton()} 
        {/* check for length since replies will never be undefined */}
        {this.props.replies.length > 0 && this.renderChildren()}
      </Container>
    );
  }


  private renderChildren() {
    return (
      <Container>
        <List>
          {this.props.replies.map((commentId: number) => {
            let comment = this.props.commentsStore.find(c => (c.id === commentId));
            if (comment) {
              return (
                <ListItem key={comment.id}>
                  <Comment
                    // TODO: refactor this
                    isPostingComment={false}
                    isLoading={this.props.isLoading}
                    postId={this.props.postId}
                    commentsStore={this.props.commentsStore}
                    requestComments={this.props.requestComments}
                    addComment={this.props.addComment}
                    addReply={this.props.addReply}
                    requestReplies={this.props.requestReplies}
                    handleCommentLike={this.props.handleCommentLike}
                    {...comment} />
                </ListItem>
              );
            }
            return undefined;
          })}
        </List>
      </Container>
    )
  }

  private renderLoadRepliesButton = () => {
    return (
      <Button onClick={() => {this.props.requestReplies(this.props.id)}}>Load replies!</Button>
    )
  }

  private handleReplySubmit = (message: string) => {
    this.props.addReply(this.props.id,message);
  }
}


const mapStateToProps = 
(state: ApplicationState) => ({
  board: state.boards ? state.boards.currentBoard : undefined,
  commentsStore: state.comments ? state.comments.commentsStore: undefined,
  isLoading: state.posts ? state.posts.isLoading: undefined,      
});

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  CommentsStore.actionCreators // Selects which action creators are merged into the component's props
)(Comment as any);
