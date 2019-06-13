import Component from 'cls/Component';
import structureUnitTemplate from './html/structure-unit-template.html';

class StructureUnitComponent extends Component {
    static get bindings() {
        return {
            instance: '<'
        };
    }
    static get template() {
        return structureUnitTemplate;
    }
}

export default StructureUnitComponent;
