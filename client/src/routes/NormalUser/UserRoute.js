import { Route, Switch } from 'react-router-dom';
import comingSoon from '../../assets/comingSoon.jpg';
import Navigation from '../../components/lib/Navigation/Navigation';
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
          {/* <div className="d-flex justify-content-between align-items-center align-content-center flex-column">
            <img src={comingSoon} alt="" style={{ width: '100%' }} />
          </div> */}
          <UserLeagueDashboard />
        </Route>
        <Route exact path="/view-league/:leagueId">
          <div className="d-flex justify-content-between align-items-center align-content-center flex-column">
            <img src={comingSoon} alt="" style={{ width: '100%' }} />
          </div>
        </Route>
      </Switch>
    </>
  );
}
