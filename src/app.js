import React, { useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import { includes, xor, map } from "lodash";

import AppContainer from './components/AppContainer';
import DestinationsSelector from './components/DestinationsSelector';
import MediaTypeSelector from './components/MediaTypeSelector';
import PayloadPreview from './components/PayloadPreview';
import CloudVideoUploader from './components/CloudVideoUploader';
import AlertMessage from './components/AlertMessage';
import YoutubeStrategy from './components/YoutubeStrategy';

import {
  DEFAULT_PAYLOAD,
  MEDIA_TYPE_VIDEO,
  MEDIA_TYPE_IMAGE,
  VALID_MEDIA_TYPES,
  YOUTUBE_STRATEGY_ID,
  INSTAGRAM_STRATEGY_ID
} from './utils/constants';

import {
  getStrategiesDefault
} from './utils/helpers';

function App() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [alert, setAlert]     = useState(null)

  const handleSelectMediaType = mediaType => {
    setPayload({ ...payload, mediaType });
  }

  const handleSelectDestination = destination => {
    setPayload({
      ...payload,
      destinations: xor(payload.destinations, [destination]),
      strategies: getStrategiesDefault({ destination, strategies: payload.strategies })
    });
  }

  const handleUploadSuccess = cloudUrl => {
    setPayload({
      ...payload,
      file: {
        ...payload.file,
        cloudUrl
      }
    });
    setAlert({
      message: 'File uploaded to cloud storage successfully.',
      link: cloudUrl,
      color: 'success'
    });
  }

  const handleUploadError = error => {
    setAlert({ message: error.message, color: 'danger' })
  }

  const handleChangeField = ({ value, fieldId, strategyId }) => {
    setPayload({
      ...payload,
      strategies: map(payload.strategies, strategy => {
        if (strategy.id === strategyId) {
          return {
            ...strategy,
            fields: {
              ...strategy.fields,
              [fieldId]: value
            }
          }
        }

        return strategy;
      })
    })
  }

  const { mediaType, destinations } = payload;

  const isValidMediaType = includes(VALID_MEDIA_TYPES, mediaType);
  const isVideo = mediaType === MEDIA_TYPE_VIDEO;
  const isImage = mediaType === MEDIA_TYPE_IMAGE;
  const hasDestination = destinations.length > 0;
  const hasAlert = alert !== null;
  const isYoutubeDestination = includes(destinations, YOUTUBE_STRATEGY_ID);
  const isInstagramDestination = includes(destinations, INSTAGRAM_STRATEGY_ID);

  return (
    <Fragment>
      <h1 className="text-center mb-4">Cycler<span className="thin"> Multimedia Crossposting</span></h1>
      <AppContainer>
        <MediaTypeSelector
          selectedMediaType={mediaType}
          onSelectMediaType={handleSelectMediaType}
        />

        {isValidMediaType && (
          <Fragment>
            <DestinationsSelector
              selectedDestinations={destinations}
              onSelectDestination={handleSelectDestination}
            />

            {hasDestination && (
              <Fragment>
                {isInstagramDestination && (
                  <CloudVideoUploader
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                  />
                )}

                {isYoutubeDestination && (
                  <YoutubeStrategy
                    onChangeField={handleChangeField}
                    payload={payload}
                  />
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </AppContainer>
      <AlertMessage
        data={alert}
        showAlert={hasAlert}
      />
      <PayloadPreview payload={payload}/>
    </Fragment>
  )
}

export default App;
