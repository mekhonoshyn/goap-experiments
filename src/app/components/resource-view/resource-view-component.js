import Component from 'cls/Component';
import ResourceViewController from './resource-view-controller';
import resourceViewTemplate from './html/resource-view-template.html';

class ResourceViewComponent extends Component {
    static get bindings() {
        return {
            instance: '<'
        };
    }
    static get template() {
        return resourceViewTemplate;
    }
    static get controller() {
        return ResourceViewController;
    }
}

export default ResourceViewComponent;
