const TOKEN_URL = 'https://api.sendpulse.com/oauth/access_token';
const SMS_SEND_URL = 'https://api.sendpulse.com/sms/send';

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('380')) return digits;
  if (digits.startsWith('0')) return `38${digits}`;
  return digits;
}

async function getAccessToken() {
  const clientId = process.env.SENDPULSE_API_USER_ID;
  const clientSecret = process.env.SENDPULSE_API_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SendPulse credentials are not configured');
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) throw new Error('Failed to authenticate with SendPulse');

  const data = await res.json();
  return data.access_token as string;
}

export async function POST(request: Request) {
  try {
    const { phone, message } = await request.json();

    if (!phone || !message) {
      return Response.json({ error: 'Missing phone or message' }, { status: 400 });
    }

    const clientId = process.env.SENDPULSE_API_USER_ID;
    const clientSecret = process.env.SENDPULSE_API_SECRET;
    const sender = process.env.SENDPULSE_SMS_SENDER || 'TechStore';

    if (!clientId || !clientSecret) {
      console.log(`[SMS] (SendPulse not configured) -> ${phone}: ${message}`);
      return Response.json({ ok: true, simulated: true });
    }

    const token = await getAccessToken();

    const res = await fetch(SMS_SEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sender,
        phones: [normalizePhone(phone)],
        body: message,
        transliterate: 0,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.result === false) {
      console.error('[SMS] SendPulse error:', data);
      return Response.json({ error: 'Failed to send SMS', details: data }, { status: 502 });
    }

    return Response.json({ ok: true, data });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}
