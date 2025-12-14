import ReactDOM from 'react-dom/client'
import App from './App2.jsx'
import {StrictMode} from "react";
import Exercise2 from "./Exercise2.jsx";

import axios from 'axios'



ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
    <App/>

    <Exercise2 />
    </StrictMode>
)
