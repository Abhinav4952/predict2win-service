import { Route } from 'react-router-dom';
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
        <AddLeagueForm />
      </Route>
      <Route exact path="/view-league/:leagueId">
        <ViewLeague />
      </Route>
      <Route exact path="/add-league-test">
        <AddLeague />
      </Route>
    </>
  );
}
