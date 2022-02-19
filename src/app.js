import React, { useEffect, useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import axios from "axios";

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
  CardText
} from 'reactstrap';

const DEFAULT_PAYLOAD = {
  mediaType: null
}

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
    <FormGroup>
      <Label for="media-type-selector">
        Select Media Type
      </Label>
      <Input
        id="media-type-selector"
        name="select"
        type="select"
        value={selectedMediaType}
        onChange={event => onSelectMediaType(event.target.value)}
      >
        <option value="">
          Please select a media type.
        </option>
        <option value="video">
          Video
        </option>
        <option value="image">
          Image
        </option>
      </Input>
    </FormGroup>
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
          <CardText>
            <pre>
              {JSON.stringify(payload, null, 2)}
            </pre>
          </CardText>
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

  const { mediaType } = payload;

  return (
    <Fragment>
      <h1 className="text-center">Cycler<span className="thin"> Multimedia Crossposting</span></h1>
      <AppContainer>
        <MediaTypeSelector
          selectedMediaType={mediaType}
          onSelectMediaType={handleSelectMediaType}
        />
      </AppContainer>
      <PayloadPreview payload={payload}/>
    </Fragment>
  )
}

export default App;
