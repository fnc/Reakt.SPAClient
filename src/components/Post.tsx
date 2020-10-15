import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as CommentsStore from '../store/Comments';
import Comment from './Comment';
import ReplyBox from './ReplyBox';
import { AccordionSummary, Accordion, AccordionDetails, ListItem, Typography } from '@material-ui/core';

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
  // public componentDidMount() {
  //   this.ensureDataFetched();
  // }

  private ensureDataFetched() {
    const ps = this.props;
    const s = this.state;
    this.props.requestComments(this.props.id);
  }

  private handleReplySubmit = (message: string) => {    
    const comment = { message, likes: 0 }
    this.props.addComment(this.props.id, comment)
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
        <Accordion onClick={() =>{this.ensureDataFetched()}}>
          <AccordionSummary>              
            <Typography variant="h5">{title}</Typography>
            <Typography variant="h6">{description}</Typography>   
            <ReplyBox handleSubmit={this.handleReplySubmit} text="New Top comment" color="primary"></ReplyBox>                            
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">Comments</Typography>              
              {this.props.comments.map((comment : Models.Comment) => {                  
                return <Comment {...comment}/>                  
              })}              
          </AccordionDetails>            
        </Accordion>
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
