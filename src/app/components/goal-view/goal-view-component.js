import Component from 'cls/Component';
import GoalViewController from './goal-view-controller';
import goalViewTemplate from './html/goal-view-template.html';

class GoalViewComponent extends Component {
    static get bindings() {
        return {
            instance: '<'
        };
    }
    static get template() {
        return goalViewTemplate;
    }
    static get controller() {
        return GoalViewController;
    }
}

export default GoalViewComponent;
