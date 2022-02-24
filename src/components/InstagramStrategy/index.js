import React from "react";

import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

import Select from 'react-select'

import TextField from '../TextField';

import { getStrategyFieldValue } from '../../utils/helpers';
import { INSTAGRAM_STRATEGY_ID } from '../../utils/constants';

const InstagramStrategy = ({ onChangeField, payload }) => {
  const strategyId = INSTAGRAM_STRATEGY_ID;

  return (
    <Row className="mb-3">
      <h4 className="social-info-header">Enter Instagram Post Details</h4>
      <Col>
        <Form>
          <TextField
            strategyId={strategyId}
            fieldId="caption"
            label="Caption"
            placeholder="Enter Caption"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "caption" })
            }
            onChangeText={onChangeField}
            multiline
          />
        </Form>
      </Col>
    </Row>
  )
}

export default InstagramStrategy
