import jwt from 'jwt-decode';
import { Grid, TextField } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import SendIcon from '@material-ui/icons/Send';
import LeagueAdminApi from '../../../../api/LeagueAdminApi';
import Api from '../../../../api/Api';
import ErrorContainer from '../../../../components/lib/ErrorContainer/ErrorContainer';
import ProgressContainer from '../../../../components/lib/ProgressContainer/ProgressContainer';
import UserPostDetails from '../../../../components/lib/UserPostDetails/UserPostDetails';
import io from 'socket.io-client';

export default function UserDiscussionForum({ leagueId }) {
  const messagesEndRef = useRef(null);
  const [progress, setProgress] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState();
  const [disableSendIcon, setDisableSendIcon] = useState(false);
  const [post, setNewPost] = useState(false);

  const scrollToBottom = () => {
    if(messagesEndRef?.current){
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getLoggedInUserRoute = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }
    const user = jwt(token);
    return user;
  };

  const addPost = async () => {
    try {
      if (disableSendIcon) {
        return;
      }
      setDisableSendIcon(true);
      const loggedInUserDetails = getLoggedInUserRoute();
      const postRequest = LeagueAdminApi.createPost({
        leagueId,
        userId: loggedInUserDetails?.id,
        post,
      });
      const postResponse = await Api.performRequest(postRequest);
      console.log(postResponse);
      const responseDetails = postResponse?.data;
      if(!responseDetails){
        return;
      }
      const updatedPostDetail = {
        postId: responseDetails._id,
        post: responseDetails.post,
        createdDate: responseDetails.created,
        username: loggedInUserDetails?.username || "",
        userId: loggedInUserDetails?.id,
        isCurrentUser: true
      };
      setPosts([...posts, updatedPostDetail])
      setNewPost('');
      setDisableSendIcon(false);
    } catch (err) {
      setDisableSendIcon(false);
      console.log(err);
    }
  };

  const getModelledPosts = (intialPost) => {
      if(!intialPost?.length){
        return [];
      }
      const loggedInUserDetails = getLoggedInUserRoute();
      return intialPost.map(ele => {
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
  }

  const getPostDetails = async () => {
    try {
      setProgress(true);
      if(!leagueId){
        return;
      }
      const postRequest = LeagueAdminApi.getPosts(leagueId);
      const postsDetails = await Api.performRequest(postRequest);
      const updatedPostDetails = getModelledPosts(postsDetails?.data);
      setPosts(updatedPostDetails);
      setProgress(false);
      setTimeout(() => scrollToBottom())
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
    if(!progress && posts.length){
      return <ErrorContainer text="no posts added in league" />;
    }
    return <ProgressContainer />;
  };

  const postsContainer = posts.map(ele => <UserPostDetails {...ele} />);

  useEffect(() => {
    scrollToBottom();
    setProgress(true);
    getPostDetails();
    const socket = io('http://localhost:5000', { transports : ['websocket'] });
    console.log(socket);

    const interval = setInterval(() => {
      if (socket) socket.emit('push message', leagueId);
    },5000); 
    socket.on('posts list', msg => {
      const postsfromSocket = getModelledPosts(msg)
      setPosts(postsfromSocket);
      return null;
    });
    return () => {
      if(socket) socket.disconnect();
      if(interval) clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column justify-content-between">
      <div
        className="p-2 scrollbar scrollbar-primary"
        style={{ maxHeight: '350px', overflowY: 'auto' }}
      >
        {progress && !posts.length ? (
          getHandlerContainer()
        ) : (
        <Grid container spacing={2} direction="column" ref={messagesEndRef}> 
            {postsContainer}
          </Grid>
        )}
      </div>
      {progress ? null : (
        <div className="my-1 p-2 d-flex justify-content-between w-100">
          <TextField
            id="input-with-icon-grid"
            label="Enter a message"
            className="w-100"
            value={post || ''}
            onChange={e => setNewPost(e.target.value)}
            disabled={disableSendIcon}
          />
          <div onClick={addPost} style={{opacity: disableSendIcon ? 0.5 : 1, cursor: "pointer"}}>
            <SendIcon color="primary" style={{ margin: '15px 0' }} />  
          </div>
          {disableSendIcon}
        </div>
      )}
    </div>
  );
}
