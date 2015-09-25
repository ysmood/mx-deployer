'use strict';

import kit from 'nokit';

let cs = kit.require('colors/safe');
let { spawn } = kit;
let info = JSON.parse(process.argv[2]);
let temp = kit.path.join('/tmp', info.name + Date.now());

kit.logs('begin deploy:', info.gitUrl);

(async function () {
    kit.logs(cs.yellow('remove:'), temp);
    await kit.remove(temp);

    await spawn('git', ['clone', '-b', info.branch, info.gitUrl, temp]);

    await spawn(
        'bash',
        [info.preDeploy],
        { cwd: temp }
    );

    kit.logs(cs.yellow('remove:'), info.dist);
    await kit.remove(info.dist);

    kit.logs(cs.cyan('copy:'), temp + '/asset', 'to', info.dist);
    await kit.copy(temp + '/asset', info.dist);

    kit.logs(cs.green('deploy done.'));
})();
