import jwt from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import UserParticipationStatus from '../../../../helpers/enums/UserParticipationStatus';
import LeagueStatus from '../../../../helpers/enums/LeagueStatus';
import { LinearProgress } from '@material-ui/core';
import { useState } from 'react';
import UserApi from '../../../../api/UserApi';
import Api from '../../../../api/Api';

export default function IndividualLeagueDetails({
  name,
  description,
  _id,
  image,
  leagueStatus,
  participationStatus,
  updateLeagues,
}) {
  const history = useHistory();
  const [registering, setRegistering] = useState(false);

  const viewDetails = () => history.push(`/view-league/${_id}`);

  const getRegisteredMessage = () => {
    if (
      [
        UserParticipationStatus.Registered,
        UserParticipationStatus.QuestionsAnswered,
        UserParticipationStatus.Closed,
      ].includes(participationStatus?.userParticipationStatus)
    ) {
      return 'Registered';
    }
    return;
  };

  const registerForLeague = async () => {
    try {
      setRegistering(true);
      const token = localStorage.getItem('authToken');
      const user = jwt(token);
      const registerRequest = UserApi.register({
        userId: user?.id,
        leagueId: _id,
      });
      const registerResponse = await Api.performRequest(registerRequest);
      console.log(registerResponse);
      const leagueDetails = await Api.performRequest(UserApi.getAllLeagues());
      updateLeagues(leagueDetails?.data);
      setRegistering(false);
    } catch (err) {
      setRegistering(false);
      console.log(err);
    }
  };

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={`data:image/png;base64,${image?.data}`}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className="d-flex justify-content-end w-100">
        <Button size="small" variant="outlined" color="primary" onClick={viewDetails}>
          View Details
        </Button>

        {leagueStatus === LeagueStatus.RegistrationOpen ? (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={registerForLeague}
            disabled={getRegisteredMessage() || registering}
          >
            {getRegisteredMessage() || 'Register'}
          </Button>
        ) : null}
        {leagueStatus === LeagueStatus.RegistrationClosed && getRegisteredMessage() ? (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={registerForLeague}
            disabled={getRegisteredMessage() || registering}
          >
            {getRegisteredMessage()}
          </Button>
        ) : null}
      </CardActions>
      {registering ? <LinearProgress /> : null}
    </Card>
  );
}
