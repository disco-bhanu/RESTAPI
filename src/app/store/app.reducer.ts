import * as AppActions from './app.actions';
import { APIModel } from '../shared/services.model';
import { HeadersModel } from '../shared/headers.model';

export interface State {
  services: APIModel[];
  favHeaders: HeadersModel[];
  selectedService: {};
  overrideHost: {check: boolean, hostname: string};
  sideDrawer: boolean;
  activeTabIndex: number;
  servers: object[];
}

const initState: State = {
  services: [],
  favHeaders: [],
  selectedService: {sysId: null, srvId: null, srvName: null},
  overrideHost: {check: false, hostname: 'initial'},
  sideDrawer: true,
  activeTabIndex: 0,
  servers: []
};

export function appReducer(
  state = initState,
  action: AppActions.AppActions
) {
  switch (action.type) {
    case AppActions.API_LIST:
      return {
        ...state,
        services: [...action.payload]
      };
    case AppActions.FAV_HEADERS:
      return {
        ...state,
        favHeaders: [...action.payload]
      };
    case AppActions.SELECTED_SERVICE:
      return {
        ...state,
        selectedService: {...state.selectedService, ...action.payload}
      };
    case AppActions.OVERRIDE_HOST:
      return {
        ...state,
        overrideHost: {...action.payload}
      };
    case AppActions.SIDE_DRAWER:
      return {
        ...state,
        sideDrawer: !state.sideDrawer
      };
    case AppActions.ACTIVE_TAB_INDEX:
      return {
        ...state,
        activeTabIndex: action.payload
      };
    case AppActions.SERVERS_LIST:
      return {
        ...state,
        servers: [...state.servers, ...action.payload]
      };
    default:
      return state;
  }
}
