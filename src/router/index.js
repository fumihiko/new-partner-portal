//import { vModelRadio } from "vue";
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Leads from '../views/Leads.vue'
import LeadModal from '../views/lead/Modal.vue'
import LeadDetails from '../views/lead/Details.vue'
import LeadActivity from '../views/lead/Activity.vue'
import LeadResponse from '../views/lead/Response.vue'

const routes = [
  {
    path: "/p",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: '/p/leads',
    name: 'Leads',
    component: Leads,
    children: [
          {
            path: ':leadsId',
            component: LeadModal,
            props: true,
            meta: {
              displayModal: true
            },
            children: [
              {
                path: 'lead',
                name: 'Details',
                component: LeadDetails
              },
              {
                path: 'activity',
                name: 'Activity',
                component: LeadActivity
              },
              {
                path: 'response',
                name: 'Response',
                component: LeadResponse
              }
            ]
          }
        ]
      
    
  },
  
  // {
  //   path: "/p/prospects",
  //   name: "Prospects",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "prospects" */ "../views/Prospects.vue"),
  // },
  // {
  //   path: "/p/reports",
  //   name: "Reports",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "reports" */ "../views/Reports.vue"),
  // },
  // {
  //   path: "/p/exports",
  //   name: "Exports",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "exports" */ "../views/Exports.vue"),
  // },
  // {
  //   path: "/p/users",
  //   name: "Users",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "users" */ "../views/Users.vue"),
  // },
  // {
  //   path: "/p/settings",
  //   name: "Settings",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "settings" */ "../views/Settings.vue"),
  // }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (!to.meta.displayModal) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

export default router;
