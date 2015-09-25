import kit from 'nokit';

export default (task) => {
    task('default build', async () => {
        await kit.spawn('babel', [
            '--optional', 'runtime',
            '-d', 'lib', 'src'
        ]);
    });
};
