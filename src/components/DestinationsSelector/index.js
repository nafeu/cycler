import React from "react";
import { includes } from "lodash";

import {
  Row,
  Col,
  Button
} from 'reactstrap';

import {
  YOUTUBE_STRATEGY_ID,
  INSTAGRAM_STRATEGY_ID,
  TWITTER_STRATEGY_ID,
} from '../../utils/constants';

const DestinationsSelector = ({ selectedDestinations, onSelectDestination }) => {
  return (
    <Row className="mb-3">
      <Col>
        <h4>Select Destinations</h4>
        <Button
          color="primary"
          outline={!includes(selectedDestinations, YOUTUBE_STRATEGY_ID)}
          onClick={() => onSelectDestination(YOUTUBE_STRATEGY_ID)}
        >
          Youtube
        </Button>
        {' '}
        <Button
          color="primary"
          outline={!includes(selectedDestinations, INSTAGRAM_STRATEGY_ID)}
          onClick={() => onSelectDestination(INSTAGRAM_STRATEGY_ID)}
        >
          Instagram
        </Button>
        {' '}
        <Button
          color="primary"
          outline={!includes(selectedDestinations, TWITTER_STRATEGY_ID)}
          onClick={() => onSelectDestination(TWITTER_STRATEGY_ID)}
        >
          Twitter
        </Button>
      </Col>
    </Row>
  )
}

export default DestinationsSelector
