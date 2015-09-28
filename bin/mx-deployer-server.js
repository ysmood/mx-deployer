#!/usr/bin/env node
var cmder = require('commander');


var main = require('../lib/server');

cmder
    .option('--port', 'port', '8710')
.parse(process.argv);

main(cmder.options.map(function (o) { return o.long.slice(2); }))
.catch(function (err) {
    setTimeout(function () {
        throw err;
    });
});

