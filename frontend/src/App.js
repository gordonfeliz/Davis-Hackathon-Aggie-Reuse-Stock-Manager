import { BrowserRouter, Routes, Route } from 'react-router-dom'

import CalendarView from './pages/CalendarView'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route
              path="/"
              element={<CalendarView />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
