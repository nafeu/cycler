import React from "react";
import { includes } from "lodash";

import {
  Row,
  Col,
  Button
} from 'reactstrap';

import {
  DESTINATION_YOUTUBE,
  DESTINATION_INSTAGRAM,
  DESTINATION_TWITTER,
} from '../../utils/constants';

const DestinationsSelector = ({ selectedDestinations, onSelectDestination }) => {
  return (
    <Row className="mb-3">
      <Col>
        <p>Select Destinations</p>
        <Button
          color="primary"
          outline={!includes(selectedDestinations, DESTINATION_YOUTUBE)}
          onClick={() => onSelectDestination(DESTINATION_YOUTUBE)}
        >
          Youtube
        </Button>
        {' '}
        <Button
          color="primary"
          outline={!includes(selectedDestinations, DESTINATION_INSTAGRAM)}
          onClick={() => onSelectDestination(DESTINATION_INSTAGRAM)}
        >
          Instagram
        </Button>
        {' '}
        <Button
          color="primary"
          outline={!includes(selectedDestinations, DESTINATION_TWITTER)}
          onClick={() => onSelectDestination(DESTINATION_TWITTER)}
        >
          Twitter
        </Button>
      </Col>
    </Row>
  )
}

export default DestinationsSelector
