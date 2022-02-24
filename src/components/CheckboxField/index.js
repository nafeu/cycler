import React from 'react';

import {
  FormGroup,
  Label,
  Col,
  Input
} from 'reactstrap';

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

export default CheckboxField;
