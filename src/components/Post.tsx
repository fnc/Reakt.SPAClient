//* React imports *//
import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Models from '../models/Models';
import * as CommentsStore from '../store/Comments';
import * as PostsStore from '../store/Posts';
import Comment from './Comment';
import ReplyBox from './ReplyBox';
import Like from './Like'
import { AccordionSummary, Accordion, AccordionDetails, Container, ListItem, Typography, List, Card, CardActions, CardContent } from '@material-ui/core';

// At runtime, Redux will merge together...
type PostProps =
  Models.Post    
  & CommentsStore.CommentsState
  & typeof CommentsStore.actionCreators  
  & { changeExpandedPost: (id: number) => any, handlePostLike: (amount: number, postId: number) => any }
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

  private handleChange = () => {            
    this.props.changeExpandedPost(this.props.id);
    this.ensureDataFetched()    
  }

  private handleReplySubmit = (message: string) => {    
    this.props.addComment(this.props.id, message)
  }  

  private handlePostLike = (amount: number) => {
    this.props.handlePostLike(amount, this.props.id);
  }

  public render() {        
    return (                  
      <Accordion expanded={this.props.id === this.props.expandedPost} onChange={this.handleChange} className="container">
        <AccordionSummary>                          
            {this.props && this.postCard()}            
        </AccordionSummary>
        <AccordionDetails>            
          <Container>
            <List>
              {this.props.commentsStore.map((comment : Models.Comment) => {                  
                return (
                  <ListItem key={comment.id}>
                    <Comment {...comment}/>                  
                  </ListItem>
                )
              })}                            
            </List>
          </Container>
        </AccordionDetails>            
      </Accordion>      
    );
  }

  private postCard = () => {
    return (
      <Card className="container card">
        <CardContent>
          <Typography variant="h5">{this.props.title}</Typography>
          <Typography variant="h6">{this.props.description}</Typography>             
        </CardContent>
        <CardActions>
          <Like likes={this.props.likes} parentId={this.props.id} handleClick={this.handlePostLike}/>
          <ReplyBox handleSubmit={this.handleReplySubmit} text="New Top comment" color="primary"/>
        </CardActions>
      </Card>
    )
  }
}


const mapStateToProps = 
(state: ApplicationState) => ({
  board: state.boards ? state.boards.currentBoard : undefined,
  posts: state.posts?state.posts.posts:undefined,
  commentsStore: state.comments?state.comments.commentsStore.filter(c=>(c.isRootComment)):undefined,
  isLoading: state.posts?state.posts.isLoading:undefined,
  expandedPost: state.posts ? state.posts.expandedPost: false,
});

const mapDispatchToProps = 
{  
  requestComments: CommentsStore.actionCreators.requestComments,
  addComment: CommentsStore.actionCreators.addComment,
  addReply: CommentsStore.actionCreators.addReply,
  changeExpandedPost: PostsStore.actionCreators.changeExpandedPost,
  handlePostLike: PostsStore.actionCreators.handlePostLike,  
}

export default connect(
  mapStateToProps, // Selects which state properties are merged into the component's props
  mapDispatchToProps,  
)(Post as any);
