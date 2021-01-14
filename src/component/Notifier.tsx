import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useContext, useEffect } from 'react';

import { StoreContext } from '../store';

const Notifier = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const { globalNotificationStore } = useContext(StoreContext);
  let displayed: SnackbarKey[] = [];

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  useEffect(() => {
    autorun(() => {
      globalNotificationStore.notifications.forEach((notification) => {
        if (displayed.includes(notification.key)) return;
        enqueueSnackbar(notification.message, notification.options);
        storeDisplayed(notification.key);
      });
    });
  });

  return null;
});

export default Notifier;
