import React from 'react'
import axios from 'axios'
import withLoading from '@/pages/_hoc'
import { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { BsArrowLeftSquareFill } from 'react-icons/bs'
import { Input, LoaderDark } from '@/components'

const Auth = () => {
   const router = useRouter();
   const { query } = router;

   const [email, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [variant, setVariant] = useState('login');
   const [loading, setLoading] = useState(false);
   const [shakeForm, setShakeForm] = useState(false);

   const triggerShakeForm = () => {
      setShakeForm(true);
      setTimeout(() => { setShakeForm(false) }, 1000);
   };

   useEffect(() => {
      if (query.variant) { setVariant(query.variant as string) }
   }, [query.variant]);

   const toggleVariant = useCallback(() => {
      setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login')
   },[]);

   const validateInputs = useCallback(() => {
      if (variant === 'register' && !username) {
         toast.error('Username is required');
         return false;
      }

      if (!email || !password) {
         toast.error('Email and password are required');
         return false;
      }

      if (variant === 'register' && password.length < 8) {
         toast.error('Password must be at least 8 characters');
         return false;
      }

      return true;
   }, [email, password, username, variant]);

   const login = useCallback(async() => {
      if (!validateInputs()) {
         triggerShakeForm();
         return; 
      }

      try {
        setLoading(true);
        await signIn('credentials', {
           email, password, callbackUrl: '/profile', redirect: true
        });

      } catch (error) {
        console.error(error);
        toast.error('Something went wrong.');
        triggerShakeForm();
      } finally {
        setLoading(false);
      }
   }, [email, password, validateInputs]);

   const register = useCallback(async() => {
      if (!validateInputs()) { 
         triggerShakeForm();
         return; 
      }

      try {
        setLoading(true);
        await axios.post('/api/register', {
         email, username, password
        });
        toast.success('Account created.');
        login();
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong.');
        triggerShakeForm();
      } finally {
        setLoading(false);
      }
   }, [email, username, password, login, validateInputs]);

   if (loading) { return <LoaderDark /> }

   return (
      <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-fixed bg-center bg-cover">
         <div className="bg-primary-dark w-full h-full lg:bg-opacity-60">
            {/* Top Navigation */}
            <nav className="flex justify-between px-6 lg:px-24 pb-6">
               <div className="flex md:px-12 px-4 pt-9 gap-2 cursor-pointer" onClick={() => router.back()}>
                  <BsArrowLeftSquareFill className="text-white md:hidden" size={23} />
                  <BsArrowLeftSquareFill className="text-white md:block hidden" size={28} />
                  <span className="text-white md:text-lg text-base font-semibold">Go back</span>
               </div>
               <div className="flex md:px-12 px-4 pt-9 gap-2 cursor-pointer" onClick={() => router.push('/discover')}>
                  <span className="text-white md:text-lg text-base font-semibold">Discover</span>
                  <img src="/images/logo.png" alt="Logo" className="md:h-7 h-6" />
               </div>
            </nav>
            {/* Authentication Modal */}
            <div className={`flex justify-center md:pt-24 pt-10 ${shakeForm && 'shake-form'}`}>
               <div className="bg-black bg-opacity-70 md:px-16 md:py-16 px-10 py-6 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                  {/* Title */}
                  <div className="pb-3">
                     <h2 className="text-white text-3xl mb-6 font-semibold">
                        {variant === 'login' ? 'Sign in' : 'Register'}
                     </h2>
                  </div>
                  {/* Form */}
                  <div className={`flex flex-col gap-3 mb-2 ${shakeForm && 'shake-form'}`}>
                     {variant === 'register' && (
                     <Input label="Username" onChange={(e: any) => setUsername(e.target.value)} value={username} id="name" adminPage={false} /> )}
                     <Input label="Email" onChange={(e: any) => setEmail(e.target.value)} value={email} id="email" type="email" adminPage={false} />
                     <Input label="Password" onChange={(e: any) => setPassword(e.target.value)} value={password} id="password" type="password" minLength={8} adminPage={false} />
                  </div>
                  {/* Button */}
                  <button onClick={variant === 'login' ? login : register} className="bg-primary-blue-100 text-black py-3 rounded-md w-full md:mt-5 mt-4  hover:bg-primary-red hover:text-primary-red-100 transition">
                     {variant === 'login' ? 'Login' : 'Sign up'}
                  </button>
                  {/* Switcher */}
                  <p className="text-neutral-500 mt-8 justify-between flex">
                     {variant === 'login' ? 'First time in here?' : 'Already have an account?'}
                     <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                       {variant === 'login' ? 'Create an account' : 'Login'}
                     </span>
                  </p>
               </div>
            </div>

         </div>
      </div>
   );
};

export default withLoading(Auth)