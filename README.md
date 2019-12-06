# Lightning Components - Image

Improve your websites page speed performance by replacing regular old `img` tags with `lightning-image` tags.

## Features

- Lazy load images that are not yet on screen to improve performance.
- Supports all attributes that would go on a basic `img` tag.
- It's just a vanilla web component, no frameworks to install.
- Will use the browser's built in native lazy loading if it supports it.

## Install

This component can be used as part of the entire lightning-components ecosystem or as a a standalone component.

###### Install with npm

```
npm install @lightning-components/image
```

After installing, import it into your project.

```
import '@lightning-components/image'
```

## Usage

As with all lightning-components, you simply replace the original tag with it's `lighting-tag` inspired counterpart.

So if this was the original `img` tag on your page:
```html
<img src="https://placehold.it/400x400" alt="Placeholder Image">
```
You would rewrite that as:
```html
<lightning-image src="https://placehold.it/400x400" alt="Placeholder Image"></lightning-image>
```

Keep all of the original attributes, classes, id's, etc. the same and just replace `img` with `lightning-image`

> ##### NOTE since `img` tags do not use a closing tag, you will need to make sure that you don't forget to add the closing `</lightning-image>` tag.
