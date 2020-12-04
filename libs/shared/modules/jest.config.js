module.exports = {
  name: 'shared-modules',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/modules',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
