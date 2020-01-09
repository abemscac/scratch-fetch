import {
    IHttpRequest,
    IHttpRequestInitProperty,
    StringKeyValueObject,
    HttpResponse
} from "./t";

const isInDevMode = () => (!process.env.NODE_DEV || process.env.NODE_ENV === "development");

export const buildQueryString = (params: StringKeyValueObject) => {
    let result = "";
    for(const key in params) {
        const value = params[key];
        if (value !== null && value !== undefined && value !== "") {
            if (Array.isArray(value)) {
                for(let i=0; i<value.length; i++) {
                    result += `&${key}=${value[i]}`
                }
            }
            else {
                result += `&${key}=${value}`
            }
        }
    }
    if (result) {
        result = result.substring(1);
    }
    return `${result}`;
};

const statusCodes = {
    noContent: 204,
};
const stringifyBody = (value: any) => typeof(value) === "string" ? value : (value === null || value === undefined) ? null : JSON.stringify(value);

const getDefaultHeaders = () => ({
    "Accept": "application/json",
    "Content-Type": "application/json",
});
const handleResponse = async (response: Response): Promise<HttpResponse> => {
    const _isInDevMode = isInDevMode();
    const result = {
        ok: response.ok,
        status: response.status,
        isAborted: false,
        response: undefined,
        error: {}
    };
    if (response.ok) {
        let json = null;
        try {
            json = (response.status === statusCodes.noContent) ? null : await response.json();
            result.response = json;
        }
        catch (error) {
            // JSON error
            result.error = error || {};
        }
        return result;
    }
    else {
        let error = null;
        try {
            error = await response.json() || {};
        }
        catch(err) {
            error = err;
        }
        _isInDevMode && console.error(error);
        result.error = error || {};
        return result;
    }
};
/** 
 * @param {Error} error 
 * @returns {HttpResponse}
 */
const catchError = (error: Error) => {
    const isAborted = (error.name === "AbortError");
    !isAborted && isInDevMode() && console.error(error);
    return {
        ok: false,
        status: undefined,
        isAborted,
        response: undefined,
        error
    };
};

class HttpRequest implements IHttpRequest {
    private _controller: AbortController;
    private _abort: () => void;
    private _url: string;
    private _requestInit: RequestInit;
    private _useDefaultHeaders: boolean;
    private _stringifyBody: boolean;
    private _allowMultiple: boolean;
    private _isProcessing: boolean;

    constructor(method?: string, props?: IHttpRequestInitProperty) {
        this._controller = new AbortController();
        this._abort = this._controller.abort.bind(this._controller);
        this._url = (props?.url || "");
        this._useDefaultHeaders = (props?.configuration?.useDefaultHeaders === undefined ? true : Boolean(props?.configuration?.useDefaultHeaders));
        this._stringifyBody = (props?.configuration?.stringifyBody === undefined ? true : Boolean(props?.configuration?.stringifyBody));
        this._allowMultiple = props?.configuration?.allowMultiple || false;
        this._isProcessing = false;
        this._requestInit = {
            mode: "cors",
            method: method,
            headers: props?.headers,
            body: (props?.configuration?.stringifyBody === undefined || props?.configuration.stringifyBody ? stringifyBody(props?.body) : props?.body),
            signal: this._controller.signal
        };
    }

    public withUrl(value: string): HttpRequest {
        this._url = value;
        return this;
    };

    public withHeaders(value: StringKeyValueObject) {
        this._requestInit.headers = {
            ...(this._useDefaultHeaders ? getDefaultHeaders() : {}),
            ...value
        };
        return this;
    };

    public withBody(value: any) {
        this._requestInit.body = (this._stringifyBody ? stringifyBody(value) : value);
        return this;
    };

    public addHeaders(value: StringKeyValueObject) {
        this._requestInit.headers = {
            ...this._requestInit.headers,
            ...value
        };
    };

    public async execute() {
        if (!this._allowMultiple && this._isProcessing) {
            isInDevMode() && console.warn(`A httpRequest instance can only send one request at the same time. If you wish to remove this constraint, you can set the "allowMultiple" attribute in configuration to true.`);
            return {
                ok: false,
                isAborted: true,
                response: undefined,
                error: {}
            };
        }
        try {
            this._isProcessing = true;
            const response = await fetch(this._url, this._requestInit);
            this._isProcessing = false;
            return await handleResponse(response);
        }
        catch(error) {
            this._isProcessing = false;
            return catchError(error);
        }
    };

    public abort() {
        this._abort();
        this._controller = new AbortController();
        this._abort = this._controller.abort.bind(this._controller);
        this._requestInit.signal = this._controller.signal;
    };
};

const getDefaultProps = (): IHttpRequestInitProperty => ({
    url: "",
    headers: {},
    body: null,
    configuration: undefined
});

export const httpGet = (props=getDefaultProps()): IHttpRequest => new HttpRequest("get", props);
export const httpPost = (props=getDefaultProps()): IHttpRequest => new HttpRequest("post", props);
export const httpPut = (props=getDefaultProps()): IHttpRequest => new HttpRequest("put", props);
export const httpDelete = (props=getDefaultProps()): IHttpRequest => new HttpRequest("delete", props);