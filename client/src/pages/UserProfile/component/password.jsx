import React from 'react';

import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui';

const Password = () => {
  const updatePassword = () => {
    console.log('updare pat');
  };

  return (
    <div className="pb-8 md:px-8">
      <h2 className="text-2xl font-bold">Password</h2>
      <p className="pt-2 text-zinc-500">
        Please enter your current password to change your password.
      </p>
      <Separator className="my-8" />
      <div className="flex items-center">
        <p className="w-60 font-medium">Current password</p>
        <Input
          type="text"
          placeholder="Current password"
          className="w-96"
          value={''}
        />
      </div>
      <Separator className="my-8" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <p className="w-60 font-medium">New password</p>
          <Input
            type="text"
            placeholder="New password"
            className="w-96"
            value={''}
          />
        </div>
        <div className="flex items-center">
          <p className="w-60 font-medium">Confirm new password</p>
          <Input
            type="text"
            placeholder="Confirm new password"
            className="w-96"
            value={''}
          />
        </div>
      </div>
      <Separator className="my-8" />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Update Password</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[40%]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex justify-between">
                Confirmation: Password Update
                <span className="text-s pl-4 font-mono text-slate-300">
                  press <span className="italic">cancel</span> or{' '}
                  <span className="italic">esc</span> to back
                </span>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => updatePassword(e)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Password;
