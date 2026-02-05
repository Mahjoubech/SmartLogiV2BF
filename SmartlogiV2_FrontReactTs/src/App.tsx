import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <AppRoutes />
      </div>
    </Provider>
  );
}

export default App;
