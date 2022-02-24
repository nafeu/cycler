import React from "react";
import './index.css';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';

const PayloadPreview = ({ payload }) => (
  <Row className="justify-content-center">
    <Col>
      <Card>
        <CardBody>
          <CardTitle tag="h5">
            Payload Preview
          </CardTitle>
          <pre className="payload-preview-code">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </CardBody>
      </Card>
    </Col>
  </Row>
)

export default PayloadPreview
