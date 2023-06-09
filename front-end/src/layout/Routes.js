import React from "react";

import { Redirect, Route, Switch, useLocation , useParams } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NewReservation from "../routes/NewReservation";
import NewTable from "../tables/NewTable";
import AssignSeat from "../tables/AssignSeat";
import NotFound from "./NotFound";
import Search from "../routes/Search";
import { today } from "../utils/date-time";
import EditReservation from "../routes/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  function useQuery() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    return params.get("date") ? params.get("date") : today();
  }

const {reservation_id} = useParams();

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable/>
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <AssignSeat reservation_id={reservation_id}/>
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation reservation_id={reservation_id}/>
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={useQuery()} />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
