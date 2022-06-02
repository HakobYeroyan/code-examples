import React, {memo} from "react";

// Utils
import {handleGetFieldType} from "../../../../../../pages/FormTemplates/FormTemplates.config";

// Styles
import "./style/field_search_result.scss";

const FieldSearchResult = ({item}) => {
    return (
        <li className="field_search_result">
            <div className="field_short_info">
                <h3>{item.name}</h3>
                {!!item.mandatory && <span className="mandatory">Mandatory</span>}
                {handleGetFieldType(item.field_type)}
                {!!item.explanation && <p>Include explanation</p>}
            </div>
        </li>
    );
};

export default memo(FieldSearchResult);