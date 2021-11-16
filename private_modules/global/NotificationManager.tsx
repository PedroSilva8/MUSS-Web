import { store } from 'react-notifications-component'

export default class NotificationManager {
    static Create(Title:string, Description:string, Type: 'success' | 'danger' | 'info' | 'default' | 'warning', duration?:number) {
        store.addNotification({
            title: Title,
            message: Description,
            type: Type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: duration !== undefined ? duration : 5000,
              onScreen: true
            }
        });
    }
}