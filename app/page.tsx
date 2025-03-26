import Form from './components/home/Form'
import Filters from './components/home/Filters'
import { Separator } from './components/ui/Separator';
import QuintaCard from './components/home/QuintaCard';



export default function Home() {
  return (
  <main className='px-10'>
    <Form />
     <Separator />
    <Filters />
    <section className='grid grid-cols-6 place-items-center'>
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
    <QuintaCard />
    <QuintaCard />
    </section>
  </main>
  );
}
