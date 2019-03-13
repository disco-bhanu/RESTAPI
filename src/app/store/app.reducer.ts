import { Action } from '@ngrx/store';

import * as AppActions from './app.actions';
import { APIModel } from '../shared/services.model';
import { HeadersModel } from '../shared/headers.model';

export interface State {
  services: APIModel[];
  favHeaders: HeadersModel[];
  selectedService: {};
  overrideHost: {check: boolean, hostname: string};
}

const initState: State = {
  services: [],
  favHeaders: [],
  selectedService: {sysid: 0, srvid: 0},
  overrideHost: {check: false, hostname: 'initial'}
};

export function appReducer(
  state = initState,
  action: AppActions.AppActions
) {
  switch (action.type) {
    case AppActions.API_LIST:
      return {
        ...state,
        services: [...state.services, ...action.payload]
      };
    case AppActions.FAV_HEADERS:
      return {
        ...state,
        favHeaders: [...state.favHeaders, ...action.payload]
      };
    case AppActions.SELECTED_SERVICE:
      return {
        ...state,
        selectedService: {...action.payload}
      };
    case AppActions.OVERRIDE_HOST:
      return {
        ...state,
        overrideHost: {...action.payload}
      };
    default:
      return state;
  }
}
