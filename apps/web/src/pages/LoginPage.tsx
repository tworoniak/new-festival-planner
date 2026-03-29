import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Music } from 'lucide-react';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/layout/PageTransition';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&q=80';

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
              <p className='text-white/60 text-sm mt-1'>
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
                  autoComplete='current-password'
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

              <button
                type='submit'
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className='w-full h-10 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity mt-2'
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className='text-center text-sm text-white/50 mt-6'>
              Don't have an account?{' '}
              <Link
                to='/register'
                className='text-white font-medium hover:underline'
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
