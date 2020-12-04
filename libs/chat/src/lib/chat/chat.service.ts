import { RTCClientService } from './rtc/rtc-client.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private rtcClientService: RTCClientService) {}

	initialize() { }
	
	showSnackbar() {
		this.rtcClientService.showSnackbar('show snackbar !');
	}
}
