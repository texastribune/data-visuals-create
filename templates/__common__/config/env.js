const VALID_NODE_ENVS = ['development', 'production'];
const DEFAULT_NODE_ENV = 'production';

const NODE_ENV = process.env.NODE_ENV;

const nodeEnv =
  NODE_ENV && VALID_NODE_ENVS.includes(NODE_ENV) ? NODE_ENV : DEFAULT_NODE_ENV;
const isProductionEnv = nodeEnv === 'production';

module.exports = {
  isProductionEnv,
  nodeEnv,
};
