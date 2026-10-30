import { BrowserRouter } from 'react-router-dom';
import AdminApp from './AdminApp.jsx';
import { ToastProvider } from './components/Toast.jsx';
import './styles/variables.css';
import './styles/global.css';

// the admin is not meant for search engines
document.title = 'Pamban Swami Home Care | Admin';
const robots = document.createElement('meta');
robots.name = 'robots';
robots.content = 'noindex, nofollow';
document.head.appendChild(robots);

export default function AdminEntry() {
  return (
    <BrowserRouter basename="/admin">
      <ToastProvider>
        <AdminApp />
      </ToastProvider>
    </BrowserRouter>
  );
}
