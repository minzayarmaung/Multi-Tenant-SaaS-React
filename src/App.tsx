import './App.css'
import AppRouter from './router/AppRouter';
import { AuthProvider } from './security/context/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
};


export default App
