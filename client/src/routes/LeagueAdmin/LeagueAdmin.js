import { Route } from 'react-router-dom';
import comingSoon from '../../assets/comingSoon.jpg';
import Navigation from '../../components/lib/Navigation/Navigation';
import AddLeague from './AddLeague/AddLeague';
import AddLeagueForm from './AddLeagueForm/AddLeagueForm';
import LeagueAdminHome from './LeagueAdminHome/LeagueAdminHome';
import ViewLeague from './ViewLeague/ViewLeague';

export default function LeagueAdmin() {
  const routes = [
    { url: '/', name: 'Home' },
    { url: '/add-league', name: 'Add League' },
  ];
  return (
    <>
      <Navigation routeDetails={routes} />
      <Route exact path="/">
        <LeagueAdminHome />
      </Route>
      <Route exact path="/add-league">
        {/* <div className="d-flex justify-content-between align-items-center align-content-center flex-column">
          <img src={comingSoon} alt="" style={{ width: '100%' }} />
        </div> */}
        <AddLeagueForm />
      </Route>
      <Route exact path="/view-league/:leagueId">
        {/* <div className="d-flex justify-content-between align-items-center align-content-center flex-column">
          <img src={comingSoon} alt="" style={{ width: '100%' }} />
        </div> */}
        <ViewLeague />
      </Route>
      <Route exact path="/add-league-test">
        <AddLeague />
      </Route>
    </>
  );
}
