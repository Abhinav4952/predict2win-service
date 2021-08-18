import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import './UserPostDetails.css';

export default function UserPostDetails({ post, createdDate, username, isCurrentUser }) {
  return (
    <Grid item xs={12} md={12} lg={12} className={isCurrentUser ? 'current-user-post' : 'other-user-post'}>
      <div className="px-0 d-flex flex-column">
        <Card>
          <CardContent>
            <Typography variant="body1 " component="p">
                {post}
              </Typography>
            <div className="d-flex w-100 justify-content-between">
              <Typography variant="caption">- {username}</Typography>
              <Typography variant="caption" component="p">
                {moment(createdDate).format('LL')}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </Grid>
  );
}
