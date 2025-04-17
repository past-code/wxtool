// src/router/index.tsx
import { useRoutes } from 'react-router-dom';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';

export default function BaseRoutes() {
  return useRoutes([
    { path: '/', element: <Home /> },
    { path: '*', element: <NotFound /> }, // 404 页面
  ]);
}
