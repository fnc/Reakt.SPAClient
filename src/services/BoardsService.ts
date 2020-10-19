import * as HttpClient from './HttpClient';
import { BASE_URL } from '../constants/url';
import * as ApiModels from './ApiModels';

export async function getBoards() : Promise<ApiModels.Board[]> {
  // TODO: fix this url on the backend and later here
  const response = await HttpClient.get(`${BASE_URL}`);
  return await (response.json() as Promise<ApiModels.Board[]>);
}