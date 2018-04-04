import path from 'path';
import {srcPath} from './build-config';

export default {
    vendors: path.join(process.cwd(), srcPath, 'vendors.js'),
    builder: path.join(process.cwd(), srcPath, 'builder.js')
};
