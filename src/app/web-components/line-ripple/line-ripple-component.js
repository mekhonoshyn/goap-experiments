import BaseComponent from '../base-component';

class LineRipple extends BaseComponent {
    onCreate() {
        this.handleTransitionEnd = this.transitionEndHandler.bind(this);
    }

    onConnect() {
        this.classList.add('mdc-line-ripple');

        this.addEventListener('transitionend', this.handleTransitionEnd);
    }

    onDisconnect() {
        this.removeEventListener('transitionend', this.handleTransitionEnd);
    }

    transitionEndHandler(event) {
        if (event.propertyName !== 'opacity') {
            return;
        }

        if (!this.classList.contains('mdc-line-ripple--deactivating')) {
            return;
        }

        this.classList.remove('mdc-line-ripple--active');
        this.classList.remove('mdc-line-ripple--deactivating');
    }

    activate() {
        this.classList.remove('mdc-line-ripple--deactivating');
        this.classList.add('mdc-line-ripple--active');
    }

    deactivate() {
        this.classList.add('mdc-line-ripple--deactivating');
    }

    static get hasShadowDOM() {
        return false;
    }
}

customElements.define('awc-line-ripple', LineRipple);
