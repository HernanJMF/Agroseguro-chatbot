import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { ToastNotification } from 'src/app/shared/types/ToastNotification';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent  implements OnInit {

  formGroup: FormGroup;
  isValid: boolean = false;
  topicList: any[] = [];
  documentList: any[] = [];
  languageList: any[] = [
    {name: 'Español', value: 'spanish'},
    {name: 'Ingles', value: 'english'}
  ];
  selectedDocument: any = null;
  @Input() innerWidth: number = 0;

  @Output() selectConfig = new EventEmitter<any>();
  @Output() clearTopicEvent = new EventEmitter<any>();
  @Output() documentSelected = new EventEmitter<any>();


  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private messageService: MessageService
    ) {
      this.resetForm();
      this.loadTopicList();
    }

  ngOnInit() {}

  resetForm(){ // inicializa el formulario de la pantalla de selección de tópico
    this.formGroup = this.formBuilder.group({
      topic: [null, [Validators.required]],
      language: [null, [Validators.required]],
    });
    this.formGroup.controls['language'].setValue(this.languageList[0]);
    this.formGroup.statusChanges.subscribe(status => {
      this.isValid = (status == "VALID");
    });
  }

  loadTopicList(): void { //obtiene la lista de topicos posibles
    this.chatService.getTopicList().subscribe({
      next: (res: any) => {
        this.topicList = res;
      },
      error: () =>{
        const notification: ToastNotification = {
          title: this.formGroup.controls['language'].value.value == 'english' ? 'Could not get list of topics' : 'No se ha podido obtener la lista de temas',
          content: '',
          success_status: false,
        };
        this.messageService.Notify(notification);
      }
    });
  }

  get topicHeader(): string {
    return this.formGroup.controls['language'].value.value === 'english'
      ? 'Documents associated with the topic'
      : 'Documentos asociados al tópico';
  }

  loadTopicDocuments(topicID: string): void {
    this.chatService.getTopicDocumentList(topicID).subscribe({
      next: (res: any) => {
        this.documentList = res; // Actualiza la lista de documentos
      },
      error: (err) => {
        const notification: ToastNotification = {
          title: this.formGroup.controls['language'].value.value === 'english'
            ? 'Could not get list of documents'
            : 'No se ha podido obtener la lista de documentos',
          content: '',
          success_status: false,
        };
        this.messageService.Notify(notification);
      }
    });
  }

  onTopicChange(event: any): void {
    const selectedTopic = event.value; // Tópico seleccionado
    if (selectedTopic && selectedTopic.topic) {
      const topicID = selectedTopic.topic_id; // Obtén el ID del tópico
      this.loadTopicDocuments(topicID); // Llama a la función con el argumento
    } else {
      const notification: ToastNotification = {
        title: this.formGroup.controls['language'].value.value === 'english'
          ? 'Topic ID is required'
          : 'Se requiere el ID del tema',
        content: '',
        success_status: false,
      };
      this.messageService.Notify(notification);
    }
  }
  changeTopic(clearTopic?: boolean): void {
    if(this.innerWidth >= 768 &&  this.formGroup.controls['topic'].value){
      this.selectConfig.emit({topic_name: this.formGroup.controls['topic'].value.topic_name, topic: this.formGroup.controls['topic'].value.topic, language: this.formGroup.controls['language'].value.value});
      if(!clearTopic){
        this.clearTopicEvent.emit();
      }
    }
    if (this.innerWidth >= 768 && this.formGroup.controls['topic'].value) {
      this.selectConfig.emit({
        topic_name: this.formGroup.controls['topic'].value.topic_name,
        topic: this.formGroup.controls['topic'].value.topic,
        language: this.formGroup.controls['language'].value.value,
      });
      if (!clearTopic) {
        this.clearTopicEvent.emit();
      }
    }
  }

selectDocument(document: any) {
    if (!document || !document.document_id) {
        console.error("❌ Error: El documento seleccionado no tiene un `document_id` válido.", document);
        return;
    }


    this.selectedDocument = document;

    // 🔹 Enviamos el documento con `vector_id` incluido
    this.documentSelected.emit({
        documentID: document.document_id,
        vector_id: document.vector_id || "", // 🔹 Si no tiene `vector_id`, enviamos un string vacío
        documentData: document // 🔹 Enviamos el documento completo
    });

}

  clearTopic(){
    if(this.innerWidth >= 768){
      this.selectConfig.emit({topic_name: "", topic_id: "", language: ""});
      this.clearTopicEvent.emit();
    }
  }

  changeLanguage(language: any){ //Cambia el idioma de la plataforma
    if(language == 'english'){
      this.languageList = [
        {name: 'Spanish', value: 'spanish'},
        {name: 'English', value: 'english'}
      ];
      this.formGroup.controls['language'].setValue(this.languageList[1]);
      this.changeTopic(true);
    }else{
      this.languageList = [
        {name: 'Español', value: 'spanish'},
        {name: 'Ingles', value: 'english'}
      ];
      this.formGroup.controls['language'].setValue(this.languageList[0]);
      this.changeTopic(true);
    }
  }

  submitConfig() {
    this.selectConfig.emit({
        topic_name: this.formGroup.controls['topic'].value?.topic_name || "",
        topic: this.formGroup.controls['topic'].value?.topic || "",
        language: this.formGroup.controls['language'].value.value,
        selectedDocument: this.selectedDocument || null // 🔹 Mantiene el documento si hay uno
    });
}
}
