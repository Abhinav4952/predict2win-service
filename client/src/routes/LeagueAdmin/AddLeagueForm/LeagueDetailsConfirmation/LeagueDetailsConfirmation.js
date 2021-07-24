import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { ListItemIcon, Typography } from '@material-ui/core';
import './LeagueDetailsConfirmation.css';

export default function LeagueDetailsConfirmation({
  handleNext,
  handleBack,
  values: { leagueName, leagueCategory, endTime, leagueDescription, leagueIcon },
}) {
  const handleSubmit = () => {
    console.log(leagueIcon);
    console.log({ leagueName, leagueCategory, endTime, leagueDescription });
    handleNext();
  };
  return (
    <>
      <List disablePadding>
        <ListItem>
          <ListItemText primary="League Name" secondary={leagueName || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="League Category" secondary={leagueCategory || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="End Time" secondary={endTime || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemText primary="League Description" secondary={leagueDescription || '-'} />
        </ListItem>

        <Divider />

        <ListItem>
          <ListItemIcon>
            <div className="d-flex flex-column">
              <Typography variant="body1" component="span">
                League Icon
              </Typography>
              <img src={URL.createObjectURL(leagueIcon)} alt={leagueName} className="league-icon-upload"></img>
            </div>
          </ListItemIcon>
        </ListItem>

        <Divider />
      </List>

      <div style={{ display: 'flex', marginTop: 50, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="default" onClick={handleBack}>
          Back
        </Button>
        <Button style={{ marginLeft: 20 }} variant="contained" color="secondary" onClick={handleSubmit}>
          Confirm & Continue
        </Button>
      </div>
    </>
  );
}
