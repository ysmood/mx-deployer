import kit from 'nokit';
let br = kit.require('brush');
let _ = kit._;

export default async (opts) => {
    let exec = kit.promisify(require('child_process').exec);
    let packInfo = require('./package.json');
    let url;

    try {
        url = await exec('git config --get remote.origin.url');
    } catch (err) {
        kit.err(br.red('please make sure you have set git remote correctly'));
    }

    url = url.trim();

    if (!_.endsWith(_.trimRight(url, '.git'), packInfo.name)) {
        return kit.err('please keep the git repo name the same with the name of package.json');
    }

    return kit.request({
        method: 'POST',
        url: opts.testHost + '/deploy',
        resPipe: process.stdout,
        reqData: JSON.stringify({
            name: packInfo.name,
            branch: opts.testBranch,
            gitUrl: url,
            preDeploy: 'pre-deploy.sh'
        })
    });
};
