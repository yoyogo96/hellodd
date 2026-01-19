import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>HelloDD</h1>
          <span className="tagline">대전 코스닥 주가 모니터링</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">대시보드</Link>
          <Link to="/companies" className="nav-link">종목 리스트</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
