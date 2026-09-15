export const getNotificationPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (getNotificationPermission() === 'unsupported') return 'unsupported';
  return Notification.requestPermission();
};

export const showOperatorMessageNotification = ({ message, conversationName }) => {
  if (getNotificationPermission() !== 'granted') return null;

  const notification = new Notification(`New message · ${conversationName}`, {
    body: message.body,
    tag: `conversation-${message.conversation_id}`,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
};
