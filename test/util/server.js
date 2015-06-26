var assert = require("assert")
  , should = require('should')
  , Vantage = require('../../')
  , http = require('http')
  , _ = require('lodash')
  ;

var create = function(fn, port, ssl) {
  
  var vantage = new Vantage();

  vantage
    .command('foo')
    .description('Should return "bar".')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){
        console.log('bar');
        resolve();
      });
    });

  vantage
    .command('fuzzy')
    .description('Should return "wuzzy".')
    .action(function(args, cb) {
      return new Promise(function(resolve, reject){
        console.log('wuzzy');
        resolve();
      });
    });

  vantage
    .command('optional [arg]')
    .description('Should optionally return an arg.')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){
        console.log(args.arg || '');
        resolve();
      });
    });

  vantage
    .command('port')
    .description('Returns port.')
    .action(function(args, cb){
      console.log(this.server._port);
      cb(this.server._port);
    });

  vantage
    .command('i want')
    .description('Negative args.')
    .option('-N, --no-cheese', 'No chease please.')
    .action(function(args, cb){
      console.log(args.options.cheese);
      cb();
    });

  vantage
    .command('required <arg>')
    .description('Must return an arg.')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){
        console.log(args.arg);
        resolve();
      });
    });


  vantage
    .command('fail me <arg>')
    .description('Must return an arg.')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){
        if (args.arg == 'not') {
          resolve('we are happy');
        } else {
          reject('we are not happy.');
        }
      });
    });

  vantage
    .command('deep command [arg]')
    .description('Tests execution of deep command.')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){
        console.log(args.arg);
        resolve();
      });
    });

  vantage
    .command('very deep command [arg]')
    .description('Tests execution of three-deep command.')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){
        console.log(args.arg);
        resolve();
      });
    });

  vantage
    .command('count <number>')
    .description('Tests execution of three-deep command.')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){
        console.log(args.number);
        resolve();
      });
    });

  vantage
    .command('very complicated deep command [arg]')
    .option('-r', 'Test Option.')
    .option('-a', 'Test Option.')
    .option('-d', 'Test Option.')
    .option('-s, --sleep', 'Test Option.')
    .option('-t', 'Test Option.')
    .option('-i [param]', 'Test Option.')
    .description('Tests execution of three-deep command.')
    .action(function(args, cb){
      return new Promise(function(resolve, reject){

        var str = '';
        str = (args.options.r === true) ? str + 'r' : str;
        str = (args.options.a === true) ? str + 'a' : str;
        str = (args.options.d === true) ? str + 'd' : str;
        str = (args.options.t === true) ? str + 't' : str;
        str = (args.options.i === 'j') ? str + args.options.i : str;
        str = (args.options.sleep === 'well') ? str + args.options.sleep : str;
        str = str + (args.arg || '');

        console.log(str);
        resolve();
      });
    });

  vantage
    .mode('repl', 'Enters REPL mode.')
    .delimiter('repl:')
    .init(function(args, cb) {
      console.log("Entering REPL Mode. To exit, type 'exit'.");
      cb("Entering REPL Mode. To exit, type 'exit'.");
    })
    .action(function(command, cb) {
      try {
        var res = eval(command);
        var log = (_.isString(res)) ? String(res).white : res;
        console.log(res);
        cb(res);
      } catch(e) {
        console.log("Error: " + e);
        cb("Error: " + e);
      }
    });

  var welcome = 'SERVER BANNER: ' + port;

  vantage
    .delimiter(port + ':')
    .listen(port, function(){
      // Callback shouldn't throw.
    });

  return vantage;
}

var handler = function(req, res) {
  console.log(this._port);
  res.write('');
  res.end();
}

try {
  var svr = create(handler, process.argv[2], process.argv[3]);
} catch(e) {
  process.exit();
}

