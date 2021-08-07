import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';

export default function LeagueAdditionalInformation({
  leagueCategory,
  expiryDate,
  slots,
  image,
  leagueStatus,
  userDetails,
}) {
  return (
    <List disablePadding>
      <ListItem>
        <ListItemText primary="League category" secondary={leagueCategory || '-'} />
      </ListItem>

      <Divider />

      <ListItem>
        <ListItemText primary="Slots left" secondary={slots || '-'} />
      </ListItem>

      <ListItem>
        <ListItemText primary="League status" secondary={leagueStatus || '-'} />
      </ListItem>

      <Divider />

      <ListItem>
        <ListItemText primary="Ends on" secondary={moment(expiryDate).format('LLL')} />
      </ListItem>

      <Divider />

      {userDetails ? (
        <ListItem>
          <ListItemText primary="Host" secondary={`${userDetails?.firstName} ${userDetails?.lastName}` || '-'} />
        </ListItem>
      ) : null}
    </List>
  );
}
