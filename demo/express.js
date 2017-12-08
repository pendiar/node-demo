const path = require('path');
const express = require('express');
const errorHandler = require('errorhandler');
const router = require('./router.js');

const app = express();

// 中间件
// app.use((req, res, next) => {
//   console.log('Time:', new Date());
//   next();
// });

// 配置静态资源
app.use(express.static(path.join(__dirname, '../accets')));

// 采用路由级中间件
app.use('/', router);

// 中间件，执行到该步，说明地址找不到
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误捕获
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req && req.xhr) {
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
}
// function errorHandler(err, req, res, next) {
//   res.set('Content-Type', 'text/html');
//   res.status(err.status || 500).send(`<!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <title>Error</title>
//     <link rel="stylesheet" href="/css/error.css" />
//   </head>
//   <body>
//     <h1>${err.message}</h1>
//     <h2>${err.status}</h2>
//     <pre>${err.stack}</pre>
//   </body>
//   </html>`);
// }
// app.use(logErrors);
app.use(clientErrorHandler);
if (app.get('env') === 'development') {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    res.set('Content-Type', 'text/html');
    res.status(err.status || 500).send(`<!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Error</title>
      <link rel="stylesheet" href="/css/error.css" />
    </head>
    <body>
      <h1>${err.message}</h1>
      <h2>${err.status}</h2>
    </body>
    </html>`);
  });
}

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App listening at http://${host === '::' ? 'localhost' : host}:${port}`);
});
