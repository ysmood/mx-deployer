import kit from 'nokit';
import cmder from 'commander';

let br = kit.require('brush');

cmder
    .option('--src', 'the src directory is relative to the git repo [.]', '.')
    .option('--dist', 'the dist directory [/tmp]', '/tmp')
    .option('--host', 'the host of mx-deployer service', '127.0.0.1:8710')
    .option('--preDeploy', 'the script to run before deploy', 'pre-deploy.sh')
    .option('--postDeploy', 'the script to run after deploy', 'after-deploy.sh')
.parse(process.argv);

(async () => {
    let exec = kit.promisify(require('child_process').exec);
    let gitUrl;

    try {
        gitUrl = await exec('git config --get remote.origin.url');
    } catch (err) {
        kit.err(br.red('please make sure you have set git remote correctly'));
    }

    gitUrl = gitUrl.trim();

    return kit.request({
        method: 'POST',
        url: cmder.host + '/deploy',
        resPipe: process.stdout,
        reqData: JSON.stringify(cmder.options.map(o => o.long.slice(2)))
    });
})();
