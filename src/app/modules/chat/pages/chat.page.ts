import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChatComponent } from '../components/chat/chat.component';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ChatAnalyzerService } from 'src/app/core/services/chat-analyzer/chat-analyzer.service';
import { UserService } from 'src/app/core/services/users/user.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {

  step: number = 1;
  language: string = "";
  topic_name: string = "";
  topic_id: string = "";
  innerWidth: number;
  topic: string = "";
  selectedDocument: any = "";
  selectedVectorID: any = "";
  documentID: string = "";
  documentIDParamMap: any = "";
  typeParamMap: any = "";
  emailParamMap: any = "";
  subDocumentParamMap: any = "";
  documentList: any[] = [];

  @ViewChild(ChatComponent) chatComponent: any;

  constructor(
    private documentService: ChatService,
    private route: ActivatedRoute,
    private location: Location,
    private chatAnalyzerService: ChatAnalyzerService,
    private userService: UserService

  ){
    this.loadRouteParams(); // Obtener parámetros en el constructor
    this.loadDocumentList(); // Cargar lista de documentos
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 768) {
      this.step = 1;
    } else {
      this.step = -1;
    }
  }

  loadRouteParams() {

    this.route.paramMap.subscribe(params => {
      this.documentIDParamMap = params.get('documentID') || null;
      this.typeParamMap = params.get('type') || null;
      this.subDocumentParamMap = params.get('subDocument') || null;

    });

    this.route.queryParams.subscribe(params => {
      this.emailParamMap = params['email'] || null;
    });

    // Si hay un subdocumento, modificar la URL
    if (this.subDocumentParamMap) {
      this.location.go(`/chat/${this.documentIDParamMap}/${this.typeParamMap}`);
    }
  }

    /** 🔹 Cargar la lista de documentos recientes **/
    loadDocumentList() {
      this.documentService.getTopicList().subscribe({
        next: (res: any) => {
          this.documentList = res;
        },
        error: () => {
          console.error("❌ Error cargando la lista de documentos.");
        }
      });
    }

    startChat(event: any){
      this.language = event.language;
      this.topic_name = event.topic_name;
      this.topic = event.topic;

      // 🔹 Si se selecciona un documento, lo guardamos. Si no, lo limpiamos.
      if (event.selectedDocument) {
          this.selectedDocument = event.selectedDocument;
      } else {
          this.selectedDocument = null;
      }

      if(this.innerWidth < 768){
          this.step = 2;
      }
  }

  onDocumentSelected(event: any) {

    if (!event || !event.documentID) {
        console.error("❌ El documento seleccionado no tiene un `documentID` válido.", event);
        return;
    }

    // Guardamos la información del documento
    this.selectedDocument = event.documentData;

  }

  stepBack(){ // devuelve la pantalla a la seleccion de topicos
    this.step = 1;
  }

  clearTopic(){
    this.chatComponent.clearData();
    this.selectedDocument.clearData(); // También limpia el documento seleccionado

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
      const newWidth = window.innerWidth;


      // Solo actualiza si el ancho REALMENTE cambia y no si solo aparece el teclado
      if (newWidth !== this.innerWidth) {
          this.innerWidth = newWidth;

          if (this.innerWidth < 768 && this.step !== 2) {
              this.step = this.topic_id.length > 0 ? this.step : 1;
          } else {
              this.step = -1;
          }
      }
  }

}
