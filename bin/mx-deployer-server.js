#!/usr/bin/env node
var cmder = require('commander');
var utils = require('../lib/utils');
var main = require('../lib/server');

cmder
    .option('--port', 'port [8710]', '8710')
.parse(process.argv);

main(utils.getOpts(cmder))
.catch(function (err) {
    setTimeout(function () {
        throw err;
    });
});

