---
description: >-
  See how to create a basic HTTP server without Express, using just the core
  HTTP module that is a standard part of Node.js.
---

# A simple server without Express

### Our first version

Create a file called `app.js` and enter the following code.

{% code title="app.js" %}
```javascript
const http = require('http');

const app = http.createServer(handleRequest);

function handleRequest(req, res) {
  res.end('Hello, World!');
}

app.listen(8080);
```
{% endcode %}

Now execute it from your terminal:

{% code title="<terminal \#1>" %}
```bash
$ node app.js
▉
```
{% endcode %}

From another terminal, run the `curl` command:

{% code title="" %}
```bash
$ curl :8080
Hello, World!
```
{% endcode %}

If all went well, then you saw `Hello, World!` printed in output of the second terminal.

Go ahead and press `<Ctrl-C>` in the first terminal to terminate the server. Now let's dissect the app a bit to understand how it works, and then let's make a few modest improvements to it before we move on.

#### Importing the http module

```javascript
const http = require('http');
```

This line is used to import the core `http` module so that we can use it later to create an HTTP server \(`http.createServer`\). The module is assigned to a constant variable `http` so we can reference it.

#### Creating the HTTP server

```javascript
const app = http.createServer(handleRequest);
```

Here we create an HTTP server object. We pass `handleRequest`, which we have not yet written, as an argument — this will be the handler for incoming requests. We assign the newly created server to a constant named `app` to reference later.

#### Create the request handler function

```javascript
function handleRequest(req, res) {
  res.end('Hello, World!');
}
```

Here we declare our request handler function. This is a function that takes two parameters:

* `request` - usually abbreviated as `req`; this is an [http.IncomingMessage](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage).
* `response` - usually abbreviated as `res`; this is an [http.ServerResponse](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_serverresponse).

In this example, we don't do anything with `req`, but we always need to use `res` to write to the response stream and close it when finished. We do that all at once here with `res.end()`, passing `Hello, World!` as the content that we want to write to the stream of bytes to send to the client.

#### Starting the server

```javascript
app.listen(8080);
```

Now that we have created a server and assigned a request handler function to it, we are ready to process incoming HTTP requests. Here we tell the server to bind to port `8080` to start listening for them.

### Improving the first version

Now that we have walked through our first cut at this, let's improve the example a bit.

#### Use ES module imports

Since both the LTS and current version of Node.js support ECMAScript modules, let's adopt that going forward. Although we're only using vanilla syntax with our examples, using modules will make the code a bit easier to port for those of you who want to use [TypeScript](https://www.typescriptlang.org/).

{% hint style="info" %}
The ESM \(ECMAScript Modules\) implementation for Node.js v14.x LTS is technically still experimental, but is considered stable enough now that the "experimental" warning has been removed. 

From the authors:  
  
_"It is our belief that the current implementation offers a future proof model to authoring ESM modules that paves the path to Universal JavaScript."_  
  
See [Node.js 14 ChangeLog](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V14.md#ecmascript-modules---experimental-warning-removal).
{% endhint %}

```javascript
import { createServer } from 'http';
```

Instead assigning the result of `require('http')` to `http`, here we use ESM import syntax to explicitly import the `createServer` function from the `http` module.

#### Use an arrow function for the request handler

Strictly speaking, using an arrow function isn't necessary and doesn't necessarily improve the code. But since it's such a common idiom, we're introducing it here to help breed familiarity with it. Using an arrow function eliminates the separate function declaration for the request handler, bring the code closer to where it actually gets used since it only gets used one time anyway.

```javascript
const app = createServer((_, res) => {
  console.log('request received');
  res.writeHead(200, {'content-type': 'text/html'});
  res.end('<h1>Hello, World!</h1>');
});
```

The astute observer will note several things that are a bit different from the original function declaration:

* We added a log statement. It doesn't really do anything helpful here, but logging is an essential aspect of server programming and we'll expand on this eventually.
* Since we don't make use of the first parameter \(`req`\), we have replaced it with an underscore \(`_`\). This is an idiomatic convention for indicating that a required argument for the arrow function isn't needed.
* We added `res.writeHead` to set the HTTP status code to `200` \(OK\) and to set an HTTP response header to indicate that the response`content-type` is `text/html`. Most browsers will assume this anyway if the header isn't set, but this just makes it explicit.
* Since we're return `text/html` we decorate the message with `<h1>` markup tags. If you access the server with your browser instead of using `curl`, you'll see the difference.

#### Get the port from the environment

```javascript
const PORT = process.env.PORT || '8080';
```

As we'll find out later, port `8080` is a typically standard port for serverless environments. But rather than hard-coding the value, we provide it as a default only if the environment doesn't explicitly set it.

The `PORT` environment variable is a typically standard environment variable used to tell a server what port to bind to, so that's what we check for first; if it's not set, then the alternative value will be assigned by default.

During development and testing, you may find it convenient to assign different port values other than the standard value. In any case, even if `8080` tends to be a typical port value, it's not guaranteed in all environments, so it's best to check. 

#### Log when the server is ready to listen

```javascript
app.listen(PORT, () => {
  console.log(`server listening on :${PORT}`);
});
```

The `app.listen` function will tell the server to bind to the specified port. At some point once it has connected and is now about to start listening for requests, the server emits a `listening` event. Adding a callback to the `app.listen` function is a shortcut for explicitly adding a `listening` event handler to `app`. As we did when we created the server, we use an arrow function for the callback.

#### The final version

The final version of our basic HTTP server is located in the repo under `examples/chapter-01/lesson-01/`.

{% hint style="warning" %}
Remember to let Node.js know that you're opting in to using ES modules.
{% endhint %}

For the final version we also need to let Node.js know that we're opting in to using ES modules. One way to do this is to change the file extension from `.js` to `.mjs`.

The alternative, which we chose for our examples, is to set a `"type"` field to `"modules"` in the nearest parent `package.json` file, as shown below.

{% code title="examples/chapter-01/lesson-01/package.json" %}
```javascript
{
  "type": "module"
}
```
{% endcode %}

And here's the final version:

{% code title="examples/chapter-01/lesson-01/app.js" %}
```javascript
import { createServer } from 'http';

const PORT = process.env.PORT || 8080;

const app = createServer((_, res) => {
  res.writeHead(200, {'content-type': 'text/html'});
  res.end('<h1>Hello, World!</h1>');
});

app.listen(PORT, () => {
  console.log(`server listening on :${PORT}`);
});
```
{% endcode %}



