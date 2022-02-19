import React, { useState, Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import { includes, xor } from "lodash";

import AppContainer from './components/AppContainer';
import DestinationsSelector from './components/DestinationsSelector';
import MediaTypeSelector from './components/MediaTypeSelector';
import PayloadPreview from './components/PayloadPreview';

import {
  DEFAULT_PAYLOAD,
  VALID_MEDIA_TYPES,
} from './utils/constants';

function App() {
  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);

  const handleSelectMediaType = mediaType => {
    setPayload({ ...payload, mediaType });
  }

  const handleSelectDestination = destination => {
    setPayload({
      ...payload,
      destinations: xor(payload.destinations, [destination])
    });
  }

  const { mediaType, destinations } = payload;

  const isValidMediaType = includes(VALID_MEDIA_TYPES, mediaType);

  return (
    <Fragment>
      <h1 className="text-center">Cycler<span className="thin"> Multimedia Crossposting</span></h1>
      <AppContainer>
        <MediaTypeSelector
          selectedMediaType={mediaType}
          onSelectMediaType={handleSelectMediaType}
        />

        {isValidMediaType && (
          <DestinationsSelector
            selectedDestinations={destinations}
            onSelectDestination={handleSelectDestination}
          />
        )}
      </AppContainer>
      <PayloadPreview payload={payload}/>
    </Fragment>
  )
}

export default App;
