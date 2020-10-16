import React from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'

// TODO: this wont work with posts! 
type LikeProps = {
  commentId: number;
  likes: number;  
}

class Like extends React.PureComponent<LikeProps> {

  private handleClick = (amount: number) => {

  }

  render() {
    return (
      <React.Fragment>
        <KeyboardArrowUp onClick={() => { this.handleClick(1) }} />
        {this.props.likes}
        <KeyboardArrowDown onClick={() => { this.handleClick(-1) }}/>
      </React.Fragment>
    )
  }
}

export default Like;
