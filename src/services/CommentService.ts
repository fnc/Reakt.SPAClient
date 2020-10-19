import * as HttpClient from './HttpClient';
import * as ApiModels from './ApiModels';
import { BASE_URL } from '../constants/url';

export function getComments(postId: number, startRange?: number, endRange?: number ): Promise<ApiModels.Comment[]> {
    let filters = new Map<string, string>();
    if (startRange) { filters.set("startRange", startRange.toString()); }
    if (endRange) { filters.set("endRange", endRange.toString()); }
    return HttpClient.get(`${BASE_URL}posts/${postId}/comments`, filters)
        .then(response => response.json() as Promise<ApiModels.Comment[]>);
};

export function addComment(postId: number, comment: ApiModels.NewComment ): Promise<ApiModels.Comment> {
    return HttpClient.post(`${BASE_URL}posts/${postId}/comments`, comment)
    .then(response => response.json() as Promise<ApiModels.Comment>);
};

export function getReplies(commentId: number, startRange?: number, endRange?: number ): Promise<ApiModels.Comment[]> {
    let filters = new Map<string, string>();
    if (startRange) { filters.set("startRange", startRange.toString()); }
    if (endRange) { filters.set("endRange", endRange.toString()); }
    return HttpClient.get(`${BASE_URL}comments/${commentId}/replies`, filters)
    .then(response => response.json() as Promise<ApiModels.Comment[]>)
};

export function addReply(commentId: number, reply: ApiModels.Reply ): Promise<ApiModels.Comment> {
    return HttpClient.post(`${BASE_URL}comments/${commentId}/replies`, reply)
    .then(response => response.json() as Promise<ApiModels.Comment>);
};

export async function likeAComment(amount: number, commentId: number): Promise<ApiModels.Comment> {
  // TODO: amount right now is no doing anything since the server upvotes all comments. 
  const response = await HttpClient.patchReplace(`${BASE_URL}comments/${commentId}/like`, "likes", 1);
  return await (response.json() as Promise<ApiModels.Comment>);
}