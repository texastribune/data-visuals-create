// packages
const archieml = require('archieml');
const dlv = require('dlv');
const { google } = require('googleapis');

function readParagraphElement(element) {
  const textRun = element.textRun;

  if (textRun) {
    const content = textRun.content;
    const url = dlv(textRun, 'textStyle.link.url');

    if (url) {
      return `<a href="${url}">${content}</a>`;
    } else {
      return content || '';
    }
  } else {
    return '';
  }
}

function readElements(document) {
  // prepare the text holder
  let text = '';

  // check if the content key exists, and give up if not
  if (!document.body) return text;
  if (!document.body.content) return text;

  // loop through each content element in the body
  document.body.content.forEach(element => {
    if (element.paragraph) {
      const paragraph = element.paragraph;

      // this is a list
      const needsBullet = paragraph.bullet != null;

      // all values in the element
      const values = paragraph.elements;

      values.forEach((value, idx) => {
        // we only need to add a bullet to the first value, so we check
        const isFirstValue = idx === 0;

        // prepend an asterisk if this is a list item
        const prefix = needsBullet && isFirstValue ? '* ' : '';

        // concat the text
        text += `${prefix}${readParagraphElement(value)}`;
      });
    }
  });

  return text;
}

async function docToArchieML({ auth, documentId }) {
  // create docs client
  const docs = google.docs({
    version: 'v1',
    auth,
  });

  // pull the data out of the doc
  const { data } = await docs.documents.get({
    documentId,
  });

  // convert docs content to text
  const text = readElements(data);

  // pass text to ArchieML and return results
  return archieml.load(text);
}

module.exports = { docToArchieML };
