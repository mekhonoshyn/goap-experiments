import Component from 'cls/Component';
import StructureRootController from './structure-root-controller';
import structureRootTemplate from './html/structure-root-template.html';

class StructureRootComponent extends Component {
    static get template() {
        return structureRootTemplate;
    }
    static get controller() {
        return StructureRootController;
    }
}

export default StructureRootComponent;
