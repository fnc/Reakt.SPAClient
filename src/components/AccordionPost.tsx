import React from 'react'
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core'
import ReplyBox from './ReplyBox'
import * as Models from '../models/Models'
import Comment from './Comment'

export default function AccordionPost(title: string, description: string, comments: Models.Comment[], handleSubmit: any) {
  // Hooks! neat
  const [expanded, setExpanded] = React.useState('false')

  const handleChange = (panel: any) => (event: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  }
  // This isn't working :(
  return (
    <Accordion expanded={expanded === title}  onChange={handleChange(title)}>
      <AccordionSummary>              
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h6">{description}</Typography>   
        <ReplyBox handleSubmit={handleSubmit} text="New Top comment" color="primary"></ReplyBox>                            
      </AccordionSummary>
      <AccordionDetails>            
          {comments.map((comment : Models.Comment) => {                  
            return <Comment {...comment}/>                  
          })}              
      </AccordionDetails>            
    </Accordion>
  )
}