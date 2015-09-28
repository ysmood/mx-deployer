#!/usr/bin/env node
var cmder = require('commander');


var main = require('../lib/client');

cmder
    .usage('the cwd of pre-deploy is the src, the cwd of post-deploy is dist')
    .option('--src', 'the src directory is relative to the git repo [.]')
    .option('--dist', 'the dist directory [/tmp]')
    .option('--host', 'the host of mx-deployer service [127.0.0.1:8710]')
    .option('--user', 'the id for cache repo for different users [\'\']')
    .option('--preDeploy', 'the script to run before deploy [pre-deploy.sh]')
    .option('--postDeploy', 'the script to run after deploy [post-deploy.sh]')
.parse(process.argv);

main(cmder.options.map(function (o) { return o.long.slice(2); }))
.catch(function (err) {
    setTimeout(function () {
        throw err;
    });
});

