import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'productivity',
    name: '效率工具',
    tools: [
      {
        id: 'raycast',
        name: 'Raycast',
        description: '效率启动器与命令工具',
        icon: '/icons/raycast.svg',
        path: '/tools/raycast'
      },
      {
        id: 'cursor-reset',
        name: 'Cursor Trial Reset',
        description: 'Cursor编辑器试用期重置工具',
        icon: '/icons/cursor.svg',
        path: '/tools/cursor-reset'
      }
    ]
  },
  {
    id: 'payment',
    name: '支付工具',
    tools: [
      {
        id: 'paypal',
        name: 'PayPal',
        description: '国际支付工具',
        icon: '/icons/paypal.svg',
        path: '/tools/paypal'
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: '开发者支付解决方案',
        icon: '/icons/stripe.svg',
        path: '/tools/stripe'
      }
    ]
  }
]; 