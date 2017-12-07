// 路由级中间件
const router = require('express').Router();

// 匹配该路径
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
}, (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});

// 匹配该路径get请求
router.get('/user/:id', (req, res, next) => {
  if (req.params.id == 0) {
    next('route');
  } else {
    next();
  }
}, (req, res) => {
  res.send(`USER ID:${req.params.id}`);
});
router.get('/user/:id', (req, res) => {
  res.send('Special User');
});

module.exports = router;
