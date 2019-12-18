import {html as compile, render, nothing} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';

export {
    repeat,
    render,
    compile,
    nothing,
    nothingFn
};

function nothingFn() {
    return nothing;
}
