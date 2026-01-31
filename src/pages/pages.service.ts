import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PagesService {
  getIndexPage(): string {
    try {
      const filePath = join(__dirname, '..', 'pages', 'index.html');
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error('Error reading index.html:', error);
      return '<h1>Error loading page</h1>';
    }
  }
}
