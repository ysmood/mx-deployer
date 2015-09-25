'use strict';

import kit from 'nokit';

process.env.NODE_ENV = 'development';

let br = kit.require('brush');
let proxy = kit.require('proxy');
let { match, select } = proxy;
let { spawn } = require('child_process');

let port = 8710;

let app = proxy.flow();

app.push(
    select(match('/deploy'), (ctx) => {
        ctx.req.on('data', (data) => {
            let info = JSON.parse(data);
            kit.logs(br.cyan('deploy:'), info.gitUrl);

            let proc = spawn('babel-node', ['deploy', data], {
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
        });

        return kit.end();
    })
);

app.listen(port, () => {
    kit.logs('listen at', port);
});