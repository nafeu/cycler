import React from 'react';

import {
  FormGroup,
  Label,
  Col,
  Input
} from 'reactstrap';

const TextField = ({
  onChangeText,
  placeholder,
  label,
  fieldId,
  fieldValue,
  strategyId,
  multiline,
  maxLength,
  defaultValue
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
          styles={{ whiteSpace: 'pre-wrap' }}
          rows={multiline && 17}
          defaultValue={defaultValue}
          onChange={handleChangeText}
          value={fieldValue}
          maxLength={maxLength}
        />
      </Col>
    </FormGroup>
  )
}

export default TextField;
