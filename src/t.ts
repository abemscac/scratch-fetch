export interface IHttpRequest {
    readonly url: string;
    readonly headers: StringKeyValueObject;
    readonly body: any;
    /** Set the url of the request */
    withUrl(value?: string): IHttpRequest;
    /** Replace the headers of the request with given value. Default headers will be included if useDefaultHeaders attribute is not set to false. */
    withHeaders(value: StringKeyValueObject): IHttpRequest;
    /** Set the body of the request. */
    withBody(value: any): IHttpRequest;
    /** Append given value to the headers of the request. */
    addHeaders(value: StringKeyValueObject): void;
    /** Patch the values in the headers of the request. (Only existed property will be patched) */
    patchHeaders(value: StringKeyValueObject): void;
    /** Remove header with given key. Return true if provided property eixsts, else return false. */
    removeHeader(key: string): boolean;
    execute(): Promise<HttpResponse>;
    abort(): void;
}
export interface IHttpRequestInitProperty {
    url?: string;
    headers?: StringKeyValueObject;
    body?: any;
    configuration?: IHttpRequestInitConfiguration;
}
export interface StringKeyValueObject {
    [x: string]: string
}
export interface IHttpRequestInitConfiguration {
    /** Default: true */
    useDefaultHeaders?: boolean;
    /** Default: true */
    stringifyBody?: boolean;
    /** Determine if the request can be sent multiple times before previous one is done. Default: false */
    allowMultiple?: boolean;
    /** Default: "include" */
    credentials: RequestCredentials;
}
export interface HttpResponse {
    ok: boolean;
    status?: number;
    isAborted: boolean;
    value: any;
    error: {}
}