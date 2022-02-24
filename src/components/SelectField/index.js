import React from 'react';

import {
  FormGroup,
  Label,
  Col,
  Input
} from 'reactstrap';

import Select from 'react-select';

const SelectField = ({
  onChangeSelection,
  placeholder,
  label,
  fieldId,
  fieldValue,
  strategyId,
  options
}) => {
  const handleChangeSelection = ({ value }) => {
    onChangeSelection({
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
          options={options}
          onChange={handleChangeSelection}
        />
      </Col>
    </FormGroup>
  )
}

export default SelectField;
