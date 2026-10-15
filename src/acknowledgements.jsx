import React from 'react';
import { createRoot } from 'react-dom/client';
import Acknowledgements from './pages/Acknowledgements.jsx';
import './styles/global.css';
import './styles/acknowledgements.css';

createRoot(document.getElementById('root')).render(<Acknowledgements />);
