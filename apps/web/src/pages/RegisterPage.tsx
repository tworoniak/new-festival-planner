import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterInput = z.infer<typeof RegisterSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit = async (data: RegisterInput) => {
    const { error } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error(error.message ?? 'Registration failed');
      return;
    }
    toast.success('Account created — welcome!');
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='w-full max-w-sm'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-medium'>Create an account</h1>
          <p className='text-sm text-muted-foreground mt-2'>
            Start planning your festival experience
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1.5'>
            <label htmlFor='name' className='text-sm font-medium'>
              Name
            </label>
            <input
              id='name'
              type='text'
              autoComplete='name'
              placeholder='Your name'
              className={cn(
                'w-full h-9 rounded-md border border-border bg-input-background px-3 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:ring-offset-0',
                'transition-colors placeholder:text-muted-foreground',
                errors.name && 'border-destructive',
              )}
              {...register('name')}
            />
            {errors.name && (
              <p className='text-xs text-destructive'>{errors.name.message}</p>
            )}
          </div>

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
              autoComplete='new-password'
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

          <div className='space-y-1.5'>
            <label htmlFor='confirmPassword' className='text-sm font-medium'>
              Confirm password
            </label>
            <input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              placeholder='••••••••'
              className={cn(
                'w-full h-9 rounded-md border border-border bg-input-background px-3 text-sm outline-none',
                'focus:ring-2 focus:ring-ring focus:ring-offset-0',
                'transition-colors placeholder:text-muted-foreground',
                errors.confirmPassword && 'border-destructive',
              )}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className='text-xs text-destructive'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50'
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-foreground font-medium hover:underline'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
