import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey || url.includes('your-project')) return null;
  return createClient(url, serviceKey);
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // PayTR callback parameters are sent as application/x-www-form-urlencoded
    const params = new URLSearchParams(event.body || '');
    const merchant_oid = params.get('merchant_oid') || '';
    const status = params.get('status') || '';
    const total_amount = params.get('total_amount') || '';
    const hash = params.get('hash') || '';
    const failed_reason_code = params.get('failed_reason_code');
    const failed_reason_msg = params.get('failed_reason_msg');

    const merchant_key = process.env.PAYTR_MERCHANT_KEY || '';
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || '';

    // 1. GÜVENLİK: PayTR Bildirim İmzasını (HMAC-SHA256) Doğrula
    if (merchant_key && merchant_salt && !merchant_key.includes('your-')) {
      const hash_str = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
      const expected_hash = crypto
        .createHmac('sha256', merchant_key)
        .update(hash_str)
        .digest('base64');

      if (hash !== expected_hash) {
        console.error('PAYTR HASH UYUMSUZLUĞU! Beklenen:', expected_hash, 'Gelen:', hash);
        return {
          statusCode: 400,
          body: 'PAYTR notification failed: bad hash',
        };
      }
    }

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.warn('Supabase Admin yapılandırılmamış, callback OK dönülüyor.');
      return { statusCode: 200, body: 'OK' };
    }

    // 2. GÜVENLİK: Mükerrer İşlem Kontrolü (Idempotency)
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status, status')
      .eq('order_number', merchant_oid)
      .single();

    if (existingOrder && existingOrder.payment_status === 'paid') {
      // Sipariş zaten onaylanmış, mükerrer bildirim. Tekrar işlem yapma, doğrudan OK dön!
      return { statusCode: 200, body: 'OK' };
    }

    // 3. Ödeme Sonucunu Veritabanına Kaydet
    if (status === 'success') {
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'Ödeme Alındı',
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', merchant_oid);

      console.log(`[PAYTR] Sipariş #${merchant_oid} ödemesi başarıyla onaylandı.`);
    } else {
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'failed',
          customer_notes: `Ödeme Başarısız: ${failed_reason_msg || failed_reason_code || 'Bilinmeyen hata'}`,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', merchant_oid);

      console.warn(`[PAYTR] Sipariş #${merchant_oid} ödemesi başarısız oldu:`, failed_reason_msg);
    }

    // PayTR'a bildirim alındığını bildirmek için mutlaka "OK" dönülmelidir
    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error: any) {
    console.error('paytr-callback Hatası:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
