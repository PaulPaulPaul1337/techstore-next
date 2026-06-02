import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return Response.json({ error: 'No file' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const name = `slide_${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);

  return Response.json({ url: `/uploads/${name}` });
}
