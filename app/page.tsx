import Form from './components/home/Form'
import Filters from './components/home/Filters'
// import { Separator } from './components/ui/Separator';
import SecondSeparator from './components/SecondSeparator';
import QuintasFilters from './components/home/QuintasFilters';

export default async function Home() {
  return (
  <main className='px-10'>
    <Form />
     <SecondSeparator />
      <h2 className="block font-semibold py-1 text-2xl w-fit mx-auto px-10 rounded-xl text-center mt-5">Filtros</h2>
    <Filters />
    <h1 className='text-2xl font-semibold mt-10 text-center'>Algunos destacados</h1>
    <QuintasFilters />
  </main>
  );
}
