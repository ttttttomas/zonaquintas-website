import Form from './components/home/Form'
import Filters from './components/home/Filters'
import { Separator } from './components/ui/Separator';
import QuintaCard from './components/home/QuintaCard';



export default function Home() {
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
  </main>
  );
}
