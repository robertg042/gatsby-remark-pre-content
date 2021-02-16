# gatsby-remark-pre-content

Exposes `pre` tag content and passes it to the custom node named `precontent` which can be later consumed with `MDXProvider` component.

It's based on [gatsby-remark-code-buttons](https://github.com/iamskok/gatsby-remark-code-buttons) package.

## Install

```bash
npm install gatsby-remark-pre-content --save-dev
```

## How to use

### in `gatsby-config.js`

```js
{
  resolve: `gatsby-plugin-mdx`,
  options: {
    gatsbyRemarkPlugins: [
      'gatsby-remark-pre-content' // add before any plugins that transforms code blocks
	]
  }
}
```

### Enable in Markdown

In order to enable plugin for certain `<pre>` put `expose=true` next to lang definition in the Markdown:

``````js
```js:expose=true
var foo = 'bar';
```
``````

This plugin parses the Markdown AST, for every `code` node. It checks for `expose` directive attached to lang. When it finds one that is equal to `true`, it injects custom `precontent` html node into the Markdown AST tree before `code` node found.

Make sure you use it as a shortcode in `MDXProvider` component or the `html` output will look similar to this one:

```html
<precontent content="... <pre> content ..."></precontent>
```

### Usage with `MDXProvider`
```jsx
import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {YourCustomComponent} from './components';

export default class Layout extends React.Component {
  state = {
    precontent: ({content}) => (<YourCustomComponent preContent={content} />),
  }
  render() {
    return (
      <MDXProvider components={this.state}>
        <main {...this.props} />
      </MDXProvider>
    )
  }
}
```

### Example use case

Example use case where you can find this package useful is creating code snippet copy button component.

Provided `<pre>` content will contain all comments that you may use as directives for highlighting packages like [gatsby-remark-prismjs](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-prismjs) or [gatsby-remark-vscode](https://github.com/andrewbranch/gatsby-remark-vscode).

You can find help with stripping such comments here:
[MDX copy button](https://github.com/gatsbyjs/gatsby/pull/15834).
