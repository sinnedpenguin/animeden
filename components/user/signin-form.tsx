import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { toast } from '../ui/use-toast';
import { signInWithEmail, signInWithGoogle } from '@/app/api/user';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }).max(50),
});

interface SignInFormProps {
  onSubmit: (data: any) => void;
  onSignUpClick: () => void;
}


export default function SignInForm(props: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false); 

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  async function handleSubmit(data: any) {
    setIsLoading(true);

    try {
      await signInWithEmail(data.email, data.password);

      setIsLoading(false);
      props.onSubmit(data);
      toast({
        title: "Sign in successful!",
      });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast({
        title: "Sign in failed",
        description: "Invalid email or password. Please try again."
      });
    }
  }

  async function handleSignInWithGoogle(data: any) {
    try {
      await signInWithGoogle();
      props.onSubmit(data);

      toast({
        title: "Sign in with Google successful!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Sign in with Google failed",
        description: "An error occurred during Google sign-in. Please try again."
      });
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="mt-4">
          <h3 className="text-2xl font-semibold tracking-tight text-primary dark:text-primary">
            Sign in
          </h3>
          <p className="mb-6 mt-1">Welcome back!</p>
        </div>
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      {isLoading ? (
        <div className="mt-4 w-full">
          <Button disabled className="w-full">
            <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        </div>
        ) : (
          <div className="mt-4 w-full">
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <div className="mt-2 flex w-full items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <p className="mx-4 text-sm">or</p>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>
        )}
      </form>
      <div>
        <Button type="button" className="w-full" onClick={handleSignInWithGoogle}>
          <Icons.google className="mr-2 h-4 w-4" /> Continue with Google
        </Button>
      </div>
      <small className="text-center text-sm font-medium leading-none">Don&apos;t have an account? <button className="underline hover:text-blue-500" onClick={props.onSignUpClick}>Sign up</button></small>
    </FormProvider>
  );
}