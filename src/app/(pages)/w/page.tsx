'use client';

import { Toaster, toast } from 'sonner';

export default function RepoExplained() {
  return (
    <>
      <div className="flex items-center  justify-center">
        <div className="h-[400px] max-w-[1165px] rounded-[16rem] glowsup slower-transition hover:slower-translate">
          <button
            onClick={() => {
              toast.message('Update', {
                description:
                  'The blog is currently being migrated to use NextJS',
              });
            }}
          >
            Click me
          </button>
          <Toaster position="bottom-right" />
        </div>
      </div>
    </>
  );
}
