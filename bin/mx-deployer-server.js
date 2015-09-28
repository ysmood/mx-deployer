#!/usr/bin/env node
var cmder = require('commander');
var utils = require('../lib/utils');
var kit = require('nokit');
var main = require('../lib/server');

cmder
    .option('--port <str>', 'port [8710]')
    .option('--bin <str>', 'the binary to run deploy [node]')
.parse(process.argv);

main(utils.getOpts(cmder))
.catch(kit.throw);
