import React from 'react'
import { Input, Button } from '@material-ui/core'
import { EMPTY_COMMENT_ALERT } from '../constants/alerts'

interface ReplyBoxProps {
  handleSubmit(message: string): any;
  text: string;
  color: "primary" | "secondary" | "inherit" | "default";
}

interface IReplyBoxState {
  message: string;    
  showThyself: boolean;
}

class ReplyBox extends React.PureComponent<ReplyBoxProps, IReplyBoxState> {
  constructor(props: ReplyBoxProps) {
    super(props) 
    this.state = {
      message: "Write your reply here!",     
      showThyself: false,   
    };
  }

  private handleReplyChange = (value : string) => {        
    this.setState({
      message: value      
    })
  }

  private toggleShowReplyBox = () => {
    this.setState(prevState =>({
      showThyself: !prevState.showThyself      
    }))
  }

  public render() {
    return (
      <React.Fragment>
        <Button onClick={this.toggleShowReplyBox} color={this.props.color}>{this.props.text}</Button>        
        {this.state && this.state.showThyself && this.renderReplyBox()}
      </React.Fragment>
    )
  }

  private checkAndHandleSubmit = () => {    
    if (this.state.message !== "") {
      this.props.handleSubmit(this.state.message);
      this.toggleShowReplyBox();
      this.setState({
        message: "",
      })
    } else {      
      alert(EMPTY_COMMENT_ALERT);
    }
  }

  private renderReplyBox() {
    return (
      <form>
        <Input defaultValue={this.state.message} onChange={e => this.handleReplyChange(e.target.value)} required={true}></Input>
        <Button color="secondary" onClick={this.checkAndHandleSubmit}>Reply!</Button>
      </form>      
    )
  }
}

export default ReplyBox;