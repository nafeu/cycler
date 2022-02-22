import React from "react";

import {
  Row,
  Col,
  Button,
  Spinner,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap';

import { isEmpty } from 'lodash';

const Publisher = ({ onClickPublish, result, isPublishing }) => {
  const hasResults = !isEmpty(result);

  return (
    <Row className="mb-3">
      <Col>
        <h4>Confirm and Publish Content</h4>
        <Button
          color="primary"
          onClick={onClickPublish}
          disabled={isPublishing}
          className="mb-3"
        >
          {isPublishing ? (
            <Spinner size="sm">
              {''}
            </Spinner>
          ) : 'Submit'}
        </Button>
        {hasResults && (
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                Publishing Results
              </CardTitle>
              <pre>
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  )
}

export default Publisher
