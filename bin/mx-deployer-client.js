#!/usr/bin/env node
var cmder = require('commander');
var utils = require('../lib/utils');
var kit = require('nokit');
var main = require('../lib/client');

cmder
    .usage('the cwd of pre-deploy is the src, the cwd of post-deploy is dest')
    .option('--gitUrl <str>', 'the url of the git repo')
    .option('--ref <str>', 'the git ref to use [master]')
    .option('--removeTmp', 'remove the tmp dir before clone')
    .option('--removeDest', 'remove the dest before copy src to dest')
    .option('--cwd <str>', 'the cwd directory is relative to the git repo [.]')
    .option('--src <str>', 'the src directory is relative to the git repo [.]')
    .option('--dest <str>', 'the destination directory [/tmp]')
    .option('--host <str>', 'the host of mx-deployer service [127.0.0.1:8710]')
    .option('--user <str>', 'the id for cache repo for different users [\'\']')
    .option('--shell <str>', 'the shell to run the deploy hook [bash]')
    .option('--preDeploy <str>', 'the bash script to run before deploy, pwd is cwd [null]')
    .option('--postDeploy <str>', 'the bash script to run after deploy, pwd is dest [null]')
.parse(process.argv);

main(utils.getOpts(cmder))
.catch(kit.throw);
