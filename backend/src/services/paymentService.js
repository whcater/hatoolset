// 支付服务
export const paymentService = () => {
  const getUserSubscription = async (userId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return a mock subscription for the user
    return {
      plan: 'pro',
      startDate: '2023-01-15T00:00:00Z',
      nextBillingDate: '2023-08-15T00:00:00Z',
      autoRenew: true,
      paymentMethod: {
        type: 'card',
        last4: '4242',
        expMonth: 12,
        expYear: 2025
      }
    };
  };
  
  const startCheckout = async (planId, billingInterval) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock checkout URL
    return `https://checkout.ai-biz-avatar.com/checkout?plan=${planId}&billing=${billingInterval}&t=${Date.now()}`;
  };
  
  const startApiPlanCheckout = async (planId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock checkout URL
    return `https://checkout.ai-biz-avatar.com/api-checkout?plan=${planId}&t=${Date.now()}`;
  };
  
  const cancelSubscription = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { success: true };
  };
  
  return {
    getUserSubscription,
    startCheckout,
    startApiPlanCheckout,
    cancelSubscription
  };
}
