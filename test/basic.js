import kit from 'nokit';
import server from '../src/server';
import client from '../src/client';

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
        await remove(dest);
        await mkdirs(repo);
        await spawn('git', ['init'], { cwd: repo });
        await outputFile(repo + '/pre-deploy.sh', `echo "${now}"\npwd`);
        await spawn('git', ['add', '--all']);
        await spawn('git', ['commit', '-m', 'init']);

        let app = await server({ port: 0, bin: 'babel-node' });
        let { port } = app.server.address();

        let { body } = await client({
            resPipe: null,
            host: `127.0.0.1:${port}`,
            gitUrl: repo,
            dest: dest,
            preDeploy: 'pre-deploy.sh'
        });

        await app.close();

        console.log(body);
        await it.eq(body.indexOf(`${now}`) > 0, true);
        let out = await kit.readFile(dest + '/pre-deploy.sh', 'utf8');
        await it.eq(out.indexOf(`${now}`) > 0, true);
    })
];
