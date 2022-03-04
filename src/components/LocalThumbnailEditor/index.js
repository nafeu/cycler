import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select'
import axios from 'axios';
import { map, keys, filter, includes } from 'lodash';

import './index.css';
import 'react-rangeslider/lib/index.css'

import {
  Stage,
  Layer,
  Image,
  Rect,
  Text
} from 'react-konva';

import {
  Row,
  Col,
  Button,
  List,
  Spinner
} from 'reactstrap';

import Slider from 'react-rangeslider'

import useImage from 'use-image';

const BackgroundImage = ({ imagePath, scale }) => {
  const [image] = useImage(`/api/media/preview?path=${imagePath}`);
  return <Image
    image={image}
    scaleX={scale / 100}
    scaleY={scale / 100}
    draggable
  />;
}

const BackgroundFill = ({ width, height }) => <Rect
  width={width}
  height={height}
  fill="black"
/>

const INITIAL_STAGE_OBJECTS = {
  backgroundImage: {
    scale: 100,
    order: 0
  }
}

const META_FIELDS = ['order']

const AVAILABLE_COLORS = [
  '#ffffff',
  '#000000',
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#ecf0f1',
  '#95a5a6',
  '#2c3e50'
];

const getFields = ({ object, id }) => {
  const fieldKeys = filter(
    keys(object), key => !includes(META_FIELDS, key)
  );

  const output = map(fieldKeys, key => {
    if (key === 'scale') {
      return {
        id,
        value: object[key],
        fieldId: key,
        type: 'range'
      }
    }

    if (key === 'color') {
      return {
        id,
        value: object[key],
        fieldId: key,
        type: 'color'
      }
    }

    return {
      id,
      value: object[key],
      fieldId: key,
      type: 'text'
    }
  });

  return output;
}

const getStageObjectsArray = stageObjects => {
  return map(keys(stageObjects), key => {
    return {
      id: key,
      order: stageObjects[key].order,
      fields: getFields({ id: key, object: stageObjects[key] })
    }
  });
}

const EditorField = ({ field, stageObjects, setStageObjects }) => {
  const { value, fieldId, id, type } = field;

  const handleChange = value => {
    const updatedStageObjects = {
      ...stageObjects,
      [id]: {
        ...stageObjects[id],
        [fieldId]: value
      }
    }

    setStageObjects(updatedStageObjects)
  }

  if (type === 'range') {
    return (
      <div className="editor-field">
        <Slider
          min={0}
          max={200}
          value={value}
          onChange={handleChange}
        />
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div className="editor-field">
        <input
          type="text"
          value={value}
          onChange={event => handleChange(event.target.value)}
        />
      </div>
    )
  }

  if (type === 'color') {
    return (
      <div className="editor-field">
        {AVAILABLE_COLORS.map(color => {
          return (
            <div
              className="text-styler-color-item"
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => handleChange(color)}
            >
            </div>
          )
        })}
      </div>
    )
  }
}

const EditorPanel = ({ stageObjects, setStageObjects }) => {
  const objects = getStageObjectsArray(stageObjects);

  const handleClickAddText = () => {
    const textId = filter(keys(stageObjects), key => key.includes('text_')).length + 1;

    setStageObjects({
      ...stageObjects,
      [`text_${textId}`]: {
        text: 'example text',
        scale: 20,
        color: '#FFF'
      }
    });
  }

  return (
    <div className="editor-panel">
      {objects.map(object => {
        return (
          <div
            key={object.id}
            className="editor-object"
          >
            <div className="editor-object-id">{object.id}</div>
            {object.fields.map(field => {
              return (
                <EditorField
                  key={field.fieldId}
                  field={field}
                  stageObjects={stageObjects}
                  setStageObjects={setStageObjects}
                />
              );
            })}
          </div>
        )
      })}
      <button onClick={handleClickAddText}>Add Text</button>
    </div>
  )
}

const LocalThumbnailEditor = ({ isInstagramDestination, isYoutubeDestination, setAlert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [isError, setIsError]     = useState(false);
  const [allMedia, setAllMedia]   = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const [stageObjects, setStageObjects] = useState(INITIAL_STAGE_OBJECTS);

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
    window.scrollTo(0, 0);
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
                      scale={stageObjects.backgroundImage.scale}
                    />
                  )}
                  {stageObjects.text_1 && (
                    <Text
                      x={10}
                      y={10}
                      text={stageObjects.text_1.text}
                      fontSize={stageObjects.text_1.scale}
                      fill={stageObjects.text_1.color}
                      draggable
                    />
                  )}
                  {stageObjects.text_2 && (
                    <Text
                      x={10}
                      y={10}
                      text={stageObjects.text_2.text}
                      fontSize={stageObjects.text_2.scale}
                      fill={stageObjects.text_2.color}
                      draggable
                    />
                  )}
                  {stageObjects.text_3 && (
                    <Text
                      x={10}
                      y={10}
                      text={stageObjects.text_3.text}
                      fontSize={stageObjects.text_3.scale}
                      fill={stageObjects.text_3.color}
                      draggable
                    />
                  )}
                  {stageObjects.text_4 && (
                    <Text
                      x={10}
                      y={10}
                      text={stageObjects.text_4.text}
                      fontSize={stageObjects.text_4.scale}
                      fill={stageObjects.text_4.color}
                      draggable
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
              <EditorPanel stageObjects={stageObjects} setStageObjects={setStageObjects} />
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
