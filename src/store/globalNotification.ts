import { makeAutoObservable } from 'mobx';
import { SnackbarMessage, OptionsObject, SnackbarKey } from 'notistack';

interface Notification {
  key: SnackbarKey,
  message: SnackbarMessage,
  options?: OptionsObject,
}

export class GlobalNotificationStore {
  notifications: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  enqueueSnackbar(message: SnackbarMessage, options?: OptionsObject): SnackbarKey {
    const key = new Date().getTime() + Math.random();
    this.notifications.push(<Notification>{ key, message, options });
    return key;
  }
}

export const globalNotification = new GlobalNotificationStore();
