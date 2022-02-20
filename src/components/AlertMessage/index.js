import React from "react";

import {
  Row,
  Col,
  Alert
} from 'reactstrap';

const AlertMessage = ({ data, showAlert }) => {
  if (!data) {
    return '';
  }

  const { message, link, color } = data;

  return (
    <Row className="justify-content-center">
      <Col xl={5}>
        {showAlert && (
          <Alert
            color={color}
          >
            {link ? (
              <a
                className="alert-link"
                href={link}
              >
                {message}
              </a>
            ) : (
              message
            )}
          </Alert>
        )}
      </Col>
    </Row>
  )
}

export default AlertMessage
