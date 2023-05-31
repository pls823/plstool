import Order from '../views/order/index.vue'
import Set from '../views/set/index.vue'

const pages = [
    {
        path: 'order',
        name: 'Order',
        component: Order,
        meta: {
            title: '订单',
            activeMenu: '/main/order'
        }
    },
    {
        path: 'set',
        name: 'Set',
        component: Set,
        meta: {
            title: '设置',
            activeMenu: '/main/set'
        }
    }
]
export default pages
