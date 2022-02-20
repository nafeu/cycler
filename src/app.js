import React, { useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import { includes, xor } from "lodash";

import AppContainer from './components/AppContainer';
import DestinationsSelector from './components/DestinationsSelector';
import MediaTypeSelector from './components/MediaTypeSelector';
import PayloadPreview from './components/PayloadPreview';
import VideoUploader from './components/VideoUploader';
import AlertMessage from './components/AlertMessage';

import {
  DEFAULT_PAYLOAD,
  MEDIA_TYPE_VIDEO,
  MEDIA_TYPE_IMAGE,
  VALID_MEDIA_TYPES,
} from './utils/constants';

function App() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [alert, setAlert]     = useState(null)

  const handleSelectMediaType = mediaType => {
    setPayload({ ...payload, mediaType });
  }

  const handleSelectDestination = destination => {
    setPayload({
      ...payload,
      destinations: xor(payload.destinations, [destination])
    });
  }

  const handleUploadSuccess = downloadUrl => {
    setPayload({
      ...payload,
      downloadUrl
    });
    setAlert({ message: 'File uploaded successfully.', link: downloadUrl , color: 'success' })
  }

  const handleUploadError = error => {
    setAlert({ message: error.message, color: 'danger' })
  }

  const { mediaType, destinations } = payload;

  const isValidMediaType = includes(VALID_MEDIA_TYPES, mediaType);
  const isVideo = mediaType === MEDIA_TYPE_VIDEO;
  const isImage = mediaType === MEDIA_TYPE_IMAGE;
  const hasDestination = destinations.length > 0;
  const hasAlert = alert !== null

  return (
    <Fragment>
      <h1 className="text-center">Cycler<span className="thin"> Multimedia Crossposting</span></h1>
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
                {isVideo && (
                  <VideoUploader
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
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
