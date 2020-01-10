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
You can use either constructor or methods to set up your request.

**By constructor:**
```javascript
const response = await httpPost({
                        url: "https://localhost:8080/api/hello",
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
const response = await httpPost()
                        .withUrl("https://localhost:8080/api/hello")
                        .withHeaders({
                            "KEY_0": "VALUE",
                            "KEY_1": "VALUE"
                        }).
                        withBody({
                            "key": "value"
                        }).execute();
```

- By default, the request contains ```"Accept": "application/json"``` and ```"Content-Type": "application/json"``` headers. If you wish to remove default headers, you can set the ```useDefaultHeaders``` property in `configuration` to false when initializing the request. (in constructor)
- The ```body``` of a request will be stringified automatically. If you wish to keep your request body raw, you can set the ```stringifyBody``` property in ```configuration``` to ```false``` when initializing the request. (in constructor)

For example,
```javascript
const response = await httpGet({
                        url: "https://localhost:8080/api/hello",
                        configuration: {
                            useDefaultHeaders: false, // <- Remove default headers.
                            stringifyBody: false // <- Keep request body raw.
                        }
                    }).execute();
```

You can reuse a request object multiple times. If you want to change the url of the request (for most cases, we want to change the query parameters), then you can call the ```withUrl``` method at any time to achieve this aim.

For example,
```javascript
const requests = {
  fetchData: httpGet()
};

async function fetchMyData() {
  const queryString = ""; // queryString may be different every time you call this function.
  const response = requests.fetchData
                          .withUrl(`https://localhost:8080/api/hello?${queryString}`)
                          .execute();
}
```

```scratch-fetch``` also offers you a function to build query string. To use this function, we have to import it from the module.

**1. ES5 or earlier**
```javascript
var buildQueryString = require("scratch-fetch").buildQueryString;
```

**2. ES6**
```javascript
import { buildQueryString } from "scratch-fetch";
```

Then you can use this function to build your query string.

For example,
```javascript
const params = {
  page: 5,
  size: 20
};
const queryString = buildQueryString(params); // queryString will be "page=5&size=20", WITHOUT the leading question mark.
```

## 4.  Get response and handle errors
```javascript
const response = await httpGet({ url: "https://localhost:8080/api/hello" }).execute();
if (response.ok) {
    console.log(response.value); // "value" is already converted to json object.
}
else if (!response.isAborted) {
    // Handle error here
    console.error(response.error);
}
```

### What do I do if I want to abort a request?
You can call the `abort` method to abort a request.

For example,
```javascript
const requests = {
    fetchData: httpGet(),
    updateData: httpPut()
};

// Set up requests
const response = requests.updateData
                        .withUrl("https://localhost:8080/api/hello")
                        .withBody({ "key": "value" })
                        .execute();

// Then somewhere in your code
requests.updateData.abort();
```
- If a request is **already done** (that means you have received the value of response), then the ```abort``` method **will not do anything**.
- You can handle abort error by checking the ```isAborted``` property in the response.

## 5. API References
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

- The ```allowMultiple``` property is used to **prevent a request from getting sent multiple times before the previous one is done**. By default, this attribute is set to ```false```. If you wish to remove this constraint, you can set it to ```true```.
- For more info about ```credentials``` property, please visit [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials "MDN Web Docs")

### 2. Methods

| Name | Arguments | Returned value type |
| :------------: | :------------: | :------------: |
| **withUrl** | ```value: string``` | ```IHttpRequest``` |
| **withHeaders** | ```value: {}``` | ```IHttpRequest``` |
| **withBody** | ```value: any``` | ```IHttpRequest``` |
| **addHeaders** | ```value: {}``` | ```undefined (void)``` |
| **execute** | - | ```Promise<HttpResponse>``` |
| **abort** | - | ```undefined (void)``` |

##### HttpResponse

| Name | Type |
| :------------: | :------------: |
| **ok** | ```boolean``` |
| **status** | ```number?``` |
| **isAborted** | ```boolean``` |
| **value** | ```any``` |
| **error** | ```{}``` |
