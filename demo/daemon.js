const cp = require('child_process');

let worker;

function spawn(server, config) {
  worker = cp.spawn('node', [server, config]);
  worker.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  worker.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      spawn(server, config);
    }
  });
}

function main(argv) {
  spawn('demo/combine.js', argv[0]);
  process.on('SIGTERM', () => {
    worker.kill();
    process.exit(0);
  });
}

main(process.argv.slice(2));
