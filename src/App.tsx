// App.tsx
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRoutes from '@/router';
const App = () => {
  return (
    <Router>
      <BaseRoutes />
    </Router>
  );
};

export default App;
