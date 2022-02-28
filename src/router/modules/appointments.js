/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const appointmentsRouter = {
  path: '/appointment',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: 'Appointments',
    icon: 'component'
  },
  children: [
    {
      path: 'serial',
      component: () => import('@/views/appointment/serials'),
      name: 'Serial',
      meta: { title: 'Serial', icon: 'link' }
    },
    {
      path: '',
      component: () => import('@/views/appointment'),
      name: 'Appointment',
      meta: { title: 'Appointment', icon: 'list' }
    },
    {
      path: 'create',
      component: () => import('@/views/appointment/create'),
      name: 'CreateAppointment',
      meta: { title: 'Create Appointment', icon: 'edit' }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/appointment/edit'),
      name: 'EditAppointment',
      meta: { title: 'Edit Appointment', noCache: true, activeMenu: '/appointment' },
      hidden: true
    }
  ]
}

export default appointmentsRouter
