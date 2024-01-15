import './styles/loading-dots.scss';

function LoadingScreen() {
  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ height: '100vh' }}
    >
      <div className="loader">
        <div className="one"></div>
        <div className="two"></div>
        <div className="three"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
