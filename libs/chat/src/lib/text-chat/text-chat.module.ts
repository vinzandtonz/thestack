import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextChatComponent } from './text-chat.component';

@NgModule({
  declarations: [TextChatComponent],
  imports: [CommonModule],
  exports: [TextChatComponent]
})
export class TextChatModule {}
