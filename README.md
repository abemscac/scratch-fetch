# What is this?
This is a JavaScript FetchAPI library.

# How to use
## 1. Install package
```npm install scratch-fetch --save```

## 2. Import module
**1. ES5 or earlier**
```javascript
require("scratch-fetch");
```

**2. ES6**
```javascript
import { httpGet, httpPost, httpPut, httpDelete } from "scratch-fetch";
```
## 3. Set up your request
You can use either the constructor or methods to set up your request.

**By constructor:**
```javascript
const request = await httpPost({
                        url: "MY_API_ENDPOINT",
                        headers: {
                            "KEY_0": "VALUE",
                            "KEY_1": "VALUE"
                        },
                        body: {
                            "key": "value"
                        }
                    }).execute();
```

**By methods**
```javascript
const request = await httpPost()
                        .withUrl("MY_API_ENDPOINT")
                        .withHeaders({
                            "KEY_0": "VALUE",
                            "KEY_1": "VALUE"
                        }).
                        withBody({
                            "key": "value"
                        }).execute();
```

- By default, the request contains ```"Accept": "application/json"``` and ```"Content-Type": "application/json"``` headers. If you wish to remove default headers, you can set the ```useDefaultHeaders``` attribute in `configuration` to false.
- The ```body``` of a request will be stringified automatically. If you wish to keep your request body raw, you can set the ```stringifyBody``` attribute in ```configuration``` to ```false```.

For example,
```javascript
const request = await httpGet({
                        url: "MY_API_ENDPOINT",
                        configuration: {
                            useDefaultHeaders: false, // <- Remove default headers.
                            stringifyBody: false // <- Keep request body raw.
                        }
                    }).execute();
```

## 4.  Get response and handle errors
```javascript
const request = await httpGet({ url: "MY_API_ENDPOINT" }).execute();
if (request.ok) {
    console.log(request.response); // The response is already converted to json object.
}
else if (!request.isAborted) {
    // Handle error here
    console.error(request.error);
}
```

## 5. Abort request (optional)
You can call the `abort` method to abort a request.
```javascript
const requests = {
    fetchData: httpGet(),
    updateData: httpPut()
};

// Set up requests
const request = requests.updateData
                        .withUrl("MY_API_ENDPOINT")
                        .withBody({ "key": "value" })
                        .execute();

// Then somewhere in your code
requests.updateData.abort();
```
- If a request is **already done** (that means you have received the response), then the ```abort``` method **will not do anything**.
- You can handle abort error by checking the ```isAborted``` property in the response of your request.

## 6. API References
### 1. Constructor

| Name | Type | Default value |
| :------------: | :------------: | :------------: |
| **url** | ```string``` | ```undefined``` |
| **headers** | ```{}``` |  <ul><li>```"Accept": "application/json"``` </li><li>```"Content-Type": "application/json"``` </li></ul> |
| **body** | ```any``` | ```undefined``` |
| **configuration** | ```IHttpRequestInitConfiguration``` | ```undefined``` |

##### IHttpRequestInitConfiguration

| Name | Type | Default value |
| :------------: | :------------: | :------------: |
| **useDefaultHeaders** | ```boolean``` | ```true``` |
| **stringifyBody** | ```boolean``` | ```true``` |
| **allowMultiple** | ```boolean``` | ```false``` |
| **credentials** | ```RequestCredentials``` | ```"include"``` |

### 2. Methods

| Name | Arguments | Returned value type |
| :------------: | :------------: | :------------: |
| **withUrl** | ```value: string``` | ```IHttpRequest``` |
| **withHeaders** | ```value: {}``` | ```IHttpRequest``` |
| **withBody** | ```value: any``` | ```IHttpRequest``` |
| **addHeaders** | ```value: {}``` | ```undefined (void)``` |
| **execute** | - | ```HttpResponse``` |
| **abort** | - | ```undefined (void)``` |

##### HttpResponse

| Name | Type |
| :------------: | :------------: |
| **ok** | ```boolean``` |
| **status** | ```number?``` |
| **isAborted** | ```boolean``` |
| **response** | ```any``` |
| **error** | ```{}``` |
