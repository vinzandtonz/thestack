module.exports = {
  name: 'thedoc',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/thedoc',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
