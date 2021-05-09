import React from 'react';
const Dropbox = require('dropbox').Dropbox;

function uploadFile() {
  const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
  const ACCESS_TOKEN = document.getElementById('access-token').value;
  const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
  const fileInput = document.getElementById('file-upload');
  const file = fileInput.files[0];


  if (file.size < UPLOAD_FILE_SIZE_LIMIT) { // File is smaller than 150 Mb - use filesUpload API
    dbx.filesUpload({ path: '/Apps/Widget Demo/' + file.name, contents: file })
      .then(function (response) {
        console.log('File uploaded!', response);
      })
      .catch(function (error) {
        console.error(error);
      });
  } else { // File is bigger than 150 Mb - use filesUploadSession* API
    const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size

    var workItems = [];

    var offset = 0;

    while (offset < file.size) {
      var chunkSize = Math.min(maxBlob, file.size - offset);
      workItems.push(file.slice(offset, offset + chunkSize));
      offset += chunkSize;
    }

    const task = workItems.reduce((acc, blob, idx, items) => {
      if (idx == 0) {
        // Starting multipart upload of file
        return acc.then(function () {
          return dbx.filesUploadSessionStart({ close: false, contents: blob })
            .then(response => response.session_id)
        });
      } else if (idx < items.length - 1) {
        // Append part to the upload session
        return acc.then(function (sessionId) {
          var cursor = { session_id: sessionId, offset: idx * maxBlob };
          return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId);
        });
      } else {
        // Last chunk of data, close session
        return acc.then(function (sessionId) {
          var cursor = { session_id: sessionId, offset: file.size - blob.size };
          var commit = { path: '/' + file.name, mode: 'add', autorename: true, mute: false };
          return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });
        });
      }
    }, Promise.resolve());

    task.then(function (result) {
      debugger;
      console.log('file uploaded');
    }).catch(function (error) {
      debugger;
      console.error(error);
    });

  }
}

function listFiles() {
  const ACCESS_TOKEN = document.getElementById('access-token').value;
  const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });
  dbx.filesListFolder({path: ''})
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
}

const DropboxUpload = () => {
  return (
    <div>
      <input type="text" id="access-token" placeholder="Access token" />
      <input type="file" id="file-upload" />
      <button onClick={uploadFile}>Submit</button>
      <button onClick={listFiles}>List</button>
    </div>
  );
}
export default DropboxUpload;
