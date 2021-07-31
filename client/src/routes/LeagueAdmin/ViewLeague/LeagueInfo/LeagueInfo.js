import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { ListItemIcon } from '@material-ui/core';
import './LeagueInfo.css';

export default function LeagueInfo({ name, leagueCategory, expiryDate, description, image }) {
  const arrayBufferToBase64 = buffer => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  return (
    <List disablePadding>
      <ListItem>
        <ListItemText primary="League Name" secondary={name || '-'} />
      </ListItem>

      <Divider />

      <ListItem>
        <ListItemText primary="League Category" secondary={leagueCategory || '-'} />
      </ListItem>

      <Divider />

      <ListItem>
        <ListItemText primary="End Time" secondary={expiryDate || '-'} />
      </ListItem>

      <Divider />

      <ListItem>
        <ListItemText primary="League Description" secondary={description || '-'} />
      </ListItem>

      <Divider />

      <ListItem className="d-flex flex-column justify-content-start align-items-start">
        <ListItemText primary="League Icon" />
        <ListItemIcon>
          <div>
            {image ? (
              <img
                src={`data:image/png;base64,${arrayBufferToBase64(image?.data?.data)}`}
                alt={name}
                className="league-icon-upload"
              ></img>
            ) : null}
          </div>
        </ListItemIcon>
      </ListItem>

      <Divider />
    </List>
  );
}
