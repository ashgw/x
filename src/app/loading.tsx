import './styles/loading-dots.scss';

function LoadingScreen() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
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
