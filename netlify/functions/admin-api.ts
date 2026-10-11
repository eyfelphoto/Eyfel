import type { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = 
    process.env.VITE_SUPABASE_URL || 
    process.env.SUPABASE_URL || 
    'https://zjuyvjylqhrgklsztrco.supabase.co';
  const serviceKey = 
    process.env.SUPABASE_SERVICE_ROLE_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdXl2anlscWhyZ2tsc3p0cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTcyMzc5MywiZXhwIjoyMTA3Mjk5NzkzfQ.usJuyZF8knTUl4GE93Dtgk3X1LZZ-TmiSU8u-bXSclg';
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
        .select('*, order_items(*)')
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

    // 4. ÜRÜN DÜZENLEME (İSİM, STOK, FİYAT, GÖRSEL, İNDİRİM, KOMBİNASYON, VERGİ, AÇIKLAMA, SEO, KATEGORİ)
    if (action === 'update_product') {
      const body = JSON.parse(event.body || '{}');
      const { 
        productId, 
        title, 
        subtitle, 
        category, 
        tag, 
        imageUrl, 
        basePrice, 
        description, 
        shapeDetails, 
        sizes, 
        isActive, 
        stockStatus,
        compareAtPrice,
        discountPrice,
        taxRate,
        taxIncluded,
        stockQuantity,
        seoTitle,
        seoDescription,
        slug,
        featuresList,
        existingFeatures,
      } = body;

      if (!productId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ürün ID gereklidir.' }) };
      }

      const updateData: any = { updated_at: new Date().toISOString() };
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (category !== undefined) updateData.category = category;
      if (tag !== undefined) updateData.tag = tag;
      if (imageUrl !== undefined) updateData.image_url = imageUrl;
      if (basePrice !== undefined) updateData.base_price = Number(basePrice);
      if (description !== undefined) updateData.description = description;
      if (shapeDetails !== undefined) updateData.shape_details = shapeDetails;
      if (sizes !== undefined) updateData.sizes = sizes;
      if (isActive !== undefined) updateData.is_active = Boolean(isActive);
      if (stockStatus !== undefined) updateData.stock_status = stockStatus;

      // Pack extended ecommerce features into features JSONB
      const baseFeatures = existingFeatures && typeof existingFeatures === 'object' && !Array.isArray(existingFeatures) 
        ? existingFeatures 
        : {};

      const updatedFeatures = {
        ...baseFeatures,
        compare_at_price: compareAtPrice !== undefined ? Number(compareAtPrice) : baseFeatures.compare_at_price,
        discount_price: discountPrice !== undefined ? Number(discountPrice) : baseFeatures.discount_price,
        tax_rate: taxRate !== undefined ? Number(taxRate) : (baseFeatures.tax_rate ?? 20),
        tax_included: taxIncluded !== undefined ? Boolean(taxIncluded) : (baseFeatures.tax_included ?? true),
        stock_quantity: stockQuantity !== undefined ? Number(stockQuantity) : (baseFeatures.stock_quantity ?? 100),
        seo_title: seoTitle !== undefined ? seoTitle : baseFeatures.seo_title,
        seo_description: seoDescription !== undefined ? seoDescription : baseFeatures.seo_description,
        slug: slug !== undefined ? slug : baseFeatures.slug,
        features_list: featuresList !== undefined ? featuresList : (baseFeatures.features_list || []),
      };
      updateData.features = updatedFeatures;

      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, product: data }),
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
