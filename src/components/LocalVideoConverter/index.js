import React, { useState, useEffect } from "react";
import Select from 'react-select'
import axios from 'axios';
import { map } from 'lodash';

import './index.css';

import {
  Row,
  Col,
  Button,
  Spinner
} from 'reactstrap';

const LocalVideoConverter = ({ onSelectVideo, onClickConvert, isConverting }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError]     = useState(false)
  const [allMedia, setAllMedia]   = useState([])

  useEffect(() => {
    const fetchAllMedia = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const { data } = await axios.get('/api/media?omit=mp4');

        setAllMedia(
          map(data.allMedia, ({ path, name, size, dimensions }) => {
            return {
              value: path,
              label: `${name} (${size}, ${dimensions.width} x ${dimensions.height})`
            }
          })
        );
      } catch (err) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchAllMedia();
  }, []);

  const handleSelectOption = ({ value }) => {
    onSelectVideo(value);
  }

  return (
    <Row className="mb-3">
      <Col>
        <h4>Convert Media For Upload</h4>
        <Row>
          <Col>
            <Select
              options={allMedia}
              onChange={handleSelectOption}
              loading={isLoading}
              disabled={isLoading || isError || isConverting}
            />
          </Col>
          <Col xs={2}>
            <Button
              color="primary"
              className="w-100"
              onClick={onClickConvert}
              disabled={isConverting}
            >
              {
                isConverting ? (
                  <Spinner size="sm">
                    {''}
                  </Spinner>
                ) : 'Convert'
              }
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default LocalVideoConverter
