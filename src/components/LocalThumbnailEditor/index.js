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
  Text,
  Group
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

const clipBox = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const BackgroundImage = ({ imagePath, scale, onDragStart, onDragEnd, onMouseDown }) => {
  const [image] = useImage(`/api/media/preview?path=${imagePath}`);
  return <Image
    image={image}
    scaleX={scale / 100}
    scaleY={scale / 100}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onMouseDown={onMouseDown}
    draggable
  />;
}

const PastedImage = ({ dataUrl, scale, borderRadius, onDragStart, onDragEnd, onMouseDown }) => {
  const [image] = useImage(dataUrl);

  if (image) {
    return (
      <Group
        clipFunc={ctx => {
          clipBox(
            ctx,
            0,
            0,
            image.width,
            image.height,
            borderRadius
          );
        }}
        scaleX={scale / 100}
        scaleY={scale / 100}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onMouseDown={onMouseDown}
        draggable
      >
        <Image image={image} />
      </Group>
    );
  }

  return <Text />
}

const BackgroundFill = ({ width, height }) => <Rect
  width={width}
  height={height}
  fill="black"
/>

const INITIAL_STAGE_OBJECTS = {
  backgroundImage: {
    scale: 100
  },
  pastedImage: {
    scale: 100,
    borderRadius: 0
  }
}

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

const AVAILABLE_FONTS = [
  'Roboto Mono',
  'RobotoMono-Thin',
  'RobotoMono-Light',
  'RobotoMono-Medium',
  'RobotoMono-Regular',
  'RobotoMono-Bold'
];

const AVAILABLE_FONT_DECORATIONS = [
  '',
  'line-through',
  'underline'
];

const getFields = ({ object, id }) => {
  const fieldKeys = keys(object);

  const output = map(fieldKeys, key => {
    if (key === 'scale') {
      return {
        id,
        value: object[key],
        fieldId: key,
        type: 'range'
      }
    }

    if (key === 'borderRadius') {
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

    if (key === 'font') {
      return {
        id,
        value: object[key],
        fieldId: key,
        type: 'font'
      }
    }

    if (key === 'decoration') {
      return {
        id,
        value: object[key],
        fieldId: key,
        type: 'decoration'
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

  if (type === 'font') {
    return (
      <div className="editor-field">
        {AVAILABLE_FONTS.map(font => {
          return (
            <div
              className="text-styler-font-item"
              key={font}
              style={{ fontFamily: font }}
              onClick={() => handleChange(font)}
            >
              AaBbCc
            </div>
          )
        })}
      </div>
    )
  }

  if (type === 'decoration') {
    return (
      <div className="editor-field">
        {AVAILABLE_FONT_DECORATIONS.map(decoration => {
          if (decoration === '') {
            return <div
              className="text-styler-font-decoration-item"
              key={'none'}
              onClick={() => handleChange(decoration)}
            >
              none
            </div>
          }
          return <div
            className="text-styler-font-decoration-item"
            key={decoration}
            onClick={() => handleChange(decoration)}
          >
            {decoration}
          </div>
        })}
      </div>
    )
  }
}

const EditorPanel = ({ stageObjects, setStageObjects, onPasteImage }) => {
  const objects = getStageObjectsArray(stageObjects);

  const handleClickAddText = () => {
    const textId = filter(keys(stageObjects), key => key.includes('text_')).length + 1;

    setStageObjects({
      ...stageObjects,
      [`text_${textId}`]: {
        text: 'example text',
        scale: 20,
        color: '#FFF',
        font: AVAILABLE_FONTS[0],
        decoration: AVAILABLE_FONT_DECORATIONS[0]
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
      {filter(objects, ({ id }) => id.includes('text_')).length < 4 && (
        <button onClick={handleClickAddText}>Add Text</button>
      )}
      <input type="text" onPaste={onPasteImage} placeholder="paste image here"/>
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
  const [pastedImage, setPastedImage] = useState(null);

  const [stageObjects, setStageObjects]     = useState(INITIAL_STAGE_OBJECTS);
  const [selectedObject, setSelectedObject] = useState(null);

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
      formData.append('isThumbnailExport', true);

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

  const handleMouseDown = id => {
    setSelectedObject(id);
  }

  const handleDragStart = event => {}
  const handleDragEnd = event => {}

  const handleWheel = ({ evt: { shiftKey, wheelDelta } }) => {
    if (shiftKey) {
      const delta = wheelDelta > 0 ? 5 : -5;

      const updatedStageObjects = {
        ...stageObjects,
        [selectedObject]: {
          ...stageObjects[selectedObject],
          scale: stageObjects[selectedObject].scale + delta
        }
      }

      setStageObjects(updatedStageObjects)
    }
  }

  const handlePasteImage = pasteEvent => {
    const items = pasteEvent.clipboardData.items;

    const blob = items[0].getAsFile();
    const reader = new FileReader();

    reader.onload = loadEvent => {
      setPastedImage(loadEvent.target.result);
    };

    reader.readAsDataURL(blob);
  }

  return (
    <Row className="mb-3">
      <Col>
        <h4>Edit Thumbnail</h4>
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
          <div
            className="konva-container"
          >
            <Stage
              width={1080}
              height={1080}
              ref={stage}
              className="konva-stage mb-3"
              onWheel={handleWheel}
            >
              <Layer>
                <BackgroundFill
                  width={2000}
                  height={2000}
                />
                {selectedImage && (
                  <BackgroundImage
                    imagePath={selectedImage}
                    scale={stageObjects.backgroundImage.scale}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onMouseDown={() => handleMouseDown('backgroundImage')}
                  />
                )}
                {pastedImage && (
                  <PastedImage
                    dataUrl={pastedImage}
                    scale={stageObjects.pastedImage.scale}
                    borderRadius={stageObjects.pastedImage.borderRadius}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onMouseDown={() => handleMouseDown('pastedImage')}
                  />
                )}
                {stageObjects.text_1 && (
                  <Text
                    x={10}
                    y={10}
                    text={stageObjects.text_1.text}
                    fontSize={stageObjects.text_1.scale}
                    fontFamily={stageObjects.text_1.font}
                    textDecoration={stageObjects.text_1.decoration}
                    fill={stageObjects.text_1.color}
                    onMouseDown={() => handleMouseDown('text_1')}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    draggable
                  />
                )}
                {stageObjects.text_2 && (
                  <Text
                    x={10}
                    y={10}
                    text={stageObjects.text_2.text}
                    fontSize={stageObjects.text_2.scale}
                    fontFamily={stageObjects.text_2.font}
                    textDecoration={stageObjects.text_2.decoration}
                    fill={stageObjects.text_2.color}
                    onMouseDown={() => handleMouseDown('text_2')}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    draggable
                  />
                )}
                {stageObjects.text_3 && (
                  <Text
                    x={10}
                    y={10}
                    text={stageObjects.text_3.text}
                    fontSize={stageObjects.text_3.scale}
                    fontFamily={stageObjects.text_3.font}
                    textDecoration={stageObjects.text_3.decoration}
                    fill={stageObjects.text_3.color}
                    onMouseDown={() => handleMouseDown('text_3')}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    draggable
                  />
                )}
                {stageObjects.text_4 && (
                  <Text
                    x={10}
                    y={10}
                    text={stageObjects.text_4.text}
                    fontSize={stageObjects.text_4.scale}
                    fontFamily={stageObjects.text_4.font}
                    textDecoration={stageObjects.text_4.decoration}
                    fill={stageObjects.text_4.color}
                    onMouseDown={() => handleMouseDown('text_4')}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    draggable
                  />
                )}
              </Layer>
            </Stage>
            <Row>
              <Col>
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
                <Button
                  color="primary"
                  onClick={handleClickDone}
                >
                  Done
                </Button>
              </Col>
            </Row>
            <EditorPanel
              stageObjects={stageObjects}
              setStageObjects={setStageObjects}
              onPasteImage={handlePasteImage}
            />
          </div>
        )}
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
