import { createConnection } from '@/lib/db/dbConnect';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    // Connect to the database
    const db = await createConnection();

    // Delete user by ID
    const sql = 'DELETE FROM user WHERE id = ?';
    const [result]: any = await db.execute(sql, [id]);

    // Check if a row was deleted
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json(
      { message: `User with ID ${id} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
