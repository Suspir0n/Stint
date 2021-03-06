import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private localNotification: LocalNotifications,
  ) {
    let tasksJson = localStorage.getItem('taskDb');
    if(tasksJson != null){
      this.tasks = JSON.parse(tasksJson);
    }
   }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer ?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'comprar pão'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Adicionar',
          handler: (form) => {
            this.localNotification.schedule({
              id: 1,
              title: 'Nova Tarefa!',
              text: form.taskToDo,
              data: { mydata: 'O que acha de completar logo rsrs ?'}
            });
            this.add(form.taskToDo);
          }
        }
      ]
    });
    await alert.present();
  }

  async add(taskToDo: string) {
    if (taskToDo.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'Informar o que deseja fazer!',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return;
    }

    let task = { name: taskToDo, done: false };
    this.tasks.push(task);
    this.upadateLocalStorage();
  }
  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "O QUE DESEJA FAZER ?",
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;
          this.upadateLocalStorage();
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  upadateLocalStorage(){
    localStorage.setItem('taskDb', JSON.stringify(this.tasks));
  }
  delete(task: any){
    this.tasks = this.tasks.filter(taskArray => task != taskArray);
    this.upadateLocalStorage();
  }
  sheduleNotification(){
    
  }
}
