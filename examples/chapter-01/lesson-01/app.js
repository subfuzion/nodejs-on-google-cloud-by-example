const http = require('http');

const app = http.createServer((_, res) => {
  // res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<h1>Hello, World!</h1>');
});

app.listen(3000, 'localhost');
console.log('server listening on localhost:3000');
 
