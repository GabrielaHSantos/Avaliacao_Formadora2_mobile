import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tabs/apresentacao', pathMatch: 'full' },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'apresentacao',
        loadComponent: () => import('./pages/apresentacao/apresentacao.page').then(m => m.ApresentacaoPage)
      },
      {
        path: 'identificacao',
        loadComponent: () => import('./pages/identificacao/identificacao.page').then(m => m.IdentificacaoPage)
      },
      {
        path: 'dados-api',
        loadComponent: () => import('./pages/dados-api/dados-api.page').then(m => m.DadosApiPage)
      },
      { path: '', redirectTo: 'apresentacao', pathMatch: 'full' }
    ]
  },
];
