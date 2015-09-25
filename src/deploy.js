'use strict';

import kit from 'nokit';
import utils from './utils';

let br = kit.require('brush');
let info = JSON.parse(process.argv[2]);

if (utils.isMaliciousPath(info.gitUrl)) {
    throw new Error(`gitUrl is illegal: ${info.gitUrl}`);
}

let gitTmp = kit.path.join('/tmp/git', info.gitUrl);

function spawn () {
    kit.logs.apply(0, [br.cyan()].concat(arguments));
    kit.spawn.apply(0, arguments);
}

(async function () {
    kit.logs('begin deploy:', info.gitUrl);

    if (await kit.dirExists(gitTmp)) {
        await spawn('git', ['pull', '-b', info.branch, info.gitUrl, gitTmp]);
    } else {
        await spawn('git', ['clone', '-b', info.branch, info.gitUrl, gitTmp]);
    }


    if (info.preDeploy)
        await spawn('bash', [info.preDeploy], { cwd: gitTmp });

    kit.logs(br.yellow('remove:'), info.dist);
    await kit.remove(info.dist);

    kit.logs(br.cyan('copy:'), temp + '/asset', 'to', info.dist);
    await kit.copy(temp + '/asset', info.dist);

    kit.logs(br.green('deploy done.'));
})();
