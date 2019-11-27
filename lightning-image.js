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
.lightning-image {
    display: inline-block;
}
</style>

<div class="lightning-image">
</div>

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

            this.img = this.getImageToBeInserted();

            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(this.template());
        }

        connectedCallback() {
            if (this.supportsNativeLazyLoading()) {
                this.img.loading = 'lazy';
                this.insertImage();

                return;
            }

            // no native lazy loading for the browser
            this.setupObserver();
        }

        template() {
            const cloned = template.content.cloneNode(true);

            const container = cloned.querySelector('.lightning-image')
            const width = this.getAttribute('width') || 0;
            const height = this.getAttribute('height') || 0;
            container.style.width = width + 'px';
            container.style.height = height + 'px';

            return cloned;
        }

        getImageToBeInserted() {
            const template = document.createElement('template');
            template.innerHTML = replaceTag(this);
            const img = template.content.firstChild;

            return img;
        }

        supportsNativeLazyLoading() {
            return 'loading' in HTMLImageElement.prototype;
        }

        setupObserver() {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.insertImage();
                        observer.unobserve(this);
                    }
                })
            }, { rootMargin: '0px' });

            observer.observe(this);
        }

        insertImage() {
            const container = this.shadowRoot.querySelector('.lightning-image');
            container.appendChild(this.img);
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
