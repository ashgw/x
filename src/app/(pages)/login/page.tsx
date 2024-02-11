import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import NewNav from '@/app/components/nav/nav';

export default function Component() {
  return (
    <>
      <NewNav></NewNav>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-[350px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    className="ml-auto inline-block text-sm underline"
                    href="#"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" required type="password" />
              </div>
              <Button className="w-full" type="submit">
                Login
              </Button>
            </div>
            <Separator className="my-8" />
            <div className="space-y-4">
              <Button className="w-full" variant="outline">
                Login with Google
              </Button>
              <Button className="w-full" variant="outline">
                Login with Facebook
              </Button>
              <Button className="w-full" variant="outline">
                Login with Apple
              </Button>
              <Link className="inline-block w-full underline" href="#">
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <Image
            alt="Image"
            className="h-full w-full object-cover"
            height="1080"
            src="/placeholder.svg"
            style={{
              aspectRatio: '1920/1080',
              objectFit: 'cover',
            }}
            width="1920"
          />
        </div>
      </div>
    </>
  );
}
