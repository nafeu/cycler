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

import { getStrategyFieldValue } from '../../utils/helpers';
import { YOUTUBE_STRATEGY_ID, YOUTUBE_VIDEO_CATEGORIES } from '../../utils/constants';

const Categories = ({
  onChangeCategory,
  placeholder,
  label,
  fieldId,
  fieldValue,
  strategyId
}) => {
  const handleSelectCategory = ({ value }) => {
    onChangeCategory({
      value,
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
        <Select
          options={YOUTUBE_VIDEO_CATEGORIES}
          onChange={handleSelectCategory}
        />
      </Col>
    </FormGroup>
  )
}

const TextField = ({
  onChangeText,
  placeholder,
  label,
  fieldId,
  fieldValue,
  strategyId,
  multiline,
  maxLength
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
          type={multiline ? "textarea" : "text"}
          onChange={handleChangeText}
          value={fieldValue}
          maxLength={maxLength}
        />
      </Col>
    </FormGroup>
  )
}

/*
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
*/

const YoutubeStrategy = ({ onChangeField, payload }) => {
  const strategyId = YOUTUBE_STRATEGY_ID;

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
            maxLength={100}
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
            multiline
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
          <Categories
            strategyId={strategyId}
            fieldId="categoryId"
            label="Category ID"
            placeholder="Enter Category IDs"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "categoryId" })
            }
            onChangeCategory={onChangeField}
          />
          {/*
          <CheckboxField
            strategyId={strategyId}
            fieldId="privacyStatus"
            label="Make Video Private"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "privacyStatus" })
            }
            onToggleCheckbox={onChangeField}
          />
          */}
        </Form>
      </Col>
    </Row>
  )
}

export default YoutubeStrategy
