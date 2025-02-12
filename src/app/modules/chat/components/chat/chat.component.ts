import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { LoadingService } from 'src/app/core/services/loading/loading-service.service';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { ToastNotification } from 'src/app/shared/types/ToastNotification';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [DatePipe]
})
export class ChatComponent  implements OnInit {

  ticketFormGroup: FormGroup;
  isValid: boolean;
  visible: boolean = false;
  chatMessage: string = "";
  messages: any[] = []; //Lista de mensajes de la conversación
  indexModal: number = -1;
  description: string = "";
  selectedReference: string = "";
  documentPreview : boolean = false;

  @Input() topic: string = "";
  @Input() language: string = "";
  @Input() topic_name: string = "";
  @Input() innerWidth: number = 0;
  @Input() activeChat: boolean = true; // se utiliza para validar que el chat es valido para conversar, si esta desactivado es por que se esta generando una respuesta/resumen
  @Input() selectedDocument: any;
  @Input() document: any;
  @Input() vector_id: string = "";

  @Output() selectStepBack = new EventEmitter<any>();

  @ViewChild('sp') scrollPanel: ElementRef; //se usa para actualizar el scroll
  @ViewChild('chatInput', {static: false}) inputEl: ElementRef; //se usa para quitar el foco del usuario del campo de mensajes

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private changeDetector : ChangeDetectorRef,
    private chatService: ChatService,
    private clipboardService: ClipboardService,
    private messageService: MessageService,
    private loadingService: LoadingService,
  ) {
    this.resetForm();
    this.messages = [];
  }

  ngOnInit(): void {
    this.scrollToBottom(); //esto sirve para que el scroll de la lista de mensajes baje completamente
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDocument'] && this.selectedDocument) {

        // Generamos la URL directamente en ChatComponent
        this.selectedDocument.preview = `https://prod-agrobot-chat2dox-main-bucket.s3.eu-west-1.amazonaws.com/${this.selectedDocument.S3_directory}`;

        this.startChatWithDocument();
    }
}

  startChatWithDocument() {
    if (this.selectedDocument && this.selectedDocument.status) {
        this.messages = [];
        this.messages.push({ text: `Chateando con el documento: ${this.selectedDocument.alias}`, sender: 'system' });
    }
}
sendMessage() {
  let chat_history: any[] = this.messages.slice(-6);

  let message: any = {
      message: this.chatMessage,
      language: this.language,
      topic: this.topic,
      summary: "false",
      chat_history: chat_history
  };

  // 🔹 Si hay un documento seleccionado, incluir el `vector_id`
  if (this.selectedDocument?.vector_id) {
      message.vector_id = this.selectedDocument.vector_id;

  }

  var now_utc = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS', "UTC");

  // Agregar el mensaje del usuario al chat
  this.messages.push({
      message: this.chatMessage,
      talker: 'HUMAN',
      interaction_date: now_utc,
      animation: false,
      ticket: false,
      checked: false
  });

  // Agregar un mensaje temporal mientras llega la respuesta
  this.messages.push({
      message: '...',
      talker: 'AI',
      interaction_date: now_utc,
      animation: true,
      ticket: false,
      checked: false
  });

  this.chatMessage = this.language == 'english' ? "Generating answer" : 'Generando respuesta';
  this.inputEl.nativeElement.blur();
  this.activeChat = false;
  this.scrollToBottom();


  // Enviar el mensaje al backend
  this.chatService.sendMessage(message).subscribe({
      next: (response: any) => {
          this.messages[this.messages.length - 1]['message'] = response.message;
          this.messages[this.messages.length - 1]['references'] = response.references;

          // Si el backend indica que se necesita crear un ticket
          if (response.create_ticket) {
              this.messages[this.messages.length - 1]['ticket'] = true;
              this.description = response.description;
          }

          this.chatMessage = "";
          this.activeChat = true;
          this.scrollToBottom();
      },
      error: () => {
          this.scrollToBottom();
          this.chatMessage = "";
          this.activeChat = true;
          this.messages.pop();
          const notification: ToastNotification = {
              title: this.language == 'english' ? 'Service not available' : 'Servicio no disponible',
              content: this.language == 'english' ? 'Could not get the answer to your question, please try again later.' : 'No se ha podido obtener la respuesta a tu pregunta, inténtelo de nuevo más tarde.',
              success_status: false,
          };
          this.messageService.Notify(notification);
      }
  });
  }

  showDocumentPreview() {
    if (this.selectedDocument && this.selectedDocument.S3_directory) {
      const decodedPath = decodeURIComponent(this.selectedDocument.S3_directory); // 🔹 Decodificar primero
      this.selectedDocument.preview = `https://prod-agrobot-chat2dox-main-bucket.s3.eu-west-1.amazonaws.com/${encodeURIComponent(decodedPath)}`; // 🔹 Luego codificar correctamente
      this.documentPreview = true;
    } else {
    }
  }

  //formatea la fecha que se muestra en los mensajes del chat
  formatDate(date: any){
    let dateA = date.split("-");
    let timeA = dateA[2].split(' ')[1].split(":");
    return <any>new Date(Date.UTC(dateA[0], dateA[1],dateA[2].split(' ')[0], timeA[0], timeA[1], timeA[2] ))
  }

  //Copia la pregunta y respuesta al portapapeles
  copyQuestionToClipboard(message: string, index: number) {
    // Obtiene el mensaje anterior (pregunta) y el mensaje actual (respuesta)
    const previousMessage = this.messages[index - 1]?.message || '';
    const currentMessage = message || '';

    // Combina la pregunta y la respuesta en un solo mensaje
    const combinedMessage = `${previousMessage}\n\n${currentMessage}`;

    // Copia el mensaje combinado al portapapeles
    this.clipboardService.copy(combinedMessage);
    const notification: ToastNotification = {
      title: this.language == 'english' ? 'The answer has been copied to the clipboard' : 'La respuesta ha sido copiada al portapapeles',
      content: '',
      success_status: true,
    };
    this.messageService.Notify(notification);
  }

  onDocumentClick() {
    console.log('Documento seleccionado:', this.selectedDocument);
    // Aquí puedes abrir un modal, mostrar más información, etc.
  }
  scrollToBottom(): void { //esto sirve para que el scroll de la lista de mensajes baje completamente
    setTimeout(() => {
      this.changeDetector.detectChanges();
      if (this.scrollPanel) {
        this.scrollPanel.nativeElement.scrollTop = this.scrollPanel.nativeElement.scrollHeight;
      }
    }, 100);
  }

  //se usa para reiniciarlizar las interacciones del input y no ocurran errores de interaccion
  onKeydown(event: any){
    event.preventDefault();
  }

  cleanUnnecessaryWhiteSpaces(){// cada vez que se escribe un espacio en blanco en el correo se elimina
    this.ticketFormGroup.controls['email'].setValue(this.ticketFormGroup.controls['email'].value.replace(/\s/g,''))
  }

  stepBack(){ //resetea los valores en caso de volver a la pantalla de selección de topicos
    this.topic= "";
    this.topic_name = "";
    this.chatMessage = "";
    this.messages = [];
    this.selectStepBack.emit({value: true});
  }

  clearData(){
    this.topic= "";
    this.topic_name = "";
    this.chatMessage = "";
    this.messages = [];
  }

  //inicializa el formulario de crear ticket
  resetForm(){
    this.ticketFormGroup = this.formBuilder.group({
      email: ["", [Validators.required,
                   Validators.email]],
      name: ["", [Validators.required]],
      description: [this.description, [Validators.required]]
    });

    this.ticketFormGroup.statusChanges.subscribe(status => {
      this.isValid = status == "VALID" ? true : false;
    });
  }

  openModal(index: number){ // abre el modal de creación de tickets
    this.resetForm();
    this.indexModal = index;
    this.visible = true;
  }

  createTicket(){// realiza la peticion para obtener el ticket
    let body: any = {};
    body = {
      name: this.ticketFormGroup.controls['name'].value,
      email: this.ticketFormGroup.controls['email'].value,
      description: this.ticketFormGroup.controls['description'].value
    }
    this.loadingService.show();

    //se envia la informacion del ticket al back
    this.chatService.generateTicket(body).subscribe({
      next: (res: any) => {
        this.messages[this.indexModal].ticketID = res.response;
        this.messages[this.indexModal].checked = true;
        this.scrollToBottom();
        this.visible = false;
        this.loadingService.hide();
        const notification: ToastNotification = {
          title: this.language == 'english' ? 'The ticket has been created successfully' : 'El ticket se ha creado con éxito',
          content: '',
          success_status: true,
        };
        this.messageService.Notify(notification);
      },
      error: () =>{
        this.loadingService.hide();
        const notification: ToastNotification = {
          title: this.language == 'english' ? 'Ticket has not been created' : 'No se ha creado el ticket',
          content: this.language == 'english' ? 'The ticket could not be generated, please try again later.' : 'No se ha podido generar el ticket, inténtelo de nuevo más tarde.',
          success_status: false,
        };
        this.messageService.Notify(notification);
      }
    });
  }

  logout(){
    this.chatService.logout();
  }

  placeholderText(){
    if(this.topic_name.length == 0){
      return this.language == 'english' ? 'Select a topic' : 'Seleccione un tópico';
    }else{
      return "";
    }
  }

  reloadDocument() {
    console.log("🔄 Recargando documento...");
    this.selectedDocument = { ...this.selectedDocument }; // Fuerza el cambio para que se recargue
  }

  showDocument() {
    this.documentPreview = true;
}

}
