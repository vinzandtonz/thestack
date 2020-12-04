import { Injectable } from '@angular/core';
import * as AgoraRTC from 'agora-rtc-sdk';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class RTCClientService {
  constructor(private snackbar: MatSnackBar) {}

  errorConfig = { panelClass: 'red' };
  successConfig = { panelClass: 'green' };

  _client = null;
  _joined = false;
  _published = false;
  _localStream = null;
  _remoteStreams = [];
  _params = null;
  _showProfile = false;
  _interval = null;

  showSnackbar(message) {
    this.snackbar.open(message);
  }

  handleEvents() {
    this._client.on('error', err => {
      console.log(err);
    });
    // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
    this._client.on('peer-leave', evt => {
      const id = evt.uid;
      const streams = this._remoteStreams.filter(e => id !== e.getId());
      const peerStream = this._remoteStreams.find(e => id === e.getId());
      // tslint:disable-next-line: no-unused-expression
      peerStream && peerStream.stop();
      this._remoteStreams = streams;
      if (id !== this._params.uid) {
        removeView(id);
      }
      this.snackbar.open('peer leave');
      console.log('peer-leave', id);
    });
    // Occurs when the local stream is _published.
    this._client.on('stream-published', () => {
      this.snackbar.open('stream published success');
      console.log('stream-published');
    });
    // Occurs when the remote stream is added.
    this._client.on('stream-added', evt => {
      const remoteStream = evt.stream;
      const id = remoteStream.getId();
      this.snackbar.open('stream-added uid: ' + id);
      if (id !== this._params.uid) {
        this._client.subscribe(remoteStream, err => {
          console.log('stream subscribe failed', err);
        });
      }
      console.log('stream-added remote-uid: ', id);
    });
    // Occurs when a user subscribes to a remote stream.
    this._client.on('stream-subscribed', evt => {
      const remoteStream = evt.stream;
      const id = remoteStream.getId();
      this._remoteStreams.push(remoteStream);
      addView(id, this._showProfile);
      remoteStream.play('remote_video_' + id, { fit: 'cover' });
      this.snackbar.open('stream-subscribed remote-uid: ' + id);
      console.log('stream-subscribed remote-uid: ', id);
    });
    // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
    this._client.on('stream-removed', evt => {
      const remoteStream = evt.stream;
      const id = remoteStream.getId();
      this.snackbar.open('stream-removed uid: ' + id);
      remoteStream.stop();
      this._remoteStreams = this._remoteStreams.filter(stream => {
        return stream.getId() !== id;
      });
      removeView(id);
      console.log('stream-removed remote-uid: ', id);
    });
    this._client.on('onTokenPrivilegeWillExpire', () => {
      // After requesting a new token
      // this._client.renewToken(token);
      this.snackbar.open('onTokenPrivilegeWillExpire');
      console.log('onTokenPrivilegeWillExpire');
    });
    this._client.on('onTokenPrivilegeDidExpire', () => {
      // After requesting a new token
      // client.renewToken(token);
      this.snackbar.open('onTokenPrivilegeDidExpire');
      console.log('onTokenPrivilegeDidExpire');
    });
  }

  join(data) {
    const __this = this;
    return new Promise<void>(resolve => {
      if (this._joined) {
        this.snackbar.open('Your already joined', null, this.errorConfig);
        return;
      }

      /**
       * A class defining the properties of the config parameter in the createClient method.
       * Note:
       *    Ensure that you do not leave mode and codec as empty.
       *    Ensure that you set these properties before calling Client.join.
       *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
       **/
      this._client = AgoraRTC.createClient({
        mode: data.mode,
        codec: data.codec
      });

      this._params = data;

      // handle AgoraRTC client event
      this.handleEvents();

      // init client
      this._client.init(
        data.appID,
        () => {
          console.log('init success');

          /**
           * Joins an AgoraRTC Channel
           * This method joins an AgoraRTC channel.
           * Parameters
           * tokenOrKey: string | null
           *    Low security requirements: Pass null as the parameter value.
           *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
           *  channel: string
           *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
           *    26 lowercase English letters a-z
           *    26 uppercase English letters A-Z
           *    10 numbers 0-9
           *    Space
           *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
           *  uid: number | null
           *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
           *   Note:
           *      All users in the same channel should have the same type (number) of uid.
           *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
           **/
          this._client.join(
            data.token ? data.token : null,
            data.channel,
            data.uid ? +data.uid : null,
            uid => {
              this._params.uid = uid;
              this.snackbar.open(
                'join channel: ' + data.channel + ' success, uid: ' + uid
              );
              console.log(
                'join channel: ' + data.channel + ' success, uid: ' + uid
              );
              this._joined = true;

              // start stream interval stats
              // if you don't need show stream profile you can comment this
              if (!this._interval) {
                this._interval = setInterval(() => {
                  this._updateVideoInfo();
                }, 0);
              }

              // create local stream
              this._localStream = AgoraRTC.createStream({
                streamID: this._params.uid,
                audio: true,
                video: true,
                screen: false,
                microphoneId: data.microphoneId,
                cameraId: data.cameraId
              });

              this._localStream.on('player-status-change', evt => {
                console.log('player status change', evt);
              });

              if (data.cameraResolution && data.cameraResolution != 'default') {
                // set local video resolution
                this._localStream.setVideoProfile(data.cameraResolution);
              }

              // init local stream
              this._localStream.init(
                () => {
                  console.log('init local stream success');
                  // play stream with html element id "local_stream"
                  this._localStream.play('local_stream', { fit: 'cover' });

                  // run callback
                  resolve();
                },
                err => {
                  this.snackbar.open(
                    'stream init failed, please open console see more detail',
                    null,
                    this.errorConfig
                  );
                  console.error(err);
                }
              );
            },
            function(err) {
              __this.snackbar.open(
                'client join failed, please open console see more detail',
                null,
                __this.errorConfig
              );
              console.error(err);
            }
          );
        },
        err => {
          __this.snackbar.open(
            'client init failed, please open console see more detail',
            null,
            __this.errorConfig
          );
          console.error(err);
        }
      );
    });
  }
  
  private _updateVideoInfo() {
    throw new Error('Method not implemented.');
  }
}
