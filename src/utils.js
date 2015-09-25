import kit from 'nokit';

export default {
    isMaliciousPath (path) {
        return kit.path.normalize(path).indexOf(path) !== 0;
    }
};
