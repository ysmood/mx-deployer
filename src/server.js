'use strict';

import kit from 'nokit';

process.env.NODE_ENV = 'development';

let br = kit.require('brush');
let proxy = kit.require('proxy');
let { match, select } = proxy;
let { spawn } = require('child_process');

let app = proxy.flow();

export default async (opts) => {
    opts = kit._.defaults(opts, {
        port: 8710
    });

    app.push(
        proxy.body(),

        select(match('/deploy'), (ctx) => {
            let info = JSON.parse(ctx.reqBody);

            kit.logs(br.cyan('deploy:'), info.gitUrl);

            let proc = spawn('node', ['deploy', ctx.reqBody], {
                cwd: __dirname
            });

            let kill = () => {
                kit.logs(br.red('kill task'), info.gitUrl);
                proc.kill();
            };

            ctx.res.on('error', kill);
            ctx.res.on('finish', kill);

            process.stdin.pipe(proc.stdin);
            proc.stdout.pipe(ctx.res);
            proc.stderr.pipe(ctx.res);

            return kit.end();
        })
    );

    app.listen(opts.port, () => {
        kit.logs('listen at', opts.port);
    });
};
