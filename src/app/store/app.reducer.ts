import * as AppActions from './app.actions';
import { APIModel } from '../models/services.model';
import { HeadersModel } from '../models/headers.model';

export interface State {
  services: APIModel[];
  favHeaders: HeadersModel[];
  selectedService: {};
  overrideHost: { current: boolean; all: boolean; hostname: string };
  sideDrawer: boolean;
  activeTabIndex: number;
  servers: object[];
  saveService: any;
  notification: { type: string; message: string; show: boolean };
}

const initState: State = {
  services: [],
  favHeaders: [],
  selectedService: {sysId: null, srvId: null, srvName: null},
  overrideHost: { current: false, all: false, hostname: '' },
  sideDrawer: true,
  activeTabIndex: 0,
  servers: [],
  saveService: {},
  notification: { type: null, message: null, show: false }
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
    case AppActions.SAVE_SERVICE:
      return {
        ...state,
        saveService: action.payload
      };
    case AppActions.NOTIFICATION:
      console.log('notificaton');
      return {
        ...state,
        notification: action.payload
      };
    default:
      return state;
  }
}
