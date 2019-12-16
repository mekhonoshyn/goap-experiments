import BaseComponent from '../base-component';

import structureUnitsService from 'app/services/structure-units-service';
import structureUnitsActions from 'app/actions/structure-units-actions';

import {
    createArrayDefinition,
    createObjectDefinition,
    createBooleanDefinition
} from 'tools/definitions';

import {
    createMaxLengthConstraint,
    createRequiredConstraint
} from 'tools/constraints';

import structureUnitTypes from './structure-unit-types.json';

const titleInputConstraintsBase = [
    createRequiredConstraint(),
    createMaxLengthConstraint(120)
];

const descriptionInputConstraintsBase = [
    createMaxLengthConstraint(200)
];

const typeSelectConstraintsBase = [
    createRequiredConstraint()
];

class StructureUnitDialog extends BaseComponent {
    render(compiler, unused, {nothing}) {
        const {handleTitleInputInput, handleDescriptionInputInput, handleTypeSelectChange} = this;
        const {unitData, titleInputConstraints, descriptionInputConstraints, typeSelectConstraints, invalid} = this.privates;
        const {submitDialog, closeDialog} = this;

        if (!unitData) {
            return nothing;
        }

        return compiler`
            <bld-abstract-dialog .footerSlots=${['submit-button', 'cancel-button']}>
                <span slot="dialog-title">${unitData.id ? '#{i18n.DIALOG_TITLE__EDIT_STRUCTURE_UNIT}#' : '#{i18n.DIALOG_TITLE__CREATE_STRUCTURE_UNIT}#'}</span>
                <div slot="dialog-content">
                    <bld-abstract-input id="structure-unit-title" .value=${unitData.title || ''} .label=${'#{i18n.INPUT_LABEL__STRUCTURE_UNIT_TITLE}#'} .constraints=${titleInputConstraints} @input=${handleTitleInputInput}></bld-abstract-input>
                    <bld-vertical-spacer></bld-vertical-spacer>
                    <bld-abstract-input id="structure-unit-description" .value=${unitData.description || ''} .label=${'#{i18n.INPUT_LABEL__STRUCTURE_UNIT_DESCRIPTION}#'} .constraints=${descriptionInputConstraints} @input=${handleDescriptionInputInput}></bld-abstract-input>
                    <bld-vertical-spacer></bld-vertical-spacer>
                    <bld-abstract-select id="structure-unit-type" .value=${unitData.view ? unitData.view.type : ''} .disabled=${Boolean(unitData.id)} .label=${'#{i18n.SELECT_LABEL__STRUCTURE_UNIT_TYPE}#'} .constraints=${typeSelectConstraints} .listItems=${structureUnitTypes} @change=${handleTypeSelectChange}></bld-abstract-select>
                </div>
                <bld-action-button ?disabled=${invalid}
                   @click=${submitDialog}
                   slot="submit-button">#{i18n.BUTTON_LABEL__SUBMIT}#</bld-action-button>
                <bld-flatten-button @click=${closeDialog}
                   slot="cancel-button">#{i18n.BUTTON_LABEL__CANCEL}#</bld-flatten-button>
            </bld-abstract-dialog>
        `;
    }

    onConnect() {
        this.privates.descriptionInputConstraints = [
            ...descriptionInputConstraintsBase
        ];

        this.privates.typeSelectConstraints = [
            ...typeSelectConstraintsBase
        ];
    }

    onRender() {
        this.dialogComponent = this.shadowRoot.querySelector('bld-abstract-dialog');
        this.titleInputComponent = this.shadowRoot.querySelector('#structure-unit-title');
        this.descriptionInputComponent = this.shadowRoot.querySelector('#structure-unit-description');
        this.typeSelectComponent = this.shadowRoot.querySelector('#structure-unit-type');
    }

    async open(unitData) {
        await this.privates.firstRenderHappen;

        this.privates.unitData = Object.assign({}, unitData);

        this.privates.titleInputConstraints = [
            ...titleInputConstraintsBase,
            (() => {
                const existingStructureUnits = structureUnitsService.findStructureUnitChildren(unitData.parentId)
                    .filter(({id}) => id !== unitData.id)
                    .map(({title}) => title.toLowerCase());

                return {
                    name: 'unique-structure-unit',
                    params: [],
                    test: (value) => !existingStructureUnits.includes(value.toLowerCase()),
                    errorMessage: '#{i18n.STRUCTURE_UNIT_ERROR__NOT_UNIQUE}#'
                };
            })()
        ];

        await this.invalidate();

        await this.dialogComponent.open();
    }

    async close() {
        await this.dialogComponent.close();

        this.privates.unitData = null;

        await this.invalidate();
    }

    async submitDialog() {
        const {unitData} = this.privates;

        if (!unitData) {
            return;
        }

        if (unitData.id) {
            await structureUnitsActions.updateStructureUnit(unitData);
        } else {
            await structureUnitsActions.createStructureUnit(unitData);
        }

        this.close();
    }

    closeDialog() {
        this.close();
    }

    handleTitleInputInput() {
        const {unitData} = this.privates;

        if (!unitData) {
            return;
        }

        unitData.title = this.titleInputComponent.value;

        this.validate();
    }

    handleDescriptionInputInput() {
        const {unitData} = this.privates;

        if (!unitData) {
            return;
        }

        unitData.description = this.descriptionInputComponent.value;

        this.validate();
    }

    handleTypeSelectChange() {
        const {unitData} = this.privates;

        if (!unitData) {
            return;
        }

        unitData.view = {
            type: this.typeSelectComponent.value
        };

        this.validate();
    }

    validate() {
        this.privates.invalid = [
            this.titleInputComponent,
            this.descriptionInputComponent,
            this.typeSelectComponent
        ].some(({error}) => error);

        this.invalidate();
    }

    static get privatesDefinition() {
        return {
            invalid: createBooleanDefinition(false),
            unitData: createObjectDefinition(null),
            titleInputConstraints: createArrayDefinition([]),
            descriptionInputConstraints: createArrayDefinition([]),
            typeSelectConstraints: createArrayDefinition([])
        };
    }
}

customElements.define('bld-structure-unit-dialog', StructureUnitDialog);
