'use strict';

import kit from 'nokit';
import utils from './utils';

let br = kit.require('brush');
let info = JSON.parse(process.argv[2]);

if (utils.isMaliciousPath(info.gitUrl)) {
    throw new Error(`gitUrl is illegal: ${info.gitUrl}`);
}

let gitTmp = kit.path.join('/tmp/mx-deployer-git', info.user, info.gitUrl);

function spawn (cmd, ...args) {
    kit.logs.apply(0, [br.cyan(cmd)].concat(args));
    return kit.spawn.apply(0, arguments);
}

(async function () {
    kit.logs('begin deploy:', info);

    try {
        await spawn('git', ['status'], { cwd: gitTmp });
        await spawn('git', ['fetch', 'origin', info.branch], { cwd: gitTmp });
        await spawn('git', ['reset', '--hard', `origin/${info.branch}`], { cwd: gitTmp });
    } catch (err) {
        await kit.remove(gitTmp);
        await spawn('git', ['clone', '-b', info.branch, info.gitUrl, gitTmp]);
    }

    if (info.preDeploy)
        await spawn(info.bin, [info.preDeploy], { cwd: gitTmp });

    let src = kit.path.join(gitTmp, info.src);

    kit.logs(br.cyan('copy:'), src, '->', info.dest);
    if (await kit.dirExists(info.dest))
        await kit.copy(src, kit.path.dirname(info.dest), { isForce: true });
    else
        await kit.copy(src, info.dest, { isForce: true });

    if (info.postDeploy)
        await spawn('bash', [info.postDeploy], { cwd: info.dest });

    kit.logs(br.green('deploy done.'));
})()
.catch(kit.throw);
