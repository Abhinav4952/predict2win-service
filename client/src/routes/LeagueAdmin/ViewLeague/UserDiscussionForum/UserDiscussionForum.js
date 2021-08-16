import { Card, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import { useEffect, useRef } from 'react';
import SendIcon from '@material-ui/icons/Send';
export default function UserDiscussionForum() {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);
  const otherUserMessage = (
    <Grid item xs={12} md={12} lg={12} style={{ marginRight: '75px' }}>
      <div className="px-0 d-flex flex-column">
        <Card>
          <CardContent>
            <Typography variant="body1">awefj waefwajef</Typography>
            <div className="d-flex w-100 justify-content-between">
              <Typography variant="body2" component="p">
                well meaning and kindly.
              </Typography>
              <Typography variant="caption" component="p">
                {new Date().toISOString().substring(0, 10)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </Grid>
  );

  const currrentUserMessage = (
    <Grid item xs={12} md={12} lg={12} style={{ marginLeft: '75px' }}>
      <div className="px-0 d-flex flex-column">
        <Card>
          <CardContent>
            <Typography variant="body1">awefj waefwajef</Typography>
            <div className="d-flex w-100 justify-content-between">
              <Typography variant="body2" component="p">
                well meaning and kindly.
              </Typography>
              <Typography variant="caption" component="p">
                {new Date().toISOString().substring(0, 10)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </Grid>
  );
  return (
    <div className="d-flex flex-column justify-content-between">
      <div
        className="p-2 scrollbar scrollbar-primary"
        style={{ maxHeight: '350px', overflowY: 'auto' }}
        ref={messagesEndRef}
      >
        <Grid container spacing={2} direction="column">
          {otherUserMessage}
          {currrentUserMessage}
          {otherUserMessage}
          {otherUserMessage}
          {otherUserMessage}
          {currrentUserMessage}
        </Grid>
      </div>
      <div className="my-1 p-2 d-flex justify-content-between w-100">
        <TextField id="input-with-icon-grid" label="Enter a message" className="w-100" />
        <SendIcon color="primary" style={{ margin: '15px 0' }} />
      </div>
    </div>
  );
}
