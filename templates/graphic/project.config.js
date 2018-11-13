module.exports = {
  id: '<<id>>',
  projectType: 'graphic',
  bucket: 'graphics.texastribune.org',
  folder: 'graphics/<<slug>>-<<year>>-<<month>>',
  files: [
    {
      fileId: '1ehh3ISrwq5lHNQS-eEs_i30Wi7UAF9txWgYTo56NFBI',
      type: 'doc',
      name: 'text',
    },
    {
      fileId: '1EACmSpajC1V7nJtwIxfA9aR-HAbTSDugSjStSSKWEaE',
      type: 'sheet',
      name: 'data',
    },
  ],
  /**
   * The dataMutators option makes it possible to modify what's returned by
   * the data fetchers. This is a good place to restructure the raw data, or
   * to do joins with other data you may have.
   */
  dataMutators: {
    // the function name should match one of the `name` values in `files`
    data(originalData) {
      // what you return in this function is what ends up in the JSON file
      return originalData;
    },
  },

  /**
   * `createAPI` makes it possible to bake out a series of JSON files that get
   * deployed with your project. This is a great way to break up data that users
   * only need a small slice of based on choices they make. The toolkit expects
   * this to return an array of objects. Each object should have a "key" and
   * a "value" - the "key" determines the URL, the "value" is what is saved at
   * that URL.
   */
  createAPI(data) {
    return null;
  },
};
