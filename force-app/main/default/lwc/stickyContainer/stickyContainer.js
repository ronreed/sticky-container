const GUTTER_SIZE_PX = 13;
const COMPACT_VIEW_SIZE_PX = 72;
const CONTAINER_CLASS_RELATIVE = "sticky-container";
const CONTAINER_CLASS_FIXED = "sticky-container fixed";

import { LightningElement, api } from "lwc";

export default class StickyContainer extends LightningElement {
    @api
    highlightsPanelAboveContainer = false;

    @api
    highlightsPanelCompactViewEnabled = false;

    hasRendered = false;
    isFixed = false;
    startingTop;

    containerClass = CONTAINER_CLASS_RELATIVE;
    containerStyle;
    emptyStyle;

    get _isFixed() {
        return this.isFixed;
    }

    set _isFixed(value) {
        this.isFixed = value;
        if (this.isFixed) {
            this.containerClass = CONTAINER_CLASS_FIXED;
            this.containerStyle =
                "transform :translate3d(0, -" + this.fixedPosition + "px, 0)";
            this.emptyStyle = "height: " + this.containerRect.height + "px";
        } else {
            this.containerClass = CONTAINER_CLASS_RELATIVE;
            this.containerStyle = "";
        }
    }

    get container() {
        return this.template.querySelector('[data-id="container"]');
    }

    get containerRect() {
        return this.container.getBoundingClientRect();
    }

    get fixedPosition() {
        let position = GUTTER_SIZE_PX;
        if (
            this.highlightsPanelAboveContainer === true ||
            this.highlightsPanelAboveContainer === "true"
        ) {
            position += GUTTER_SIZE_PX;
            if (
                this.highlightsPanelCompactViewEnabled === true ||
                this.highlightsPanelCompactViewEnabled === "true"
            ) {
                position += COMPACT_VIEW_SIZE_PX;
            }
        }
        return position;
    }

    renderedCallback() {
        if (!this.hasRendered) {
            this.hasRendered = true;
            this.startingTop = this.containerRect.y;
        }
    }

    connectedCallback() {
        window.addEventListener("scroll", () => this.onScrollEvent());
    }

    onScrollEvent = () => {
        if (!this._isFixed && this.hasReachedFixedPosition()) {
            this._isFixed = true;
        } else if (this._isFixed && this.hasReachedRelativePosition()) {
            this._isFixed = false;
        }
    };

    hasReachedFixedPosition() {
        return this.containerRect.y <= this.startingTop - this.fixedPosition;
    }

    hasReachedRelativePosition() {
        return window.scrollY <= this.fixedPosition;
    }
}
