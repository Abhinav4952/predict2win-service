import jwt from 'jwt-decode';
import { Grid, TextField } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import SendIcon from '@material-ui/icons/Send';
import LeagueAdminApi from '../../../../api/LeagueAdminApi';
import Api from '../../../../api/Api';
import ErrorContainer from '../../../../components/lib/ErrorContainer/ErrorContainer';
import ProgressContainer from '../../../../components/lib/ProgressContainer/ProgressContainer';
import UserPostDetails from './UserPostDetails/UserPostDetails';

export default function UserDiscussionForum({ leagueId }) {
  const messagesEndRef = useRef(null);
  const [progress, setProgress] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const getLoggedInUserRoute = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    const user = jwt(token);
    return user;
  };

  const getPostDetails = async () => {
    try {
      setProgress(true);
      const postRequest = LeagueAdminApi.getPosts(leagueId);
      const postsDetails = await Api.performRequest(postRequest);
      const loggedInUserDetails = getLoggedInUserRoute();
      console.log(postsDetails);
      const updatedPostDetails = postsDetails?.data?.map(ele => {
        const { post, _id, created, userDetails } = ele;
        return {
          postId: _id,
          post: post,
          createdDate: created,
          username: userDetails.username,
          userId: userDetails._id,
          isCurrentUser: loggedInUserDetails?.id === userDetails._id,
        };
      });
      setPosts(updatedPostDetails);
      setProgress(false);
      setError();
    } catch (err) {
      console.log(err);
      setError('unable to fetch posts for this league');
    }
  };

  const getHandlerContainer = () => {
    if (error) {
      return <ErrorContainer text={error} />;
    }
    return <ProgressContainer />;
  };

  const postsContainer = posts.map(ele => <UserPostDetails {...ele} />);

  useEffect(() => {
    scrollToBottom();
    setProgress(true);
    getPostDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column justify-content-between">
      <div
        className="p-2 scrollbar scrollbar-primary"
        style={{ maxHeight: '350px', overflowY: 'auto' }}
        ref={messagesEndRef}
      >
        {progress && !posts.length ? (
          getHandlerContainer()
        ) : (
          <Grid container spacing={2} direction="column">
            {postsContainer}
          </Grid>
        )}
      </div>
      {progress ? null : (
        <div className="my-1 p-2 d-flex justify-content-between w-100">
          <TextField id="input-with-icon-grid" label="Enter a message" className="w-100" />
          <SendIcon color="primary" style={{ margin: '15px 0' }} />
        </div>
      )}
    </div>
  );
}
