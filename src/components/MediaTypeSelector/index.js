import React from "react";

import {
  Row,
  Col,
  Button
} from 'reactstrap';

import {
  MEDIA_TYPE_VIDEO,
  MEDIA_TYPE_IMAGE,
} from '../../utils/constants';

const MediaTypeSelector = ({ selectedMediaType, onSelectMediaType }) => {
  return (
    <Row className="mb-3">
      <Col>
        <p>Select Media Type</p>
        <Button
          color="primary"
          outline={selectedMediaType !== MEDIA_TYPE_VIDEO}
          onClick={() => onSelectMediaType(MEDIA_TYPE_VIDEO)}
        >
          Video
        </Button>
        {' '}
        <Button
          color="primary"
          outline={selectedMediaType !== MEDIA_TYPE_IMAGE}
          onClick={() => onSelectMediaType(MEDIA_TYPE_IMAGE)}
        >
          Image
        </Button>
      </Col>
    </Row>
  )
}

export default MediaTypeSelector
