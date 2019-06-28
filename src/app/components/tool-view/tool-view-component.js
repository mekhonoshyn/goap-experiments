import Component from 'cls/Component';
import ToolViewController from './tool-view-controller';
import toolViewTemplate from './html/tool-view-template.html';

class ToolViewComponent extends Component {
    static get bindings() {
        return {
            instance: '<'
        };
    }
    static get template() {
        return toolViewTemplate;
    }
    static get controller() {
        return ToolViewController;
    }
}

export default ToolViewComponent;
