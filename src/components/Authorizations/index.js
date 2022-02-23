import React, { Fragment } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Spinner
} from 'reactstrap';

const Authorizations = ({ authorizations }) => (
  <Row className="mb-3">
    <Col>
      <h4>Authorize Access</h4>
      {authorizations.length === 0 && (
        <Fragment>
          <Spinner size="sm">
            {''}
          </Spinner>
          {' '}
        </Fragment>
      )}
      {authorizations.map(({
        id,
        label,
        authorized,
        authUrl
      }) => {
        return (
          <Fragment key={id}>
            <a href={authUrl}>
              <Button color={authorized ? 'success' : 'danger'}>
                {label} {authorized ? '✔' : '×'}
              </Button>
            </a>
            {' '}
          </Fragment>
        );
      })}
    </Col>
  </Row>
)

export default Authorizations
