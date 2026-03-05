import { NextRequest, NextResponse } from 'next/server';

const initialTodos = [];

export async function PATCH(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  const { title, completed } = await request.json();
  const todoId = parseInt(params.id, 10);

  if (isNaN(todoId)) {
    return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
  }

  const todo = initialTodos.find(t => t.id === todoId);

  if (!todo) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  
  todo.updated_at = new Date().toISOString();

  return NextResponse.json(todo, { status: 200 });
}

export async function DELETE(
  _request: NextRequest, 
  { params }: { params: { id: string } }
) {
  const todoId = parseInt(params.id, 10);

  if (isNaN(todoId)) {
    return NextResponse.json({ error: 'Invalid todo ID' }, { status: 400 });
  }

  const index = initialTodos.findIndex(t => t.id === todoId);

  if (index === -1) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  initialTodos.splice(index, 1);

  return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
}