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
        port: 8710,
        bin: 'node'
    });

    app.push(
        proxy.body(),

        select(match('/deploy'), ($) => {
            let info = JSON.parse($.reqBody);

            kit.logs(br.cyan('deploy:'), info.gitUrl);

            let proc = spawn(opts.bin, ['deploy', $.reqBody], {
                cwd: __dirname
            });

            let kill = () => {
                kit.logs(br.red('kill task'), info.gitUrl);
                proc.kill();
            };

            $.res.on('error', kill);

            proc.stdout.pipe($.res);
            proc.stderr.pipe($.res);

            return kit.end();
        })
    );

    await app.listen(opts.port);

    kit.logs('listen at', app.server.address().port);

    return app;
};
