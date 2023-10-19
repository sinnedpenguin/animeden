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
import { useToast } from "@/components/ui/use-toast";
import { Icons } from '../icons';
import { signUpWithEmail } from '@/app/api/user';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }).max(50),
});

interface SignUpFormProps {
  onSubmit: (data: any) => void;
  onSignInClick: () => void;
}

export default function SignUpForm(props: SignUpFormProps) {
  const { toast } = useToast();
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
      await signUpWithEmail(data.email, data.password);
  
      setIsLoading(false);
      props.onSubmit(data);
      toast({
        title: "Sign up successful!",
        description: (
          <div className="flex items-center">
            Please check your email for a verification link.
            <Icons.mailCheck className="ml-2 h-4 w-4" />
          </div>
        ),
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error signing up",
        description: "Error" 
      });
    }
  }
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="mt-4">
          <h3 className="text-2xl font-semibold tracking-tight text-primary dark:text-primary">
            Sign up
          </h3>
          <p className="mb-6 mt-1">
            Get access to{" "}
            <span className="font-semibold text-primary">watchlist</span>{" "}
            and{" "}
            <span className="font-semibold text-primary">continue watching</span>{" "}
            features!
          </p>
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
              Sign up
            </Button>
          </div>
        )}
        </form>
        <small className="text-center text-sm font-medium leading-none">Have an account already? <button className="underline hover:text-blue-500" onClick={props.onSignInClick}>Sign in</button></small>
    </FormProvider>
  );
}