import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agroseguro.chatdocumental',
  appName: 'Agroseguro Chatbot',
  webDir: 'www',
  plugins: {
    CapacitorBrowser: {}
  }
};

export default config;
