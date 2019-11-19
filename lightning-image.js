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
</style>

<img class="lightning-image" loading="lazy" />

`;




    /**
     *
     *     Custom Element
     * ----------------------
     *
     */
    class LightningImage extends HTMLElement {
        constructor() {
            super();

            // this is obviously not correct, I'm just not sure of the proper way to keep properties
            // and attributes in sync right now.
            if (!this.src && this.getAttribute('src')) {
                this.src = this.getAttribute('src');
            }

            if (!this.getAttribute('src') && this.src) {
                this.setAttribute('src', this.src);
            }

            if (!this.width && this.getAttribute('width')) {
                this.width = this.getAttribute('width');
            }

            if (!this.getAttribute('width') && this.width) {
                this.setAttribute('width', this.width);
            }

            if (!this.height && this.getAttribute('height')) {
                this.height = this.getAttribute('height');
            }

            if (!this.getAttribute('height') && this.height) {
                this.setAttribute('height', this.height);
            }

            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(this.template());
        }

        template() {
            const cloned = template.content.cloneNode(true);

            const image = cloned.querySelector('.lightning-image')
            image.width = this.getAttribute('width');
            image.height = this.getAttribute('height');
            image.src = this.getAttribute('src');

            return cloned;
        }
    }

    /**
     * Return a string that replaces our lightning- component with the original tag.
     *
     * @param element
     * @returns {string}
     */
    var replaceTag = function (element) {
        return element.outerHTML.replace(/lightning-image/g, 'img').trim();
    };

    // check if custom elements are not supported, and fall to showing the original iframe if so
    if (!('customElements' in window)) {
        return [].forEach.call(document.querySelectorAll('lightning-image'), function (el) {
            el.outerHTML = replaceTag(el);
        });
    }


    customElements.define('lightning-image', LightningImage);
})();
