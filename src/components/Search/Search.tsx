
import { useNavigate } from 'react-router-dom';
import './Search.css'
import { useState } from 'react';

const Search = () => {
    const [inputSearch, setInputSearch] = useState<string>('')

    const navigate = useNavigate()

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && inputSearch){
            navigate(`/recetas/categoria/${inputSearch}`)
        }
    }

    return (
        <div className="input-wrapper">
        
            <button className="icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                height="25px"
                width="25px"
            >
                <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth={1.5}
                stroke="#fff"
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                />
                <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth={1.5}
                stroke="#fff"
                d="M22 22L20 20"
                />
            </svg>
            </button>
            <input
            placeholder="search"
            className="input"
            name="text"
            type="text"
            onChange={(e) => setInputSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            />
        </div>
    )
}

export default Search;
