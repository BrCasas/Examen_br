import sql from '../../../lib/db';
import { NextResponse } from 'next/server';

// GET: Obtiene todos los usuarios de la base de datos de Neon
export async function GET() {
  try {
    const usuarios = await sql`SELECT * FROM usuarios;`;
    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Inserta un nuevo usuario enviado desde el frontend
export async function POST(request) {
  try {
    const { nombre, email } = await request.json();
    const nuevoUsuario = await sql`
      INSERT INTO usuarios (nombre, email) 
      VALUES (${nombre}, ${email}) 
      RETURNING *;
    `;
    return NextResponse.json(nuevoUsuario[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}