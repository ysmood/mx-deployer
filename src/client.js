import kit from 'nokit';

export default async (opts) => {
    opts = kit._.defaults(opts, {
        gitUrl: null,
        branch: 'master',
        src: '.',
        dest: '/tmp',
        host: '127.0.0.1:8710',
        user: '',
        preDeploy: null,
        postDeploy: null
    });

    if (!opts.gitUrl) {
        throw new Error(`gitUrl must be set, now: ${opts.gitUrl}`);
    }

    opts.gitUrl = opts.gitUrl.trim();

    return kit.request({
        method: 'POST',
        url: opts.host + '/deploy',
        resPipe: process.stdout,
        reqData: JSON.stringify(opts)
    });
};
