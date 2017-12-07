const fs = require('fs');
const path = require('path');

// 复制文件
function copy(src, dst) {
  // fs.writeFileSync(dst, fs.readFileSync(src));
  fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

// 遍历目录
function travel(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      travel(pathname, callback);
    } else {
      callback(pathname);
    }
  });
}

function main(argv) {
  travel(argv[0], pathname => console.log(pathname));
}

main(process.argv.slice(2));
// process是一个全局变量，可通过process.argv获得命令行参数。
// 由于argv[0]固定等于NodeJS执行程序的绝对路径，argv[1]固定等于主模块的绝对路径，因此第一个命令行参数从argv[2]这个位置开始。
