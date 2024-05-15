"use strict";
/**
 * The annotation menu item used to display a custom button on the annotation menu.
 * @typedef AnnotationContextualMenuItem
 * @memberof Annotation
 * @property {string} id - The unique identifier for the custom annotation menu button. This will be used to identify the button in the ```onCustomAnnotationContextualMenuItemTapped``` callback. On Android the ID needs to be specified as a resource item inside your application's ```ids.xml``` file.
 * @property {string} image - The image name (iOS) or resource ID (Android) for the toolbar button. Images must be included in the application bundle on iOS and specified as a drawable resource on Android. System image names can also be used on iOS, for example ```multiply.circle.fill```. On iOS the image will only be used if no title is specified.
 * @property {string} [title] - The title of the toolbar button. If no title is set, the image will be used.
 * @property {boolean} [selectable] - Whether the button should be selectable or not. If the button is selectable, it will remain highlighted after being tapped (Android only).
 */
/**
 * The object to customize the menu shown when selecting an annotation.
 * @typedef AnnotationContextualMenu
 * @memberof Annotation
 * @property { AnnotationContextualMenuItem[] } buttons The annotation menu items to display when an annotation is selected.
 * @property { Annotation.ContextualMenuType } [menuType] Specifies the type of annotation menu to customize.
 * @property { Boolean } [retainSuggestedMenuItems] Specifies whether the PSPDFKit suggested annotation menu items should be retained when custom annotation menu items are set.
 * @property { Annotation.ContextualMenuAppearance } [appearance] Specifies for which appearance mode this change should apply to (iOS only).
 * @property { Annotation.ContextualMenuItemPosition } [position] - The position where the buttons should be added in the menu.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annotation = void 0;
/**
 * @namespace Annotation
 */
var Annotation = /** @class */ (function () {
    function Annotation() {
    }
    return Annotation;
}());
exports.Annotation = Annotation;
(function (Annotation) {
    /**
     * A set of flags specifying various characteristics of the annotation.
     * @readonly
     * @enum {string} Flags
     */
    Annotation.Flags = {
        /**
         * If set, do not display or print the annotation or allow it to interact with the user.
         */
        HIDDEN: 'hidden',
        /**
         * If set, ignore annotation AP stream if there is no handler available.
         */
        INVISIBLE: 'invisible',
        /**
         * If set, don’t allow the annotation to be deleted or its properties to be modified, except for contents.
         */
        LOCKED: 'locked',
        /**
         * If set, don’t allow the contents of the annotation to be modified by the user.
         */
        LOCKED_CONTENTS: 'lockedContents',
        /**
         * If set, print the annotation when the page is printed.
         */
        PRINT: 'documentEditorButtonItem',
        /**
         * If set, don’t allow the annotation to be deleted or its properties to be modified, including contents.
         */
        READ_ONLY: 'readOnly',
        /**
         * If set, don’t display the annotation on the screen. (But printing might be allowed)
         */
        NO_VIEW: 'noView',
        /**
         * If set, don’t scale the annotation’s appearance to match the magnification of the page. Supported only for FILE and STAMP annotations. (Android only)
         */
        NO_ZOOM: 'noZoom'
    };
    /**
    * The available appearance options of the edit menu. (iOS only)
    * @readonly
    * @enum {string} PDFViewMode
    */
    Annotation.ContextualMenuAppearance = {
        /**
         * The edit menu appears as a horizontal bar.
         */
        HORIZONTAL_BAR: 'horizontalBar',
        /**
         * The edit menu appears as a context menu.
         */
        CONTEXT_MENU: 'contextMenu',
    };
    /**
     * The type of annotation menu to customize.
     * @readonly
     * @enum {string} MenuType
     */
    Annotation.ContextualMenuType = {
        /**
         * Customize the Annotation Selection Menu.
         */
        SELECTION: 'selection',
    };
    /**
     * The position of the annotation menu items.
     * @readonly
     * @enum {string} Position
     */
    Annotation.ContextualMenuItemPosition = {
        /**
         * Add the new buttons at the start of the menu.
         */
        START: 'start',
        /**
         * Add the new buttons at the end of the menu.
         */
        END: 'end',
    };
})(Annotation || (exports.Annotation = Annotation = {}));
