module.exports = function parseData(rawData, rowKey, limitColumns) {
  // get the keys of the first object
  const keys = Object.keys(rawData[0]);

  // get all the row names based on the row key
  const rowNames = rawData.map(d => d[rowKey]);

  // check if the limitColumns parameter was passed
  const hasLimitColumns = limitColumns != null;

  // get all the column names that aren't the row key, or explicitly included
  const columnNames = keys.filter(
    k => k !== rowKey && (hasLimitColumns ? limitColumns.includes(k) : true)
  );

  // sometimes we need to calculate extents - this helps with that
  const values = [];

  // sometimes we need to have all the values in a series in an array
  const _seriesValues = [];

  // the data in a new, better format
  const series = columnNames.map(columnName => {
    const _values = rawData.map(d => {
      const rowName = d[rowKey];
      const value = d[columnName];

      values.push(value);

      return {
        columnName,
        rowName,
        value,
      };
    });

    _seriesValues.push(_values);

    return {
      columnName,
      values: _values,
    };
  });

  const seriesValues = _seriesValues.reduce(
    (acc, current) => acc.concat(current),
    []
  );

  return {
    rowNames,
    columnNames,
    series,
    seriesValues,
    values,
  };
};
