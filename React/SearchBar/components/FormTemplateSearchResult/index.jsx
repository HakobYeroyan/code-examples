import React from "react";
import moment from "moment";
import {Link} from "react-router-dom";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";
import FieldSearchResult from "./FieldSearchResult";

// Utils
import {userAlternatives} from "../../../../../../constants";

// Styles
import "./style/form_template_search_result.scss";

const FormTemplateSearchResult = ({item}) => {
    return (<>
        <Link to={`/apm/form_templates`} className="form_template_search_result">
            <div className="form_item_short_info">
                <h3>{item.name}</h3>

                <AvatarImg src={item.owner?.avatar || userAlternatives.avatar} />

                <span className="user_name">
                    {item.owner?.name || userAlternatives.fullName}
                </span>
            </div>

            <div className="form_item_date_and_actions">
                <span className="date">{moment(item.created_at).format("LL")}</span>
            </div>
        </Link>

        {!!item.fields?.length && <ul className="field_search_results">
            {item.fields.map((field) => {
                return <FieldSearchResult key={field.id} item={field} />;
            })}
        </ul>}
    </>);
};

export default FormTemplateSearchResult;