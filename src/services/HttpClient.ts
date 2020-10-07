export function get(url: string, filters?: Map<string, any>): Promise<Response> {
    if(filters){
        url = url + "?";
        filters.forEach((value,key)=>url+key+"="+value+"&");
    }
    return fetch(url);
};

export function post(url: string, payload: any): Promise<Response> {
    return fetch(url,
        {
            method: 'POST',
            body: payload
        });
}

export function patchReplace(url: string, path: string, value: any): Promise<Response> {
    return fetch(url,
        {
            method: 'PATCH',
            body: JSON.stringify(
                [{
                    op: 'replace',
                    path: path,
                    value: value
                }
                ])
        });
}