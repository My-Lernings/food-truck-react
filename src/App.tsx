import { APIProvider } from '@vis.gl/react-google-maps';
import MyMap from './components/MyMap';
function App() {


  return (
    <div className="w-full h-full">
      <APIProvider apiKey={'AIzaSyBfeQU5phbNKNVPcHdYmf81i8cRu4De-Z4'}>
        <MyMap />
      </APIProvider>
    </div>
  );
}

export default App;