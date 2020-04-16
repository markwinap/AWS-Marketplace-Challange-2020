'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sagemakerruntime = new AWS.SageMakerRuntime();

exports.handler = async (event) => {
  let response = {
    statusCode: 200,
    //body: JSON.stringify('Hello from Lambda!'),
  };
  //console.log('Received S3 event:', JSON.stringify(event));
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);

  const _s3obj = await getObject({
    Bucket: bucket,
    Key: key,
  })
    .then((res) => res)
    .catch((err) => {
      console.log(err);
      return false;
    });
  if (_s3obj) {
    console.log(
      `Size: ${_s3obj.ContentLength}, Modified: ${_s3obj.LastModified}`
    );
    const _sage = await invokeEndpoint({
      Body: _s3obj.Body,
      EndpointName: 'aws-challange',
      ContentType: 'image/jpeg',
    })
      .then((res) => res)
      .catch((err) => {
        console.log(err);
        return false;
      });
    if (_sage) {
      const _body = _sage.Body.toString('utf8');
      await putObject({
        Body: _sage.Body.toString('utf8'),
        Bucket: 'testing54920-dev',
        Key: `public${key.match(/(\/)(.*?)(?=\.)/g)[0]}.json`,
      })
        .then((res) => res)
        .catch((err) => {
          console.log(err);
          return false;
        });
      console.log(JSON.parse(_body));
      response.body = _body;
    }
    console.log(_sage);
  }
  return response;
};
function getObject(params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
function putObject(params) {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
function getObject(params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function invokeEndpoint(params) {
  return new Promise((resolve, reject) => {
    sagemakerruntime.invokeEndpoint(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
