import kit from 'nokit';
import server from '../lib/server';
import client from '../lib/client';

let { remove, mkdirs, outputFile } = kit;

function genSpawn (cwd) {
    return function (cmd, args) {
        return kit.spawn(cmd, args, { cwd: cwd });
    };
}

export default (it) => [
    it("basic", async () => {
        let repo = kit.path.resolve('test/fixtures/repo');
        let dest = kit.path.resolve('test/fixtures/repo-dest');
        let spawn = genSpawn(repo);
        let now = Date.now();

        await remove(repo);
        await mkdirs(repo);
        await spawn('git', ['init'], { cwd: repo });
        await outputFile(repo + '/pre-deploy.sh', `echo "${now}"\npwd`);
        await spawn('git', ['add', '--all']);
        await spawn('git', ['commit', '-m', 'init']);

        let app = await server({ port: 0 });
        let { port } = app.server.address();

        await client({
            host: `127.0.0.1:${port}`,
            gitUrl: repo,
            dest: dest,
            preDeploy: 'pre-deploy.sh'
        });

        await app.close();
    })
];