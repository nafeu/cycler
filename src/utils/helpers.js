import { filter, find } from 'lodash';

export const getStrategiesDefault = ({ destination, strategies }) => {
  const existingStrategy = find(strategies, { id: destination })

  if (existingStrategy) {
    return filter(strategies, ({ id }) => id !== destination);
  }

  return [...strategies, { id: destination, fields: {} }]
}

export const getStrategyFieldValue = ({ payload, strategyId, fieldId }) => {
  const strategy = find(payload.strategies, { id: strategyId });

  return strategy[fieldId];
}
