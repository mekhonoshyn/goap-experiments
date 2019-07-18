import BaseComponent from '../base-component';

import styles from './structure-unit-styles.html';

class StructureUnitView extends BaseComponent {
    render(compiler, {unsafeHTML}, {nothing}) {
        if (!this.instanceId) {
            return nothing;
        }

        return compiler`
            ${unsafeHTML(styles)}
            
            <div>structure-unit #${this.instanceId}</div>
        `;
    }

    static get observedAttributes() {
        return ['instance-id'];
    }

    get instanceId() {
        const instanceId = parseInt(this.getAttribute('instance-id'), 10);

        if (isNaN(instanceId)) {
            return null;
        }

        return instanceId;
    }
}

customElements.define('bld-structure-unit-new', StructureUnitView);
