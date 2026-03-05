import PageContainer from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TodosPage() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Todos</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Todo List</CardTitle>
            <CardDescription>
              Todo list coming soon...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
