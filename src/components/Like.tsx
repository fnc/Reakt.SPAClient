import React from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'

type LikeProps = {
  parentId: number;
  likes: number;  
  handleClick(amount: number) : any;
}

class Like extends React.PureComponent<LikeProps> {  

  render() {
    return (
      <React.Fragment>
        <KeyboardArrowUp onClick={() => { this.props.handleClick(1) }} />
        {(this.props.likes ? this.props.likes : 0)}
        <KeyboardArrowDown onClick={() => { this.props.handleClick(-1) }}/>
      </React.Fragment>
    )
  }
}

export default Like;
