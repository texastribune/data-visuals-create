const fs = require('fs');

// return part of URL based on data type
function dataType(type) {
  if (type === 'doc') return 'document';
  if (type === 'sheet' || type === 'gsheet') return 'spreadsheets';
}

// update readme with project link and links to data sources
let updateReadMe = async (paths, mainPath, files) => {
  // read README and split it by line breaks
  let readMe = fs
    .readFileSync(`${paths.appDirectory}/README.md`)
    .toString()
    .split('\n');

  let startLine = 3;

  // add project link
  if (readMe[startLine] != '') {
    // if link exists, update it
    readMe[startLine] = `[Link to your project](${mainPath})`;
  } else {
    // insert project link
    readMe.splice(startLine, 0, `[Link to your project](${mainPath})`);
  }

  // add data link(s)
  for (let i = startLine + 1; i <= startLine + files.length; i++) {
    let dataLink = `https://docs.google.com/${dataType(
      files[i - (startLine + 1)].type
    )}/d/${files[i - (startLine + 1)].fileId}`;

    // if link exists, update it
    if (readMe[i] != '') {
      readMe[i] = `[Link to your ${
        files[i - (startLine + 1)].type
      }](${dataLink})`;
    } else {
      // insert data link
      readMe.splice(
        i,
        0,
        `[Link to your ${files[i - (startLine + 1)].type}](${dataLink})`
      );
    }
  }

  // write updated text to the README
  fs.writeFile(`${paths.appDirectory}/README.md`, readMe.join('\n'), err => {
    if (err) return console.log(err);
  });
};

module.exports = { updateReadMe, dataType };
