import React, {memo} from "react";

const CheckInSubSearchResult = ({item}) => {
    return (
        <li className="search_results_sub_item">
            <p className="check_in_search_results_item_title">
                {item.name}
            </p>
        </li>
    );
};

export default memo(CheckInSubSearchResult);