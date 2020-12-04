import { MaterialModule } from '@thestack/shared/modules';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { VideoChatModule } from './video-chat/video-chat.module';
import { TextChatModule } from './text-chat/text-chat.module';
import { ChatUsersModule } from './chat-users/chat-users.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    VideoChatModule,
    TextChatModule,
    ChatUsersModule
  ],
  declarations: [ChatComponent],
  exports: [ChatComponent]
})
export class ChatModule {}
