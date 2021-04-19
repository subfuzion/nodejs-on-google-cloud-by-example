import { createServer } from 'http';

const PORT = process.env.PORT || '8080';

const app = createServer((_, res) => {
  console.log('received request');
  res.writeHead(200, {'content-type': 'text/html'});
  res.end('<h1>Hello, World!</h1>');
});

app.listen(PORT, () => {
  console.log(`server listening on :${PORT}`);
});
 
