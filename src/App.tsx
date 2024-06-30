import { APIProvider } from '@vis.gl/react-google-maps';
import MyMap from './components/MyMap';
function App() {


  return (
    <div className="w-full h-full">
      <APIProvider apiKey={''}>
        <MyMap />
      </APIProvider>
    </div>
  );
}

export default App;