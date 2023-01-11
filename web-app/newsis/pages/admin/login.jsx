import Head from 'next/head'
import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  const LoginSchema = Yup.object().shape({
    pass: Yup.string()
      .min(6, 'Too Short!')
      .required('Password is required'),
    email: Yup.string().email('Not a valid email').required('Email is required'),
  });
  
  const login = async (data) =>  {
    console.log(data);
    const headers = {'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'};

    const response = await fetch('http://localhost:4000/api/admin/login', {
      body: data,
      method: 'POST',
      headers: headers,
    });

    const result = await response.json();

    return result;
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      console.log('success');
    }
  });

  const handleLogin = (data) => {
    loginMutation.mutate(data);
  }

  console.log(loginMutation.data);
  console.log(loginMutation.error);

  useEffect(()=> {
    if(loginMutation.status === 'success') {
      const user = loginMutation.data?.data;
      if(user != undefined) {
        localStorage.setItem('user', JSON.stringify(user));
        router.replace('/admin');
      }
    }
  }, [loginMutation.status])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>newsis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <a className="text-blue-600" href="#">
            newsis!
          </a>
        </h1>

        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-md space-y-8">
        <Formik
       initialValues={{
         pass: '',
         email: '',
       }}
       validationSchema={LoginSchema}
       onSubmit={values => {
          handleLogin(JSON.stringify(values));
       }}
     >{({ errors, touched }) => (
          <Form className="mt-8 space-y-6">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Field
                  id="pass"
                  name="pass"
                  type="pass"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
                

            <div className='flex flex-col gap-2 text-red-500'>
            <ErrorMessage name="email" />
            <ErrorMessage name="pass" />
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </div>
          </Form> )}
          </Formik>
        </div>
      </div>

      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="#"
          rel="noopener noreferrer"
        >
          A Consortium Blockchain-Based Network for Authentic Profile Sharing of Academic and Medical Certificates using Hyperledger Fabric
        </a>
      </footer>
    </div>
  )
}

export default Login
