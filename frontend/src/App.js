
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { setDataProduct } from './redux/productSlice';
import { useDispatch, useSelector } from 'react-redux';



function App() {
  const dispatch = useDispatch()

  const productData = useSelector(stste=>stste.product)
  
  useEffect(()=>{
    (async()=>{
       const res = await fetch(`http://localhost:7000/product`)
      const resData = await res.json()
      dispatch(setDataProduct(resData))

    })()
  },[])


  return (
    <>
    <Toaster />
      <div>
        <Header /> 
        <main className='pt-16 bg-slate-100 min-h-[calc(100vh'>
          <Outlet />
        </main>
      </div>

    </>
  );
}

export default App;
