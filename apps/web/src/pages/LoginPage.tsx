import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginInput = z.infer<typeof LoginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data: LoginInput) => {
    const { error } = await signIn.email({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error(error.message ?? 'Sign in failed');
      return;
    }
    // Give Better Auth session cookie time to propagate
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='w-full max-w-sm'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-medium'>Welcome back</h1>
          <p className='text-sm text-muted-foreground mt-2'>
            Sign in to your Festival Planner account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1.5'>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              placeholder='you@example.com'
              className={cn(
                'w-full h-9 rounded-md border border-border bg-input-background px-3 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:ring-offset-0',
                'transition-colors placeholder:text-muted-foreground',
                errors.email && 'border-destructive',
              )}
              {...register('email')}
            />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email.message}</p>
            )}
          </div>

          <div className='space-y-1.5'>
            <label htmlFor='password' className='text-sm font-medium'>
              Password
            </label>
            <input
              id='password'
              type='password'
              autoComplete='current-password'
              placeholder='••••••••'
              className={cn(
                'w-full h-9 rounded-md border border-border bg-input-background px-3 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:ring-offset-0',
                'transition-colors placeholder:text-muted-foreground',
                errors.password && 'border-destructive',
              )}
              {...register('password')}
            />
            {errors.password && (
              <p className='text-xs text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50'
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='text-foreground font-medium hover:underline'
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
