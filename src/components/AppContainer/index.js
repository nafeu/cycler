import React from "react";

import { Container, Row, Col } from 'reactstrap';

const AppContainer = ({ children }) => {
  return (
    <Container className="px-4 pb-3">
      <Row className="justify-content-center">
        <Col xl={8}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default AppContainer
