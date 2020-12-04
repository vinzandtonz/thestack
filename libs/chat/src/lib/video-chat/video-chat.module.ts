import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoChatComponent } from './video-chat.component';

@NgModule({
  declarations: [VideoChatComponent],
  imports: [CommonModule],
  exports: [VideoChatComponent]
})
export class VideoChatModule {}
