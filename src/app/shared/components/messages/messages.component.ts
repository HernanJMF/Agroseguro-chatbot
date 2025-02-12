import { Component, Input, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { ToastNotification } from '../../types/ToastNotification';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [
    // animation triggers go here
    trigger('show', [
      state(
        'open',
        style({
          opacity: 1,
          zIndex: 100000,
          display: 'flex'
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          zIndex: 0,
          display: 'none'
        })
      ),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class MessagesComponent implements OnInit {
  //attributes
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() success: boolean = false;
  public show: boolean = false;

  //constructor
  constructor(private messageService: MessageService) {}

  //lifecycle
  ngOnInit(): void {
    this.messageService.trigger.subscribe((notification) => {
      this.displayNotification(notification);
    });
  }

  //methods
  public displayNotification(notification: ToastNotification) {
    this.show = true;
    this.title = notification.title;
    this.content = notification.content;
    this.success = notification.success_status;
    setTimeout(() => {
      this.show = false;
    }, 10000);
  }
}
