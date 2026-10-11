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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
      body: JSON.stringify({ error: 'Supabase sunucu bağlantısı bulunamadı.' }),
    };
  }

  try {
    const filePath = event.queryStringParameters?.filePath;
    if (!filePath) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Dosya yolu (filePath) belirtilmelidir.' }),
      };
    }

    // GÜVENLİK: Özel (Private) bucket içindeki fotoğrafa 15 dakikalık geçici imzalı URL üret
    const { data, error } = await supabaseAdmin.storage
      .from('order-photos')
      .createSignedUrl(filePath, 900); // 900 saniye = 15 dakika

    if (error) throw error;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ signedUrl: data.signedUrl }),
    };
  } catch (error: any) {
    console.error('get-signed-url Hatası:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'İmzalı URL üretilemedi.' }),
    };
  }
};
