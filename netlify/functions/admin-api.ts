import type { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey || url.includes('your-project')) return null;
  return createClient(url, serviceKey);
};

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'Supabase sunucu bağlantısı henüz yapılandırılmamış.' }),
    };
  }

  try {
    const action = event.queryStringParameters?.action || 'get_orders';

    // 1. SİPARİŞLERİ LİSTELE
    if (action === 'get_orders') {
      const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ orders: orders || [] }),
      };
    }

    // 2. SİPARİŞ DURUMU & KARGO GÜNCELLE
    if (action === 'update_order') {
      const body = JSON.parse(event.body || '{}');
      const { orderNumber, status, shippingCarrier, trackingNumber } = body;

      if (!orderNumber) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Sipariş numarası gereklidir.' }) };
      }

      const updatePayload: any = { updated_at: new Date().toISOString() };
      if (status) updatePayload.status = status;
      if (shippingCarrier !== undefined) updatePayload.shipping_carrier = shippingCarrier;
      if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;

      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updatePayload)
        .eq('order_number', orderNumber)
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, order: data }),
      };
    }

    // 3. SATIŞ VE CİRO RAPORLARI
    if (action === 'get_reports') {
      const { data: allOrders, error } = await supabaseAdmin
        .from('orders')
        .select('total_amount, status, payment_status, created_at');

      if (error) throw error;

      const paidOrders = (allOrders || []).filter((o: any) => o.payment_status === 'paid' || o.status === 'Ödeme Alındı');
      const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);

      const report = {
        totalRevenue,
        totalOrders: (allOrders || []).length,
        paidOrdersCount: paidOrders.length,
        pendingOrdersCount: (allOrders || []).filter((o: any) => o.payment_status === 'pending').length,
        shippedOrdersCount: (allOrders || []).filter((o: any) => o.status === 'Kargolandı' || o.status === 'Teslim Edildi').length,
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ report }),
      };
    }

    // 4. ÜRÜN AKTİF/PASİF VE FİYAT GÜNCELLE
    if (action === 'update_product') {
      const body = JSON.parse(event.body || '{}');
      const { productId, isActive, stockStatus, basePrice } = body;

      if (!productId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ürün ID gereklidir.' }) };
      }

      const updateData: any = { updated_at: new Date().toISOString() };
      if (isActive !== undefined) updateData.is_active = isActive;
      if (stockStatus !== undefined) updateData.stock_status = stockStatus;
      if (basePrice !== undefined) updateData.base_price = basePrice;

      const { error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Bilinmeyen işlem türü.' }),
    };
  } catch (error: any) {
    console.error('admin-api Hatası:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Yönetici işlemi sırasında hata oluştu.' }),
    };
  }
};
