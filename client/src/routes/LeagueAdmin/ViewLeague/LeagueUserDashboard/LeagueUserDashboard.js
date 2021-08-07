import moment from 'moment';
import { AppBar, Box, Grid, Tab, Tabs, Typography, useTheme } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import Api from '../../../../api/Api';
import LeagueAdminApi from '../../../../api/LeagueAdminApi';
import UserListBootstrap from './UserListBootstrap/UserListBootstrap';
import ProgressContainer from '../../../../components/lib/ProgressContainer/ProgressContainer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function LeagueUserDashboard() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [progress, setProgress] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, seterror] = useState();
  const [participantsList, setparticipantsList] = useState([]);
  const params = useParams();

  const participantsColData = [
    { dataField: 'id', text: 'S No', sort: true },
    { dataField: 'name', text: 'Name', sort: true },
    { dataField: 'registeredDate', text: 'Registered Date', sort: true },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  const getParticipantsList = async () => {
    try {
      setProgress(true);
      const participantsRequest = LeagueAdminApi.getParticipantsByLeagueId(params.leagueId);
      const participantsResponse = await Api.performRequest(participantsRequest);
      console.log(participantsResponse?.data);
      if (!participantsResponse?.data.length) {
        setparticipantsList([]);
        setProgress(false);
        return;
      }
      const updatedParticipantsList = participantsResponse?.data.map((ele, index) => {
        return {
          id: index,
          name: ele?.userDetails?.username,
          registeredDate: moment(ele?.created).format('MMM Do YYYY, h:mm a'),
        };
      });
      console.log(updatedParticipantsList);
      setparticipantsList(updatedParticipantsList);
      setProgress(false);
    } catch (err) {
      setProgress(false);
      seterror(err);
      console.log(err);
    }
  };

  useEffect(() => {
    getParticipantsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Participants" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container spacing={3} justifyContent="center" alignContent="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} style={{ height: '400px', width: '100%' }}>
              {!progress && participantsList.length ? (
                <UserListBootstrap data={participantsList} colData={participantsColData} />
              ) : (
                <ProgressContainer />
              )}
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
      </SwipeableViews>
    </>
  );
}
