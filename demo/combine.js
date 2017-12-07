const fs = require('fs');
const path = require('path');
const http = require('http');

const MIME = {
  '.css': 'text/css',
  '.js': 'application/javasctipt',
};

function combineFiles(pathnames, callback) {
  const output = [];

  (function next(i, len) {
    if (i < len) {
      fs.readFile(pathnames[i], (err, data) => {
        if (err) {
          callback(err);
        } else {
          output.push(data);
          next(i + 1, len);
        }
      });
    } else {
      callback(null, Buffer.concat(output));
    }
  }(0, pathnames.length));
}

function parseURL(root, url) {
  if (url.indexOf('??') === -1) {
    url = url.replace('/', '/??');
  }

  const parts = url.split('??');
  const base = parts[0];
  const pathnames = parts[1].split(',').map(value => path.join(root, base, value));

  return {
    mime: MIME[path.extname(pathnames[0])] || 'text/plain',
    pathnames,
  };
}

function outputFiles(pathnames, res) {
  (function next(i, len) {
    if (i < len) {
      const reader = fs.createReadStream(pathnames[i]);
      reader.pipe(res, { end: false });
      reader.on('end', () => next(i + 1, len));
    } else {
      res.end();
    }
  }(0, pathnames.length));
}

function validateFiles(pathnames, callback) {
  (function next(i, len) {
    if (i < len) {
      fs.stat(pathnames[i], (err, stats) => {
        if (err) {
          callback(err);
        } else if (!stats.isFile()) {
          callback(new Error());
        } else {
          next(i + 1, len);
        }
      });
    } else {
      callback(null, pathnames);
    }
  }(0, pathnames.length));
}

function main(argv) {
  const config = JSON.parse(fs.readFileSync(argv[0], 'utf-8'));
  const root = config.root || '.';
  const port = config.port || 80;

  const server = http.createServer((req, res) => {
    const urlInfo = parseURL(root, req.url);

    // combineFiles(urlInfo.pathnames, (err, data) => {
    //   if (err) {
    //     res.writeHead(404);
    //     res.end(err.message);
    //   } else {
    //     res.writeHead(200, { 'Content-Type': urlInfo.mime });
    //     res.end(data);
    //   }
    // });

    validateFiles(urlInfo.pathnames, (err, pathnames) => {
      if (err) {
        res.writeHead(404);
        res.end(err.message);
      } else {
        res.writeHead(200, { 'Content-Type': urlInfo.mime });
        outputFiles(pathnames, res);
      }
    });
  }).listen(port);

  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });
}

main(process.argv.slice(2));

console.log('Server running at http://localhost:3000/');
