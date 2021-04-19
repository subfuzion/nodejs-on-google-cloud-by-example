import { createServer } from 'http';

const PORT = 8888;

const app = createServer((_, res) => {
  // res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<h1>Hello, World!</h1>');
});

app.listen(PORT, 'localhost');
console.log(`server listening on localhost:${PORT}`);
 
