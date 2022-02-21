import React from "react";
import { includes } from "lodash";

import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

import { getStrategyFieldValue } from '../../utils/helpers';
import { YOUTUBE_STRATEGY_ID } from '../../utils/constants';

const TextField = ({
  onChangeText,
  placeholder,
  label,
  fieldId,
  fieldValue,
  strategyId
}) => {
  const handleChangeText = event => {
    onChangeText({
      value: event.target.value,
      fieldId,
      strategyId
    });
  }

  return (
    <FormGroup row className="mb-2">
      <Label sm={2} >
        {label}
      </Label>
      <Col sm={10}>
        <Input
          placeholder={placeholder}
          type="text"
          onChange={handleChangeText}
          value={fieldValue}
        />
      </Col>
    </FormGroup>
  )
}

const CheckboxField = ({
  onToggleCheckbox,
  label,
  fieldId,
  fieldValue,
  strategyId
}) => {
  const handleToggleCheckbox = event => {
    onToggleCheckbox({
      value: event.target.checked,
      fieldId,
      strategyId
    });
  }

  return (
    <FormGroup row check className="mb-2">
      <Col sm={10}>
        <Input
          type="checkbox"
          onChange={handleToggleCheckbox}
          value={fieldValue}
        />
        {' '}
        <Label check>
          {label}
        </Label>
      </Col>
    </FormGroup>
  )
}

const YoutubeStrategy = ({ onChangeField, payload }) => {
  const strategyId = 'youtube';

  return (
    <Row className="mb-3">
      <h4>Enter Youtube Video Details</h4>
      <Col>
        <Form>
          <TextField
            strategyId={strategyId}
            fieldId="title"
            label="Title"
            placeholder="Enter Video Title"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "title" })
            }
            onChangeText={onChangeField}
          />
          <TextField
            strategyId={strategyId}
            fieldId="description"
            label="Description"
            placeholder="Enter Video Description"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "description" })
            }
            onChangeText={onChangeField}
          />
          <TextField
            strategyId={strategyId}
            fieldId="tags"
            label="Tags"
            placeholder="Enter Tags"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "tags" })
            }
            onChangeText={onChangeField}
          />
          <TextField
            strategyId={strategyId}
            fieldId="categoryIds"
            label="Category IDs"
            placeholder="Enter Category IDs"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "categoryIds" })
            }
            onChangeText={onChangeField}
          />
          <CheckboxField
            strategyId={strategyId}
            fieldId="privacyStatus"
            label="Make Video Private"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "privacyStatus" })
            }
            onToggleCheckbox={onChangeField}
          />
        </Form>
      </Col>
    </Row>
  )
}

export default YoutubeStrategy
