import React, { useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config/firebase";
import './index.css';

import {
  Row,
  Col,
  Input,
  Progress,
  Button,
  FormGroup,
  Spinner
} from 'reactstrap';

import { FIRST_ITEM, EVENT_STATE_CHANGED } from '../../utils/constants';

const getProgressPercentage = snapshot => Math.round(
  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
)

const getDownloadUrlAsync = snapshotRef => new Promise((resolve, reject) => {
  try {
    getDownloadURL(snapshotRef).then(downloadURL => {
      if (downloadURL) {
        resolve({ downloadURL })
      } else {
        reject({ error: { message: 'Missing download URL.' } })
      }
    });
  } catch (error) {
    reject(error);
  }
});

const VideoUploader = ({ onUploadError, onUploadSuccess }) => {
  const [progress, setProgress]       = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewURL, setPreviewURL]   = useState(null);

  const hasProgress = progress > 0;
  const completed   = !isUploading && progress >= 100;

  const handleSnapshot = snapshot => {
    setProgress(getProgressPercentage(snapshot));
  }

  const formHandler = event => {
    event.preventDefault();
    const file = event.target[FIRST_ITEM].files[FIRST_ITEM];
    uploadFiles(file);
  };

  const uploadFiles = file => {
    if (!file) return;
    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);

    uploadTask.on(
      EVENT_STATE_CHANGED,
      handleSnapshot,
      onUploadError,
      async () => {
        const snapshotRef = uploadTask.snapshot.ref;
        const { downloadURL, error } = await getDownloadUrlAsync(snapshotRef);

        setIsUploading(false);

        if (error) {
          onUploadError(error);
        } else {
          setPreviewURL(downloadURL);
          onUploadSuccess(downloadURL);
        }
      }
    );
  };

  return (
    <Row className="mb-3">
      <Col>
        <p>Select Media</p>
        <form onSubmit={formHandler}>
          <FormGroup className="mb-3">
            <Input
              name="file"
              type="file"
              accept="videos/*"
              className="video-input"
            />
            {' '}
            <Button color="primary" type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading' : 'Upload'}
            </Button>
          </FormGroup>
        </form>
        {hasProgress && (
          <Progress
            animated={isUploading}
            color={completed ? 'success' : 'info'}
            value={progress}
            className="mb-3"
          />
        )}
        {completed && previewURL && (
          <Row className="justify-content-center">
            <video width="320" height="240" controls>
               <source src={previewURL} />
               Your browser does not support the video tag.
            </video>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default VideoUploader
