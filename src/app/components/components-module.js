import './list-view/list-view-module';
import './tabs-view/tabs-view-module';
import './goal-view/goal-view-module';
import './resource-view/resource-view-module';
import './structure-root/structure-root-module';
import './structure-unit/structure-unit-module';

import ToolViewComponent from './tool-view/tool-view-component';

angular.module('builder')
    .component(...ToolViewComponent.DEFINITION);
