import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as CommentsStore from '../store/Comments';
import * as PostsStore from '../store/Posts';
import Comment from './Comment';
import ReplyBox from './ReplyBox';
import { AccordionSummary, Accordion, AccordionDetails, ListItem, Typography } from '@material-ui/core';

// At runtime, Redux will merge together...
type PostProps =
  Models.Post    
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators  
  & { changeExpandedPost: (id: number) => any }
  & { expandedPost: number }
  ;

interface IPostState {
  showReplyBox: boolean;
  newCommentMessage: string;   
  isExpanded: boolean; 
}

// TODO: get the posts into the board props
class Post extends React.PureComponent<PostProps, IPostState> {    
  constructor(props: PostProps) {
    super(props);    
    this.state={
      newCommentMessage: "",
      showReplyBox: false,      
      isExpanded: false,
    }
  }

  private ensureDataFetched() {    
    this.props.requestComments(this.props.id);    
  }

  private handleReplySubmit = (message: string) => {            
    const comment = { message, likes: 0 }
    this.props.addComment(this.props.id, comment)
  }  

  private handleChange = () => {            
    this.props.changeExpandedPost(this.props.id);
    this.ensureDataFetched()    
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
      <ListItem key={id}>
        {/* {AccordionPost(title, description, this.props.comments, this.handleReplySubmit)} */}
        <Accordion expanded={this.props.id === this.props.expandedPost} onChange={this.handleChange} >
          <AccordionSummary>              
            <Typography variant="h5">{title}</Typography>
            <Typography variant="h6">{description}</Typography>   
            <ReplyBox handleSubmit={this.handleReplySubmit} text="New Top comment" color="primary"></ReplyBox>                            
          </AccordionSummary>
          <AccordionDetails>            
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
  expandedPost: state.posts ? state.posts.expandedPost: false,
});

const mapDispatchToProps = 
{  
  requestComments: CommentsStore.actionCreators.requestComments,
  addComment: CommentsStore.actionCreators.addComment,
  addReply: CommentsStore.actionCreators.addReply,
  changeExpandedPost: PostsStore.actionCreators.changeExpandedPost,
}

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  mapDispatchToProps,  
)(Post as any);
