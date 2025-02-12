import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './pages/chat.page';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ChatComponent } from './components/chat/chat.component';
import { OptionsComponent } from './components/options/options.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {AccordionModule} from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { DocumentPreviewComponent } from './components/document-preview/document-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ScrollPanelModule,
    InputTextareaModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    OverlayPanelModule,
    AccordionModule,
    TableModule

  ],
  declarations: [ChatPage, ChatComponent, OptionsComponent, DocumentPreviewComponent]
})
export class ChatPageModule {}
