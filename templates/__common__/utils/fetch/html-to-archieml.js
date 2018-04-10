'use strict';

const url = require('url');

const Entities = require('html-entities').AllHtmlEntities;
const htmlparser = require('htmlparser2');
const archieml = require('archieml');

/**
 * Consumes raw Google Docs HTML and converts it to an ArchieML object.
 * Wholesale borrowed from https://github.com/newsdev/archieml-js/blob/master/examples/google_drive.js
 *
 * @param  {String} rawHtml
 * @param  {Function} callback
 */
function htmlToArchieML(rawHtml, callback) {
  const handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) callback(err);

    const body = dom[0].children[1];

    const tagHandlers = {
      base: function(tag) {
        let str = '';

        tag.children.forEach(function(child) {
          if (tagHandlers[child.name || child.type]) {
            const func = tagHandlers[child.name || child.type];
            str += func(child);
          }
        });

        return str;
      },
      text: function(textTag) {
        return textTag.data;
      },
      span: function(spanTag) {
        return tagHandlers.base(spanTag);
      },
      p: function(pTag) {
        return tagHandlers.base(pTag) + '\n';
      },
      a: function(aTag) {
        let href = aTag.attribs.href;

        if (href === undefined) return '';

        if (
          aTag.attribs.href &&
          url.parse(aTag.attribs.href, true).query &&
          url.parse(aTag.attribs.href, true).query.q
        ) {
          href = url.parse(aTag.attribs.href, true).query.q;
        }

        let str = '<a href="' + href + '">';
        str += tagHandlers.base(aTag);
        str += '</a>';

        return str;
      },
      li: function(tag) {
        return '* ' + tagHandlers.base(tag) + '\n';
      },
    };
    ['ul', 'ol'].forEach(function(tag) {
      tagHandlers[tag] = tagHandlers.span;
    });
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(tag) {
      tagHandlers[tag] = tagHandlers.p;
    });

    var parsedText = tagHandlers.base(body);
    var entities = new Entities();
    parsedText = entities.decode(parsedText);

    parsedText = parsedText.replace(/<[^<>]*>/g, function(match) {
      return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
    });

    callback(null, archieml.load(parsedText));
  });

  var parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}

module.exports = htmlToArchieML;
