import React, {ReactNode, useEffect, useState} from "react";

interface FilterBarProps {
    children: ReactNode,
    onChange: (search: string, filter: string) => void;
    sort: (sort: boolean) => void;
}

export function FilterBar(props: FilterBarProps) {

    const [searchQuery, setSearchQuery] = useState('');
    const [filterQuery, setFilterQuery] = useState('');
    const [isSorted, setIsSorted] = useState(false);

    const handleSearchChange = (event: any) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const handleFilterChange = (event: any) => {
        const query = event.target.value;
        setFilterQuery(query);
    };

    const handleSort = () => {
        setIsSorted(!isSorted);
        props.sort(isSorted)
    }

    useEffect(() => {
        if (filterQuery === '' && searchQuery === 'none') {
            return;
        }
        setIsSorted(false);
        props.sort(false);
        props.onChange(searchQuery, filterQuery);
    }, [filterQuery, searchQuery]);

    return <div className="filter-bar">
        <input onChange={handleSearchChange} className="filter search" type="text" placeholder="Search..."
               value={searchQuery}></input>
        <select onChange={handleFilterChange} className="filter select">
            {props.children}
        </select>
        <div onClick={handleSort}
             className={(isSorted) ? "filter ToggleButton ToggleButtonActive" : "filter ToggleButton"}>
            Sort Alphabetically
        </div>
    </div>;
}