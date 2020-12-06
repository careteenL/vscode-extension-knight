export interface Novel {
  name: string;
  path: string;
  isDirectory?: boolean;
}

export interface WebviewMessage {
  command: 'updateProgress' | 'goProgress';
  progress: number;
}
