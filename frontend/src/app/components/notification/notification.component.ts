import { Component } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [AsyncPipe],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  notifications$: Observable<Notification[]>;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  remove(id: number) {
    this.notificationService.remove(id);
  }
}
