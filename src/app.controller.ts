import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PagesService } from './pages/pages.service';

@Controller()
export class AppController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  root(@Res() res: Response) {
    const html = this.pagesService.getIndexPage();
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  @Get('api/health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

