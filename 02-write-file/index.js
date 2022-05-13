const fs = require('fs');
const readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout);
let filename = __dirname + '\\text.txt';
rl.setPrompt('Input:');
rl.prompt();
fs.appendFile(filename, '', function (err) {
  if (err) throw err;
});
rl.on('line', function(line) {
  switch(line.trim()) {
  case 'exit':
    console.log('Script stopped! See you next time!');
    process.exit(0);
    break;
  default:
    fs.appendFile(filename, line.trim() + '\n', function (err) {
      if (err) throw err;});
    break;}
  rl.prompt();
}).on('close', function() {
  console.log('\nScript stopped! See you next time!');
  process.exit(0);
});