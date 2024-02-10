import Loader from '@/app/components/reusables/loader';

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader></Loader>
    </div>
  );
}

export default LoadingScreen;
