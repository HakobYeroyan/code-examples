import React from "react";
import {Row} from "antd";

// Components
import PeopleSearchResult from "./PeopleSearchResult";

// Styles
import "./style/people_search_results.scss";

const PeopleSearchResults = ({data}) => {
    return (
        <Row gutter={24} className="people_search_results">
            {data.map((item) => {
                return <PeopleSearchResult key={item.id} item={item} />;
            })}
        </Row>
    );
};

export default PeopleSearchResults;