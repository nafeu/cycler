import { filter, find } from 'lodash';
import { DEFAULT_YOUTUBE_FIELDS, YOUTUBE_STRATEGY_ID } from './constants';

export const getStrategiesDefault = ({ destination, strategies }) => {
  const existingStrategy = find(strategies, { id: destination })

  if (existingStrategy) {
    return filter(strategies, ({ id }) => id !== destination);
  }

  let fields = {}

  if (destination === YOUTUBE_STRATEGY_ID) {
    fields = {
      ...fields,
      ...DEFAULT_YOUTUBE_FIELDS
    }
  }

  return [...strategies, { id: destination, fields }]
}

export const getStrategyFieldValue = ({ payload, strategyId, fieldId }) => {
  const strategy = find(payload.strategies, { id: strategyId });

  return strategy[fieldId];
}
