import React, { useEffect, useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import axios from "axios";

import { includes, xor } from "lodash";

import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button
} from 'reactstrap';

const DEFAULT_PAYLOAD = {
  mediaType: null,
  destinations: []
}

const MEDIA_TYPE_VIDEO = 'video';
const MEDIA_TYPE_IMAGE = 'image';

const VALID_MEDIA_TYPES = [MEDIA_TYPE_VIDEO, MEDIA_TYPE_IMAGE];

const DESTINATION_YOUTUBE   = 'youtube';
const DESTINATION_INSTAGRAM = 'instagram';
const DESTINATION_TWITTER = 'twitter';

const AppContainer = ({ children }) => {
  return (
    <Container className="p-4">
      <Row className="justify-content-center">
        <Col xl={8}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

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

const PayloadPreview = ({ payload }) => (
  <Row className="justify-content-center">
    <Col xl={5}>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            Payload Preview
          </CardTitle>
          <pre>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </CardBody>
      </Card>
    </Col>
  </Row>
)

function App() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);

  const handleSelectMediaType = mediaType => {
    setPayload({ ...payload, mediaType });
  }

  const handleSelectDestination = destination => {
    setPayload({
      ...payload,
      destinations: xor(payload.destinations, [destination])
    });
  }

  const { mediaType, destinations } = payload;

  const isValidMediaType = includes(VALID_MEDIA_TYPES, mediaType);

  return (
    <Fragment>
      <h1 className="text-center">Cycler<span className="thin"> Multimedia Crossposting</span></h1>
      <AppContainer>
        <MediaTypeSelector
          selectedMediaType={mediaType}
          onSelectMediaType={handleSelectMediaType}
        />

        {isValidMediaType && (
          <DestinationsSelector
            selectedDestinations={destinations}
            onSelectDestination={handleSelectDestination}
          />
        )}
      </AppContainer>
      <PayloadPreview payload={payload}/>
    </Fragment>
  )
}

export default App;
