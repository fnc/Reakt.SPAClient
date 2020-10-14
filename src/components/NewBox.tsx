import { Button, Input } from '@material-ui/core';
import React from 'react';
import { EMPTY_TITLE_ALERT } from '../constants/alerts';

interface NewBoxProps {  
  handleSubmit(title: string, description: string): any;
  text: string;
  color: "primary" | "secondary" | "inherit" | "default";
}

interface INewBoxState {
  title: string;    
  description: string;
  showThyself: boolean;
}

class NewBox extends React.PureComponent<NewBoxProps, INewBoxState> {
  constructor(props: NewBoxProps) {    
    super(props) 
    this.state = {
      title: "",    
      description: "", 
      showThyself: false,   
    };
  }

  private handleReplyChange = (key: string, value: any) => {
    this.setState({
      [key]: value
    } as Pick<INewBoxState, keyof INewBoxState>)  
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
    if (this.state.title !== "" && this.state.description) {
      this.props.handleSubmit(this.state.title, this.state.description);
      this.toggleShowReplyBox();
      this.setState({
        title: "",
        description: ""
      })
    } else {      
      alert(EMPTY_TITLE_ALERT);
    }
  }

  private renderReplyBox() {
    return (
      <form>
        <Input id="title" defaultValue="Insert title" onChange={e => this.handleReplyChange(e.target.id, e.target.value)} required={true}></Input>
        <Input id="description" defaultValue="Insert description" onChange={e => this.handleReplyChange(e.target.id, e.target.value)} required={true}></Input>        
        <Button color="secondary" onClick={this.checkAndHandleSubmit}>Create</Button>
      </form>      
    )
  }
}

export default NewBox;