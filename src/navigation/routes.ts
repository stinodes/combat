import { lazy, mount } from 'navi'

export const routes = mount({
  '/': lazy(() => import('../home')),
})
