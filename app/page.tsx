import Form from './components/home/Form'
import Filters from './components/home/Filters'
// import { Separator } from './components/ui/Separator';
import QuintaCard from './components/home/QuintaCard';
import SecondSeparator from './components/SecondSeparator';
// import {createServerComponentClient} from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers';



export default async function Home() {
  // const supabase = createServerComponentClient({cookies});
  // const {data: quintas} = await supabase.from('quintas').select('*');
  // console.log(quintas);
  return (
  <main className='px-10'>
    <Form />
     <SecondSeparator />
    <Filters />
    <h1 className='text-2xl font-medium mt-14 text-center'>Algunos destacados</h1>
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
    {/* <pre className='fixed bottom-10 right-10'>
      {JSON.stringify(quintas, null, 2)}
    </pre> */}
  </main>
  );
}
