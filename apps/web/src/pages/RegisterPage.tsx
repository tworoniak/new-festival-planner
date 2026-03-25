import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Music } from 'lucide-react';
import { signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/layout/PageTransition';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&q=80';

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
    toast.success('Account created — welcome to SetList!');
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate('/');
  };

  return (
    <PageTransition>
      <div className='min-h-screen relative flex items-center justify-center'>
        {/* Background */}
        <img
          src={HERO_IMAGE}
          alt=''
          className='absolute inset-0 w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/60' />

        {/* Form card */}
        <div className='relative z-10 w-full max-w-sm mx-4'>
          <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8'>
            {/* Branding */}
            <div className='flex flex-col items-center mb-8'>
              <div className='w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 mb-3'>
                <Music className='w-5 h-5 text-white' />
              </div>
              <span className='animated-gradient-text text-2xl font-medium tracking-wide'>
                SetList
              </span>
              <p className='text-white/60 text-sm mt-1'>Create your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-1.5'>
                <label
                  htmlFor='name'
                  className='text-sm font-medium text-white/80'
                >
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  autoComplete='name'
                  placeholder='Your name'
                  className={cn(
                    'w-full h-10 rounded-lg bg-white/10 border border-white/20 px-3 text-sm text-white',
                    'placeholder:text-white/30 outline-none',
                    'focus:bg-white/15 focus:border-white/40 transition-colors',
                    errors.name && 'border-red-400/60',
                  )}
                  {...register('name')}
                />
                {errors.name && (
                  <p className='text-xs text-red-300'>{errors.name.message}</p>
                )}
              </div>

              <div className='space-y-1.5'>
                <label
                  htmlFor='email'
                  className='text-sm font-medium text-white/80'
                >
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  autoComplete='email'
                  placeholder='you@example.com'
                  className={cn(
                    'w-full h-10 rounded-lg bg-white/10 border border-white/20 px-3 text-sm text-white',
                    'placeholder:text-white/30 outline-none',
                    'focus:bg-white/15 focus:border-white/40 transition-colors',
                    errors.email && 'border-red-400/60',
                  )}
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-xs text-red-300'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-1.5'>
                <label
                  htmlFor='password'
                  className='text-sm font-medium text-white/80'
                >
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  autoComplete='new-password'
                  placeholder='••••••••'
                  className={cn(
                    'w-full h-10 rounded-lg bg-white/10 border border-white/20 px-3 text-sm text-white',
                    'placeholder:text-white/30 outline-none',
                    'focus:bg-white/15 focus:border-white/40 transition-colors',
                    errors.password && 'border-red-400/60',
                  )}
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-xs text-red-300'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className='space-y-1.5'>
                <label
                  htmlFor='confirmPassword'
                  className='text-sm font-medium text-white/80'
                >
                  Confirm password
                </label>
                <input
                  id='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  placeholder='••••••••'
                  className={cn(
                    'w-full h-10 rounded-lg bg-white/10 border border-white/20 px-3 text-sm text-white',
                    'placeholder:text-white/30 outline-none',
                    'focus:bg-white/15 focus:border-white/40 transition-colors',
                    errors.confirmPassword && 'border-red-400/60',
                  )}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className='text-xs text-red-300'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full h-10 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity mt-2'
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className='text-center text-sm text-white/50 mt-6'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='text-white font-medium hover:underline'
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
