import './scss/tabs-view-styles.scss';
import Component from 'cls/Component';
import TabsViewController from './tabs-view-controller';
import tabsViewTemplate from './html/tabs-view-template.html';

class TabsViewComponent extends Component {
    static get bindings() {
        return {
            instance: '<'
        };
    }
    static get template() {
        return tabsViewTemplate;
    }
    static get controller() {
        return TabsViewController;
    }
}

export default TabsViewComponent;
