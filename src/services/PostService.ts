import * as HttpClient from './HttpClient';
import * as ApiModels from './ApiModels';
import { BASE_URL } from '../constants/url';

export function getPosts(boardId: number, startRange?: number, endRange?: number, orderBy?: string, ascending?: boolean): Promise<ApiModels.Post[]> {
    let filters = HttpClient.createQueryFilters(startRange, endRange, orderBy, ascending);
    return HttpClient.get(`${BASE_URL}boards/${boardId}/posts`, filters)
        .then(response => response.json() as Promise<ApiModels.Post[]>);
};

export function getPost(postId: number): Promise<ApiModels.Post[]> {
    return HttpClient.get(`${BASE_URL}posts/${postId}`)
        .then(response => response.json() as Promise<ApiModels.Post[]>);
};

export function addPost(boardId: number, post: ApiModels.Post): Promise<ApiModels.Post> {
    return HttpClient.post(`${BASE_URL}boards/${boardId}/posts`, post)
        .then(response => response.json() as Promise<ApiModels.Post>);
};

export function deletePost(postId: number): Promise<ApiModels.Post[]> {
    return HttpClient.remove(`${BASE_URL}posts/${postId}`)
        .then(response => response.json() as Promise<ApiModels.Post[]>);
};

export function editTitle(postId: number, newTitle: string): Promise<ApiModels.Post> {
    return HttpClient.patchReplace(`${BASE_URL}posts/${postId}`, '/Tittle', newTitle)
        .then(response => response.json() as Promise<ApiModels.Post>);
};

export function editDescription(postId: number, newDescription: string): Promise<ApiModels.Post> {
    return HttpClient.patchReplace(`${BASE_URL}posts/${postId}`, '/Description', newDescription)
        .then(response => response.json() as Promise<ApiModels.Post>);
};