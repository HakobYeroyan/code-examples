import React from 'react';

// Utils
import {getSideMenuIcon} from '../../../SideMenu/utils/utils';

// Styles
import './style/search_results.scss';

const SearchResults = ({data, title, type, Component, ListComponent}) => {
    return (
        <div className="search_results_section">
            <div className="search_results_title">
                {getSideMenuIcon(type, '#8A6CA3')}
                <h2 className="search_results_label">{title}</h2>
            </div>
            {(ListComponent && <ListComponent data={data} />) || <ul className="search_results_list">
                {data.map((item) => {
                    return (
                        <li key={item.id || item.name} className="search_results_item">
                            <Component item={item} />
                        </li>
                    );
                })}
            </ul>}
        </div>
    );
};

export default SearchResults;