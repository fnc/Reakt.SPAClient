export function get(url: string, filters?: Map<string, any>): Promise<Response> {
    if (filters) {
        url = url + "?";
        filters.forEach((value, key) => url + key + "=" + value + "&");
    }
    return fetch(url);
};

export function post(url: string, payload: any): Promise<Response> {
    return fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(payload),
            //mode: 'no-cors',
            headers: {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': 'localhost:3000',
                'Content-Type': 'application/json',
            },
        });
}

export function remove(url: string): Promise<Response> {
    return fetch(url,
        {
            method: 'DELETE',
            headers: {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': 'localhost:3000',
                'Content-Type': 'application/json',
            },
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
                ]),
            headers: {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': 'localhost:3000',
                'Content-Type': 'application/json',
            }
        });
}

export function createQueryFilters(startRange?: number, endRange?: number, orderBy?: string, ascending?: boolean): Map<string, string> {
    let filters = new Map<string, string>();
    if (startRange) { filters.set("startRange", startRange.toString()); }
    if (endRange) { filters.set("endRange", endRange.toString()); }
    if (orderBy) { filters.set("orderBy", orderBy.toString()); }
    if (ascending) { filters.set("ascending", ascending.toString()); }
    return filters;
}