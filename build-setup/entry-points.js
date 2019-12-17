import path from 'path';
import {srcPath} from './build-config';

export default {
    builder: path.join(process.cwd(), srcPath, 'builder.js')
};
