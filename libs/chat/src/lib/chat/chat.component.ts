import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from './chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'thestack-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  toggleSidenav;
  constructor(
    private chatService: ChatService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}
}
