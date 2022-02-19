import React from "react";

import { Container, Row, Col } from 'reactstrap';

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

export default AppContainer
