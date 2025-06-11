import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'message';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private idCounter = 0;

  show(message: string, type: Notification['type'] = 'message', duration = 5000) {
    const id = ++this.idCounter;
    const newNotification: Notification = { id, message, type, duration };
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, newNotification]);

    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter((n) => n.id !== id));
  }
}
