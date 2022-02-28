import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select'
import axios from 'axios';
import { map } from 'lodash';

import './index.css';

import {
  Stage,
  Layer,
  Image,
  Rect
} from 'react-konva';

import {
  Row,
  Col,
  Button,
  List,
  Spinner
} from 'reactstrap';

import useImage from 'use-image';

const BackgroundImage = ({ imagePath }) => {
  const [image] = useImage(`/api/media/preview?path=${imagePath}`);
  return <Image
    image={image}
    draggable
  />;
}

const BackgroundFill = ({ width, height }) => <Rect
  width={width}
  height={height}
  fill="black"
/>

const LocalThumbnailEditor = ({ isInstagramDestination, isYoutubeDestination, setAlert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [isError, setIsError]     = useState(false);
  const [allMedia, setAllMedia]   = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const stage = useRef();

  const fetchAllMedia = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const { data } = await axios.get('/api/media?allow=png,jpg');

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
    setSelectedImage(value);
  }

  const handleClickSave = async () => {
    try {
      setIsSaving(true);
      setIsError(false);

      const dataUri = stage.current.toDataURL();
      const blob = await (await fetch(dataUri)).blob();
      const file = new File(
        [blob],
        selectedImage,
        {
          type:"image/png",
          lastModified: new Date().getTime()
        }
      );

      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', selectedImage);

      await axios({
        method: "post",
        url: "/api/media/save",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlert({ message: 'Image processed and converted to jpg successfully.', color: 'success' });
    } catch (error) {
      setIsError(true);
    }
    setIsSaving(false);
  }

  const handleClickEdit = () => {
    setIsEditing(true);
  }

  const handleClickDone = () => {
    setIsEditing(false);
  }

  return (
    <Row className="mb-3">
      <Col>
        <h4>Select Thumbnail To Edit</h4>
        {(true || isInstagramDestination || isYoutubeDestination) && (
          <List type="unstyled">
            <ul>
              {(true || isInstagramDestination) && (
                <li className="text-small"><strong>Instagram:</strong> JPG (1080 x 1350, 1080 x 1080, 1080 x 608)</li>
              )}
              {(true || isYoutubeDestination) && (
                <li className="text-small"><strong>Youtube:</strong> JPG (1280 x 720)</li>
              )}
            </ul>
          </List>
        )}
        <Row className="mb-3">
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
        {selectedImage && (
          <Row className="mb-3">
            <Col>
              <img src={`/api/media/preview?path=${selectedImage}`} className="preview-img"/>
            </Col>
          </Row>
        )}
          {isEditing && (
            <div className="konva-container">
              <Stage
                width={1280}
                height={720}
                ref={stage}
                className="konva-stage mb-3"
              >
                <Layer>
                  <BackgroundFill
                    width={1280}
                    height={720}
                  />
                  {selectedImage && (
                    <BackgroundImage
                      imagePath={selectedImage}
                    />
                  )}
                </Layer>
              </Stage>
              <Row>
                <Col>
                  <Button
                    color="primary"
                    onClick={handleClickDone}
                  >
                    Done
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        <Button
          color="primary"
          disabled={isSaving}
          onClick={handleClickSave}
        >
          {
            isSaving ? (
              <Spinner size="sm">
                {''}
              </Spinner>
            ) : 'Save'
          }
        </Button>
        {' '}
        {selectedImage && (
          <Button
            color="primary"
            onClick={handleClickEdit}
          >
            Edit
          </Button>
        )}
      </Col>
    </Row>
  )
}

export default LocalThumbnailEditor
