import Form from './components/home/Form'
import Filters from './components/home/Filters'
import { Separator } from './components/ui/Separator';
import QuintaCard from './components/home/QuintaCard';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers';


export default async function Home() {
  const supabase = createServerComponentClient({cookies});
  const {data: quintas} = await supabase.from('quintas').select('*');
  console.log(quintas);
  return (
  <main className='px-10'>
    <Form />
     <Separator color='bg-gray-200' />
    <Filters />
    <section className='flex flex-wrap lg:gap-x-16 gap-x-10 justify-center'>
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    <QuintaCard />
    </section>
    <pre className='fixed bottom-10 right-10'>
      {JSON.stringify(quintas, null, 2)}
    </pre>
  </main>
  );
}
