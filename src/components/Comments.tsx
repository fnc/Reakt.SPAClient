import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import { Typography } from '@material-ui/core';
import * as CommentsStore from '../store/Comments';

// At runtime, Redux will merge together...
type CommentsProps =
  Models.Comment
  & typeof CommentsStore.actionCreators;


class Comment extends React.PureComponent<CommentsProps> {  
  public render() {        
    return (
      <React.Fragment>       
        <Typography variant="h6">{this.props.message}</Typography>                 
        {this.renderChildren()}
      </React.Fragment>
    );
  }  
  private renderChildren() {
    return (
      <React.Fragment>
        {/* Should the parent actually have a list of its children? */}        
      </React.Fragment>
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
