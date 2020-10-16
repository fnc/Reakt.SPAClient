import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import { Container, List, ListItem, Typography } from '@material-ui/core';
import * as CommentsStore from '../store/Comments';
import ReplyBox from './ReplyBox';

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
  public componentDidMount() {
    if (this.props.replyCount > 0) {
      this.props.requestReplies(this.props.id);
    }
  }
  public render() {
    return (
      <Container>
        <Typography variant="h6">{this.props.message}</Typography>
        <ReplyBox handleSubmit={this.handleReplySubmit} text="Reply" color="secondary"></ReplyBox>
        {this.props.replies && this.renderChildren()}
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
                    {...comment} />
                </ListItem>
              );
            }
            return;
          })}
        </List>
      </Container>
    )
  }

  private handleReplySubmit = (message: string) => {
    this.props.addReply(this.props.id,message);
  }
}


const mapStateToProps =
  (state: ApplicationState) => ({
    board: state.boards ? state.boards.currentBoard : undefined,
    posts: state.posts ? state.posts.posts : undefined,
    commentsStore: state.comments ? state.comments.commentsStore : undefined,
    isLoading: state.posts ? state.posts.isLoading : undefined,
  });

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  CommentsStore.actionCreators // Selects which action creators are merged into the component's props
)(Comment as any);
