import * as HttpClient from './HttpClient';
import * as ApiModels from './ApiModels';
import { BASE_URL } from '../constants/url';

export function getBoards(startRange?: number, endRange?: number, orderBy?: string, ascending?: boolean): Promise<ApiModels.Board[]> {
    let filters = HttpClient.createQueryFilters(startRange, endRange, orderBy, ascending);
    return HttpClient.get(`${BASE_URL}boards`, filters)
        .then(response => response.json() as Promise<ApiModels.Board[]>);
};

export function getBoard(boardId: number): Promise<ApiModels.Board[]> {
    return HttpClient.get(`${BASE_URL}boards/${boardId}`)
        .then(response => response.json() as Promise<ApiModels.Board[]>);
};