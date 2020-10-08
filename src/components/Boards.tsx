import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as Models from '../models/Models'
import { Link as RouterLink } from 'react-router-dom';
import * as BoardsStore from '../store/Boards'
import { Card, CardContent, Typography, List, ListItem, Container, Link } from '@material-ui/core'

// At runtime, Redux will merge together...
type BoardsProps =
  BoardsStore.BoardsState // ... state we've requested from the Redux store
  & typeof BoardsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

class Boards extends React.PureComponent<BoardsProps> {  

  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched();
  }

  // This method is called when the route parameters change
  public componentDidUpdate() {
    this.ensureDataFetched();
  }

  public render() {
    return (
      <React.Fragment>
        {this.renderBoardsTable()}        
      </React.Fragment>
    );
  }

  private ensureDataFetched() {    
    this.props.requestBoards();
  }

  private renderBoardsTable() {
    return (
      <List>      
        {this.props.boards.map((board: Models.Board) => 
          <ListItem key={board.id}>
            {this.displayBoardItem(board.id, board.title, board.description)}
          </ListItem>
        )}
      </List>                 
    );
  }

  private handleBoardClick(id: number) {              
    let board = this.props.boards.find(b => b.id === id);
    this.props.setCurrentBoard(board ? board : { id: 0, title: "", description: ""});
  }
  
  private displayBoardItem = (id: number, title: string, description: string) => { 
    return (        
      <Container>
        <Card>
          <CardContent>
            <Link component={RouterLink} to='/board'  onClick={() => this.handleBoardClick(id)}><Typography variant="h4">{title}</Typography></Link>
            <Typography variant="h6">{description}</Typography>          
          </CardContent>
        </Card>             
      </Container>                            
    )
  }  

  // private renderPagination() {
  //   const prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
  //   const nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

  //   return (
  //     <div className="d-flex justify-content-between">
  //       <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${prevStartDateIndex}`}>Previous</Link>
  //       {this.props.isLoading && <span>Loading...</span>}
  //       <Link className='btn btn-outline-secondary btn-sm' to={`/fetch-data/${nextStartDateIndex}`}>Next</Link>
  //     </div>
  //   );
  // }
}

export default connect(
  (state: ApplicationState) => state.boards, // Selects which state properties are merged into the component's props
  BoardsStore.actionCreators // Selects which action creators are merged into the component's props
)(Boards as any);

