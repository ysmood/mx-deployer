import kit from 'nokit';

export default {
    isMaliciousPath (path) {
        return kit.path.normalize(path).indexOf(path) !== 0;
    },

    getOpts (cmder) {
        return kit._.pick(
            cmder,
            cmder.options.map(function (o) { return o.long.slice(2); })
        );
    }
};
