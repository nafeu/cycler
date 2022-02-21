import React, { useState, useEffect, useMemo } from "react";
import Select from 'react-select'
import axios from 'axios';
import { map } from 'lodash';

import './index.css';

import {
  Row,
  Col
} from 'reactstrap';

const LocalVideoUploader = ({ onSelectVideo, payload }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError]     = useState(false)
  const [allMedia, setAllMedia]   = useState([])

  const selectedVideo = payload?.file?.localPath || null

  const videoPreviewUrl = useMemo(() => {
    return selectedVideo ? `/api/media/preview?path=${selectedVideo}` : null
  }, [selectedVideo])

  useEffect(() => {
    const fetchAllMedia = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const { data } = await axios.get('/api/media');

        setAllMedia(
          map(data.allMedia, ({ path, name }) => {
            return {
              value: path,
              label: name
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
        <h4>Select Local Media</h4>
        <Select
          options={allMedia}
          onChange={handleSelectOption}
          loading={isLoading}
          disabled={isError}
        />
        {videoPreviewUrl && (
          <Row className={`justify-content-center ${videoPreviewUrl ? 'mt-3' : ''}`}>
            <video width="320" height="240" controls>
               <source src={videoPreviewUrl} />
               Your browser does not support the video tag.
            </video>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default LocalVideoUploader
