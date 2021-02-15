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

  info(message: SnackbarMessage): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'info' });
  }

  success(message: SnackbarMessage): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'success', autoHideDuration: 3000 });
  }

  error(message: SnackbarMessage): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'error', autoHideDuration: 10000 });
  }

  warn(message: SnackbarMessage): SnackbarKey {
    return this.enqueueSnackbar(message, { variant: 'warning' });
  }
}

export const globalNotification = new GlobalNotificationStore();
