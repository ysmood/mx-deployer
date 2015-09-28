'use strict';

import kit from 'nokit';

process.env.NODE_ENV = 'development';

let br = kit.require('brush');
let proxy = kit.require('proxy');
let { match, select } = proxy;
let { spawn } = require('child_process');
let path = require('path');

let app = proxy.flow();

var addLog = (info, proc) => {
    let now = new Date();
    let logName = path.join(__dirname, '../log/' +
        now.getDate() + '.log');
    let logStream = kit.createWriteStream(logName, {
        flags: 'a'
    });
    logStream.write("[time:" + now.getTime() + "]\n");
    logStream.write("[user:" + info.user + "]\n");
    proc.stdout.pipe(logStream);
    proc.stderr.pipe(logStream);
};

export default async (opts) => {
    opts = kit._.defaults(opts, {
        port: 8710,
        bin: 'node'
    });

    await kit.mkdirs(path.join(__dirname, '../log'));

    app.push(
        proxy.body(),

        select(match('/deploy'), ($) => {
            let info = JSON.parse($.reqBody);
            let isDone = false;

            let proc = spawn(opts.bin, ['deploy', $.reqBody], {
                cwd: __dirname
            });

            let logTitle = `${info.gitUrl} ${info.user} ${proc.pid}`;

            kit.logs('deploy:', logTitle);

            let kill = () => {
                if (isDone) return;
                kit.logs('kill task', logTitle);
                proc.kill();
            };

            proc.on('exit', (code, sig) => {
                kit.logs(br.cyan('task exit'), logTitle, code, sig);
                isDone = true;
            });

            $.res.on('error', (err) => {
                kit.logs('task err', logTitle, err);
                kill();
            });

            $.res.on('close', (err) => {
                kit.logs('task close by remote', logTitle, err);
                kill();
            });

            proc.stdout.pipe($.res);
            proc.stderr.pipe($.res);

            addLog(info, proc);

            return kit.end();
        })
    );

    await app.listen(opts.port);

    kit.logs('listen at', app.server.address().port);

    return app;
};