import './scss/list-view-styles.scss';
import Component from 'cls/Component';
import ListViewController from './list-view-controller';
import listViewTemplate from './html/list-view-template.html';

class ListViewComponent extends Component {
    static get bindings() {
        return {
            instance: '<'
        };
    }
    static get template() {
        return listViewTemplate;
    }
    static get controller() {
        return ListViewController;
    }
}

export default ListViewComponent;
