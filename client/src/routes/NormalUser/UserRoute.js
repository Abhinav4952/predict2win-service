import { Route, Switch } from 'react-router-dom';
import Navigation from '../../components/lib/Navigation/Navigation';
import LeagueDetails from './LeagueDetails/LeagueDetails';
import UserLeagueDashboard from './UserLeagueDashboard/UserLeagueDashboard';

export default function UserRoute() {
  const routes = [
    { url: '/', name: 'Leagues' },
    { url: '/join-league', name: 'My Leagues' },
  ];

  return (
    <>
      <Navigation routeDetails={routes} />
      <Switch>
        <Route exact path="/">
          <UserLeagueDashboard />
        </Route>
        <Route exact path="/view-league/:leagueId">
          <LeagueDetails />
        </Route>
      </Switch>
    </>
  );
}
