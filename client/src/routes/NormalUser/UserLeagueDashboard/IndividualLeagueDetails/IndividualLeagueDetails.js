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

export default function IndividualLeagueDetails({ name, description, _id, image, leagueStatus, participationStatus }) {
  const history = useHistory();

  const viewDetails = () => history.push(`/view-league/${_id}`);

  const getRegisteredMessage = () => {
    if(participationStatus?.userParticipationStatus === UserParticipationStatus.Registered){
      return "Registered";
    }
    return;

  }

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
        <Button size="small" variant="outlined" color="primary">
          View Details
        </Button>

        {leagueStatus === LeagueStatus.RegistrationOpen ? (<Button size="small" variant="outlined" color="primary" disabled={getRegisteredMessage()}>
          {getRegisteredMessage() || "Register"}
        </Button>): null}
      </CardActions>
    </Card>
  );
}
