const http = require('http');
const url = require('url');

// const option = {
//   hostname: '200.200.4.131',
//   port: 8004,
//   path: '/api/News/GetData',
//   method: 'post',
//   headers: {
//     'Content-Type': 'application/json; chartset=utf-8',
//     Ticket: null,
//   },
// };

// http.createServer((req, res) => {
//   let body = '';

//   req.on('data', (chunk) => {
//     body += chunk;
//   });

//   req.on('end', () => {
//     const request = http.request(option, (response) => {
//       res.writeHead(response.statusCode, response.headers);

//       let data = '';

//       response.on('data', (chunk) => {
//         data += chunk;
//       });

//       response.on('end', () => {
//         res.end(data);
//       });
//     });

//     request.write(body);
//     request.end();
//   });
// }).listen(3000);

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(JSON.stringify(url.parse(req.url, true)));
}).listen(3000);

console.log('Server running at http://localhost:3000/');
