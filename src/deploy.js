'use strict';

import kit from 'nokit';

kit.require('url');
let br = kit.require('brush');
let info = JSON.parse(process.argv[2]);

let parsedGitUrl = kit.url.parse(info.gitUrl);
let gitTmp = kit.path.join(
    process.env.HOME,
    'mx-deployer-git',
    (info.user + parsedGitUrl.host + parsedGitUrl.path).replace(/\//g, '-')
);

function spawn (cmd, ...args) {
    kit.logs.apply(0, [br.cyan(cmd)].concat(args));
    return kit.spawn.apply(0, arguments);
}

(async function () {
    kit.logs('begin deploy:', info);

    if (info.removeTmp) {
        kit.logs('remove:', gitTmp);
        kit.removeSync(gitTmp);
    }

    try {
        await spawn('git', ['status'], { cwd: gitTmp });
        await spawn('git', ['fetch'], { cwd: gitTmp });
        await spawn('git', ['reset', '--hard', `origin/${info.ref}`], { cwd: gitTmp });
    } catch (err) {
        kit.removeSync(gitTmp);
        await spawn('git', ['clone', '-b', info.ref, info.gitUrl, gitTmp]);
    }

    let src = kit.path.join(gitTmp, info.src);
    let cwd = kit.path.join(gitTmp, info.cwd);

    if (info.preDeploy)
        await spawn(info.bin, [info.preDeploy], { cwd: cwd });

    if (info.removeDest) {
        kit.logs('remove:', info.dest);
        kit.removeSync(info.dest);
    }

    await spawn('rsync', ['-r', '--copy-links', kit.path.normalize(src + '/'), info.dest]);

    if (info.postDeploy)
        await spawn('bash', [info.postDeploy], { cwd: info.dest });

    kit.logs(br.green('deploy done.'));
})()
.catch(kit.throw);
