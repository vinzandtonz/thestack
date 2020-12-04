module.exports = {
  name: 'chat',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/chat',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
