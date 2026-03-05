import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Todo } from '@/types/todo';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const existing = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(todoId) as Todo | undefined;

    if (!existing) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const body = await request.json();

    // Support updating title and/or toggling completed
    const title =
      body.title !== undefined ? body.title.trim() : existing.title;
    const completed =
      body.completed !== undefined
        ? body.completed
          ? 1
          : 0
        : existing.completed;

    db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?').run(
      title,
      completed,
      todoId
    );

    const updated = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(todoId) as Todo;

    return NextResponse.json({
      ...updated,
      completed: Boolean(updated.completed)
    });
  } catch (error) {
    console.error('Failed to update todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todoId = parseInt(id, 10);

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const existing = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(todoId) as Todo | undefined;

    if (!existing) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM todos WHERE id = ?').run(todoId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete todo:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
