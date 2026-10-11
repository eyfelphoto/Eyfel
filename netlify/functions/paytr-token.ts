import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role key (or anon key fallback)
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

// Known price table to guarantee server-side recalculation
const SELSIL_GLUE_PRICE = 299;

export const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { items, customer, customerIp } = payload;

    if (!items || !items.length || !customer || !customer.email || !customer.phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Geçersiz sepet veya müşteri bilgisi.' }),
      };
    }

    // 1. GÜVENLİK: Fiyatı İstemciden Değil, Sunucuda Sıfırdan Hesapla
    let calculatedSubtotal = 0;
    let calculatedGlueTotal = 0;
    const userBasketItems: [string, string, number][] = [];

    const supabaseAdmin = getSupabaseAdmin();
    let dbProducts: any[] = [];
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin.from('products').select('*');
      if (data) dbProducts = data;
    }

    for (const item of items) {
      // Find true price from DB or validated unit price
      const dbProduct = dbProducts.find((p) => p.id === item.product?.id);
      let validatedUnitPrice = item.unitPrice || 690;

      if (dbProduct && dbProduct.sizes) {
        const matchingSize = dbProduct.sizes.find((s: any) => s.id === item.selectedSize?.id);
        if (matchingSize) {
          validatedUnitPrice = Number(matchingSize.price);
        }
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      calculatedSubtotal += validatedUnitPrice * qty;

      const basketTitle = `${item.product?.title || 'Mezar Plakası'} (${item.selectedSize?.dimensions || 'Standart'})`;
      userBasketItems.push([basketTitle, validatedUnitPrice.toFixed(2), qty]);

      if (item.includeGlue) {
        calculatedGlueTotal += SELSIL_GLUE_PRICE * qty;
        userBasketItems.push(['Selsil Ultra Tack 50ml Montaj Yapıştırıcısı', SELSIL_GLUE_PRICE.toFixed(2), qty]);
      }
    }

    const shippingFee = 0; // Ücretsiz kargo
    const calculatedTotal = calculatedSubtotal + calculatedGlueTotal + shippingFee;

    // 2. Benzersiz Sipariş Numarası Üret
    const orderNumber = `EH-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Siparişi Supabase'e "Ödeme Bekliyor" olarak kaydet
    if (supabaseAdmin) {
      try {
        let customerId: string | null = null;
        try {
          const { data: cData } = await supabaseAdmin
            .from('customers')
            .insert({
              full_name: customer.fullName || 'Müşteri',
              email: customer.email || '',
              phone: customer.phone || '',
              city: customer.city || '',
              district: customer.district || '',
              address: customer.address || '',
            })
            .select('id')
            .single();
          if (cData) customerId = cData.id;
        } catch (cErr) {
          console.warn('Customer upsert note:', cErr);
        }

        const { data: orderData, error: orderErr } = await supabaseAdmin
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_id: customerId,
            customer_info: customer,
            status: 'Ödeme Bekliyor',
            payment_status: 'pending',
            payment_method: 'paytr',
            subtotal: calculatedSubtotal,
            glue_total: calculatedGlueTotal,
            shipping_fee: shippingFee,
            total_amount: calculatedTotal,
            customer_notes: customer.notes || '',
          })
          .select('id')
          .single();

        if (orderErr) {
          console.error('Supabase sipariş insert hatası:', orderErr);
        } else if (orderData && items && items.length) {
          const orderItemsRows = items.map((item: any) => {
            const uPrice = Number(item.unitPrice) || 690;
            const q = Number(item.quantity) || 1;
            return {
              order_id: orderData.id,
              product_id: item.product?.id || null,
              product_title: item.product?.title || 'Mezar Plakası',
              selected_size: item.selectedSize || {},
              customization: item.customization || {},
              photo_storage_path: item.customization?.photoStoragePath || (item.customization?.photoUrl?.startsWith('order-photos/') ? item.customization.photoUrl : null),
              include_glue: Boolean(item.includeGlue),
              glue_price: item.includeGlue ? SELSIL_GLUE_PRICE : 0,
              unit_price: uPrice,
              quantity: q,
              line_total: uPrice * q,
            };
          });

          await supabaseAdmin.from('order_items').insert(orderItemsRows);
        }
      } catch (dbErr) {
        console.error('Supabase sipariş kaydı hatası:', dbErr);
      }
    }

    // 4. PayTR Konfigürasyonu
    const merchant_id = process.env.PAYTR_MERCHANT_ID || '';
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || '';
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || '';
    const test_mode = process.env.PAYTR_TEST_MODE || '1';
    const ok_url = process.env.PAYTR_OK_URL || `${process.env.APP_URL || 'http://localhost:3000'}/?payment=success&order=${orderNumber}`;
    const fail_url = process.env.PAYTR_FAIL_URL || `${process.env.APP_URL || 'http://localhost:3000'}/?payment=failed&order=${orderNumber}`;

    // Eğer PayTR anahtarları henüz girilmemişse, güvenli Test / Simülasyon Token'ı döndür
    if (!merchant_id || !merchant_key || !merchant_salt || merchant_id.includes('your-')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'test_simulation',
          orderNumber,
          totalAmount: calculatedTotal,
          message: 'PayTR anahtarları henüz girilmediği için güvenli test modu çalıştırılıyor.',
          iframeToken: `test_token_${orderNumber}`,
        }),
      };
    }

    // 5. PayTR HMAC-SHA256 Token İsteği
    const user_ip = customerIp || event.headers['x-forwarded-for']?.split(',')[0].trim() || '127.0.0.1';
    const merchant_oid = orderNumber;
    const email = customer.email;
    const payment_amount = Math.round(calculatedTotal * 100); // Kuruş cinsinden (Örn: 989.00 TL -> 98900)
    const user_name = customer.fullName || 'Musteri';
    const user_address = `${customer.address || ''} ${customer.district || ''} / ${customer.city || ''}`;
    const user_phone = customer.phone || '05555555555';
    const user_basket = Buffer.from(JSON.stringify(userBasketItems)).toString('base64');
    const currency = 'TL';
    const no_installment = '0'; // Taksit imkanı
    const max_installment = '12';

    // Hash dizilimi: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = crypto
      .createHmac('sha256', merchant_key)
      .update(hash_str + merchant_salt)
      .digest('base64');

    const postParams = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount: payment_amount.toString(),
      paytr_token,
      user_basket,
      user_name,
      user_address,
      user_phone,
      ok_url,
      fail_url,
      timeout_limit: '30',
      currency,
      test_mode,
      no_installment,
      max_installment,
    });

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: postParams.toString(),
    });

    const paytrData = await response.json();

    if (paytrData.status === 'success') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          orderNumber,
          totalAmount: calculatedTotal,
          iframeToken: paytrData.token,
        }),
      };
    } else {
      console.error('PayTR Token Hatası:', paytrData.reason);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: paytrData.reason || 'PayTR iFrame token oluşturulamadı.',
        }),
      };
    }
  } catch (error: any) {
    console.error('paytr-token Handler Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Sunucu hatası oluştu.' }),
    };
  }
};
