import React, { useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import { includes, xor, map } from "lodash";
import axios from "axios";
import { useEffectOnce } from "react-use";

import AppContainer from './components/AppContainer';
import DestinationsSelector from './components/DestinationsSelector';
import MediaTypeSelector from './components/MediaTypeSelector';
import PayloadPreview from './components/PayloadPreview';
// import CloudVideoUploader from './components/CloudVideoUploader';
import LocalVideoUploader from './components/LocalVideoUploader';
import LocalVideoConverter from './components/LocalVideoConverter';
import LocalThumbnailEditor from './components/LocalThumbnailEditor';
import AlertMessage from './components/AlertMessage';
import YoutubeStrategy from './components/YoutubeStrategy';
import InstagramStrategy from './components/InstagramStrategy';
import Publisher from './components/Publisher';
import Authorizations from './components/Authorizations';

import {
  DEFAULT_PAYLOAD,
  VALID_MEDIA_TYPES,
  YOUTUBE_STRATEGY_ID,
  INSTAGRAM_STRATEGY_ID
} from './utils/constants';

import {
  getStrategiesDefault
} from './utils/helpers';

function App() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [alert, setAlert]     = useState(null);

  const [authorizations, setAuthorizations] = useState([]);

  const [isConverting, setIsConverting]         = useState(false);

  const [isPublishing, setIsPublishing]         = useState(false);
  const [publishingResult, setPublishingResult] = useState({});

  useEffectOnce(() => {
    const checkAuth = async () => {
      try {
        const { data: result } = await axios.get('/api/auth');

        setAuthorizations(result);
      } catch (error) {
        setAlert({ message: error.message, color: 'danger' });
      }
    }

    checkAuth();
  })

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

  /*
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
    setAlert({ message: error.message, color: 'danger' });
  }
  */

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

  const handleSelectLocalMedia = localPath => {
    setPayload({
      ...payload,
      file: {
        ...payload.file,
        localPath
      }
    });
  }

  const handleClickPublish = async () => {
    try {
      setIsPublishing(true);
      const { data } = await axios.post('/api/publish', payload);
      setPublishingResult(data);
    } catch (error) {
      setAlert({ message: error.message, color: 'danger' });
    }
    setIsPublishing(false);
  }

  const handleSelectVideoToConvert = convertPath => {
    setPayload({
      ...payload,
      file: {
        ...payload.file,
        convertPath
      }
    })
  }

  const handleClickConvert = async () => {
    try {
      setIsConverting(true);
      const { data: { convertPath } } = await axios.post('/api/media/convert', payload);
      setAlert({ message: `Video '${convertPath}' was converted successfully.`, color: 'success' });
    } catch (error) {
      setAlert({ message: error.message, color: 'danger' });
    }
    setIsConverting(false);
  }

  const { mediaType, destinations } = payload;

  const isValidMediaType = includes(VALID_MEDIA_TYPES, mediaType);
  const hasDestination = destinations.length > 0;
  const hasAlert = alert !== null;
  const isYoutubeDestination = includes(destinations, YOUTUBE_STRATEGY_ID);
  const isInstagramDestination = includes(destinations, INSTAGRAM_STRATEGY_ID);
  const canPublish = payload?.file?.downloadUrl || payload?.file?.localPath;
  const requiresLocalMedia = isYoutubeDestination || isInstagramDestination;

  return (
    <Fragment>
      <h1 className="text-center mb-4">Cycler<span className="thin"> Multimedia Crossposting</span></h1>
      <AppContainer>
        <Authorizations authorizations={authorizations} />
        <MediaTypeSelector
          selectedMediaType={mediaType}
          onSelectMediaType={handleSelectMediaType}
        />

        {isValidMediaType && (
          <Fragment>
            <DestinationsSelector
              selectedDestinations={destinations}
              onSelectDestination={handleSelectDestination}
              authorizations={authorizations}
            />

            {hasDestination && (
              <Fragment>
                {/*
                <CloudVideoUploader
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                />
                */}

                <LocalVideoConverter
                  onSelectVideo={handleSelectVideoToConvert}
                  onClickConvert={handleClickConvert}
                  isConverting={isConverting}
                  payload={payload}
                />

                {requiresLocalMedia && (
                  <Fragment>
                    <LocalVideoUploader
                      onSelectVideo={handleSelectLocalMedia}
                      payload={payload}
                      isYoutubeDestination={isYoutubeDestination}
                      isInstagramDestination={isInstagramDestination}
                    />

                    <LocalThumbnailEditor
                      setAlert={setAlert}
                    />
                  </Fragment>
                )}

                {isYoutubeDestination && (
                  <YoutubeStrategy
                    onChangeField={handleChangeField}
                    payload={payload}
                  />
                )}

                {isInstagramDestination && (
                  <InstagramStrategy
                    onChangeField={handleChangeField}
                    payload={payload}
                  />
                )}

                {canPublish && (
                  <Publisher
                    onClickPublish={handleClickPublish}
                    result={publishingResult}
                    isPublishing={isPublishing}
                  />
                )}
              </Fragment>
            )}
            <AlertMessage
              data={alert}
              showAlert={hasAlert}
            />
            <PayloadPreview payload={payload}/>
          </Fragment>
        )}
      </AppContainer>
    </Fragment>
  )
}

export default App;
