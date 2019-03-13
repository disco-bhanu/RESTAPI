import { Action } from '@ngrx/store';
import { APIModel } from '../shared/services.model';
import { HeadersModel } from '../shared/headers.model';

export const API_LIST = 'API_LIST';
export const FAV_HEADERS = 'FAV_HEADERS';
export const SELECTED_SERVICE = 'SELECTED_SERVICE';

export class APIList implements Action {
  readonly type = API_LIST;
  constructor(public payload: APIModel[]) {}
}

export class FavHeaders implements Action {
  readonly type = FAV_HEADERS;
  constructor(public payload: HeadersModel[]) {}
}

export class SelectedService implements Action {
  readonly type = SELECTED_SERVICE;
  constructor(public payload: any) {}
}

export type AppActions = APIList | FavHeaders | SelectedService;
