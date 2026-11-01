import { Link } from 'react-router-dom';
import SmartImage from './SmartImage.jsx';

export default function PageHeader({ eyebrow, title, text, image, crumb }) {
  return (
    <header className="page-header">
      <SmartImage src={image} alt="" className="page-header__bg" eager />
      <div className="page-header__overlay" />
      <div className="container page-header__inner">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb || title}</span>
        </nav>
        {eyebrow && <p className="eyebrow eyebrow--light">{eyebrow}</p>}
        <h1>{title}</h1>
        {text && <p className="page-header__text">{text}</p>}
      </div>
    </header>
  );
}
