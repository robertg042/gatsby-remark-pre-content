const visit = require('unist-util-visit');
const qs = require('query-string');

module.exports = function gatsbyRemarkPreContent({ markdownAST }, options) {
  visit(markdownAST, 'code', (node, index) => {
    const [language, params] = (node.lang || '').split(':');
    const parsed = qs.parse(params);
    const { expose } = parsed;

    if (expose === 'true') {
      let { value } = markdownAST.children[index];
      value = value
        .replace(/"/gm, '&quot;')
        .replace(/`/gm, '\\`')
        .replace(/\$/gm, '\\$');

      const customNode = {
        type: 'html',
        value: `
            <precontent
              content="${value}"
            >
            </precontent>
            `.trim(),
      };

      markdownAST.children.splice(index, 0, customNode);
      parsed.expose = 'false';
    } else if (expose === 'false') {
      delete parsed.expose;
    }

    let newQuery = '';
    if (Object.keys(parsed).length) {
      newQuery = `:${Object.keys(parsed)
        .map((key) => {
          return `${key}=${parsed[key]}`;
        })
        .join('&')}`;
    }

    node.lang = language + newQuery;
  });
};
