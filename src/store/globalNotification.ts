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
    const key = Date.now() + Math.random();
    this.notifications.push(<Notification>{ key, message, options });
    return key;
  }

  info(message: SnackbarMessage, duration: number = 3000): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'info', autoHideDuration: duration });
  }

  success(message: SnackbarMessage, duration: number = 3000): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'success', autoHideDuration: duration });
  }

  error(message: SnackbarMessage, duration: number = 10000): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'error', autoHideDuration: duration });
  }

  warn(message: SnackbarMessage, duration: number = 5000): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'warning', autoHideDuration: duration });
  }
}

export const globalNotification = new GlobalNotificationStore();
