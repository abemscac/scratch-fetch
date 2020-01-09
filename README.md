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
const uid = 5;
const response = await httpPost()
                        .withUrl(`https://localhost:8080/api/hello?uid=${uid}`)
                        .withHeaders({
                            "KEY_0": "VALUE",
                            "KEY_1": "VALUE"
                        }).
                        withBody({
                            "key": "value"
                        }).execute();
```

- By default, the request contains ```"Accept": "application/json"``` and ```"Content-Type": "application/json"``` headers. If you wish to remove default headers, you can set the ```useDefaultHeaders``` property in `configuration` to false.
- The ```body``` of a request will be stringified automatically. If you wish to keep your request body raw, you can set the ```stringifyBody``` property in ```configuration``` to ```false```.

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

## 5. Abort request (optional)
You can call the `abort` method to abort a request.
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
| **value** | ```any``` |
| **error** | ```{}``` |
