import React from "react";

import {
  Row,
  Col,
  Form
} from 'reactstrap';

import SelectField from '../SelectField';
import TextField from '../TextField';
// import CheckboxField from '../CheckboxField';

import { getStrategyFieldValue } from '../../utils/helpers';
import { YOUTUBE_STRATEGY_ID, YOUTUBE_VIDEO_CATEGORIES } from '../../utils/constants';

const YoutubeStrategy = ({ onChangeField, payload }) => {
  const strategyId = YOUTUBE_STRATEGY_ID;

  return (
    <Row className="mb-3">
      <h4 className="social-info-header">Enter Youtube Video Details</h4>
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
          <SelectField
            strategyId={strategyId}
            fieldId="categoryId"
            label="Category ID"
            placeholder="Enter Category IDs"
            fieldValue={
              getStrategyFieldValue({ payload, strategyId, fieldId: "categoryId" })
            }
            onChangeSelection={onChangeField}
            options={YOUTUBE_VIDEO_CATEGORIES}
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
