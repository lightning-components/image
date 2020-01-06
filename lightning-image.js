(function() {
    /*
     *
     *     Shadow DOM Template
     * ---------------------------
     *
     */
    const template = document.createElement('template');
    template.innerHTML = `

<style>
:host {
    display: inline; /* if display: contents is not supported, then use the same default display style as an img tag */
    display: contents; /* treat the lightning-image container as if it isn't there */
}
</style>

<!-- We want the img element to live outside of the shadowDOM so that it is fully query-able, style-able, etc as if it wasn't
 inside the shadowDOM at all. The <slot> element allows us to accomplish this. -->
<slot></slot>

`;


    /**
     *
     *     Custom Element
     * ----------------------
     *
     */
    class LightningImage extends HTMLElement {
        /**
         * This is a simple 1x1 white pixel encoded as base64.
         */
        static get PIXEL_BASE_64() { return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQIHWP4DwABAQEANl9ngAAAAABJRU5ErkJggg==' };

        constructor() {
            super();

            // https://developers.google.com/web/fundamentals/web-components/best-practices#create-your-shadow-root-in-the-constructor
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(this.template());
        }

        /**
         * Ensure src property is reflected to an attribute.
         * https://developers.google.com/web/fundamentals/web-components/customelements#properties_and_attributes
         */
        set src(value) {
            if (!value) {
                return this.removeAttribute('src');
            }

            this.setAttribute('src', value);
        }

        get src() {
            return this.getAttribute('src');
        }

        set width(value) {
            if (!value) {
                return this.removeAttribute('width');
            }

            this.setAttribute('width', value);
        }

        get width() {
            return this.getAttribute('src');
        }

        set height(value) {
            if (!value) {
                return this.removeAttribute('height');
            }

            this.setAttribute('height', value);
        }

        get height() {
            return this.getAttribute('src');
        }

        connectedCallback() {
            // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
            this._upgradeProperty('src');
            this._upgradeProperty('width');
            this._upgradeProperty('height');

            // store the img, so that we can directly reference it in the future
            this.img = this.createImg();
            // insert the img element directly into the light DOM, and have it project to the shadowDOM via the <slot> element.
            this.appendChild(this.img);

            // if the browser supports native lazy loading (only Chrome at time of writing), then
            // simply use that instead of using our own lazy loading implementation.
            if (!this.supportsNativeLazyLoading()) {
                this.setupObserver();
            }
        }

        template() {
            // See the note that indicates cloning is better than setting innerHTML
            // https://developers.google.com/web/fundamentals/web-components/customelements#shadowdom
            const cloned = template.content.cloneNode(true);

            return cloned;
        }

        createImg() {
            // we want to create an img tag element that is the same as the lightning-image
            // component, except it has a src that will not cause any additional network requests
            const tpl = document.createElement('template');
            tpl.innerHTML = replaceTag(this);
            const imgTag = tpl.content.firstChild;

            if (this.supportsNativeLazyLoading()) {
                // for browsers that support native lazy loading, return the true img tag
                // with the real src but ensure it has the loading=lazy attribute
                imgTag.loading = 'lazy';
                imgTag.src = this.src;
            } else {
                // for browsers without native lazy loading support, replace the src with a very simple pixel image.
                imgTag.src = LightningImage.PIXEL_BASE_64;
            }

            return imgTag;
        }

        supportsNativeLazyLoading() {
            return 'loading' in HTMLImageElement.prototype;
        }

        setupObserver() {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // here we are replacing the pixel image with the original image
                        this.img.src = this.src;

                        observer.unobserve(this);
                    }
                })
            }, { rootMargin: '0px' });

            // observe our pixel image
            observer.observe(this.img);
        }

        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
    }

    /**
     * Return a string that replaces our lightning- component with the original tag.
     *
     * @param element
     * @returns {string}
     */
    var replaceTag = function (element) {
        // custom elements are required to have a closing tag, but regular img tags do not use a closing tag.
        // remove our closing tag here so that we can do a normal search and replace in the next step
        const closingTagRemoved = element.outerHTML.replace(/<\/lightning-image>/g, '');

        return closingTagRemoved.replace(/lightning-image/g, 'img').trim();
    };

    // check if custom elements are not supported, and fall to showing the original img tag if so
    if (!('customElements' in window)) {
        return [].forEach.call(document.querySelectorAll('lightning-image'), function (el) {
            el.outerHTML = replaceTag(el);
        });
    }


    customElements.define('lightning-image', LightningImage);
})();
