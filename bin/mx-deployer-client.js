#!/usr/bin/env node
var cmder = require('commander');
var utils = require('../lib/utils');
var main = require('../lib/client');

cmder
    .usage('the cwd of pre-deploy is the src, the cwd of post-deploy is dest')
    .option('--gitUrl <str>', 'the url of the git repo')
    .option('--branch <str>', 'the git branch to use')
    .option('--src <str>', 'the src directory is relative to the git repo [.]')
    .option('--dest <str>', 'the destination directory [/tmp]')
    .option('--host <str>', 'the host of mx-deployer service [127.0.0.1:8710]')
    .option('--user <str>', 'the id for cache repo for different users [\'\']')
    .option('--preDeploy <str>', 'the bash script to run before deploy [null]')
    .option('--postDeploy <str>', 'the bash script to run after deploy [null]')
.parse(process.argv);

main(utils.getOpts(cmder))
.catch(function (err) {
    setTimeout(function () {
        throw err;
    });
});

