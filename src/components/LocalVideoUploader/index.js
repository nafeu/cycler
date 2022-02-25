import React, { useState, useEffect, useMemo } from "react";
import Select from 'react-select'
import axios from 'axios';
import { map } from 'lodash';

import './index.css';

import {
  Row,
  Col,
  Button,
  List
} from 'reactstrap';

const LocalVideoUploader = ({ onSelectVideo, payload, isInstagramDestination, isYoutubeDestination }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError]     = useState(false)
  const [allMedia, setAllMedia]   = useState([])

  const selectedVideo = payload?.file?.localPath || null

  const videoPreviewUrl = useMemo(() => {
    return selectedVideo ? `/api/media/preview?path=${selectedVideo}` : null
  }, [selectedVideo])

  const fetchAllMedia = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const { data } = await axios.get('/api/media?allow=mp4');

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

  useEffect(() => {
    fetchAllMedia();
  }, []);

  const handleSelectOption = ({ value }) => {
    onSelectVideo(value);
  }

  return (
    <Row className="mb-3">
      <Col>
        <h4>Select Video For Upload</h4>
        {(isInstagramDestination || isYoutubeDestination) && (
          <List type="unstyled">
            <ul>
              {isInstagramDestination && (
                <li className="text-small"><strong>Instagram:</strong> MP4 (1920 x 1080, 1080 x 1350, 1080 x 1080, 1080 x 608)</li>
              )}
              {isYoutubeDestination && (
                <li className="text-small"><strong>Youtube:</strong> MP4 (1920 x 1080)</li>
              )}
            </ul>
          </List>
        )}
        <Row>
          <Col>
            <Select
              options={allMedia}
              onChange={handleSelectOption}
              loading={isLoading}
              disabled={isError}
            />
          </Col>
          <Col xs={2}>
            <Button
              color="primary"
              className="w-100"
              onClick={() => fetchAllMedia()}
            >
              Refresh
            </Button>
          </Col>
        </Row>
        {videoPreviewUrl && (
          <Row className={`px-2 justify-content-center ${videoPreviewUrl ? 'mt-3' : ''}`}>
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
