import runSequence from 'run-sequence';

export {sequence};

function sequence(...subTasks) {
    return (done) => {
        runSequence(...subTasks, done);
    };
}
