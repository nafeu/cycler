import React from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';

const PayloadPreview = ({ payload }) => (
  <Row className="justify-content-center">
    <Col xl={8}>
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

export default PayloadPreview
