import kit from 'nokit';

let br = kit.require('brush');

export default async (opts) => {
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
        url: opts.host + '/deploy',
        resPipe: process.stdout,
        reqData: JSON.stringify(opts)
    });
};
