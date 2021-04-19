const http = require('http');

const PORT = 8080;

const app = http.createServer((_, res) => {
  // res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<h1>Hello, World!</h1>');
});

app.listen(PORT, 'localhost');
console.log(`server listening on localhost:${PORT}`);
 
