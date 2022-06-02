import React from "react";
import {Link} from "react-router-dom";
import {Tooltip} from "antd";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";

//
import {userAlternatives} from "../../../../../../constants";

// Styles
import "./style/weekly_items_search_result.scss";

const WeeklyItemsSearchResult = ({item}) => {
    if (!item.items?.length) {
        return null;
    }

    const iconClassName = item.name.toLowerCase().replace(/ /g, '_');

    return (
        <div className="search_results_sub_section weekly_items_search_results">
            <div className="weekly_items_search_results_title_sect">
                <span className={`weekly_items_search_results_icon ${iconClassName}`} />
                <h3 className="weekly_items_search_results_title">{item.name}</h3>
            </div>

            <ul className="search_results_sub_list">
                {item.items.map((sub) => {
                    return (
                        <li key={sub.id} className="search_results_sub_item">
                            <Link to={`/apm/weekly_status/${sub.user?.id}`} className="weekly_item_search_result">
                                <Tooltip
                                    placement="top"
                                    title={sub.user?.name || userAlternatives.fullName}
                                    overlayClassName='tooltip_custom'
                                >
                                    <div className="weekly_item_search_result_avatar">
                                        <AvatarImg
                                            imgClassName="creator_img"
                                            src={sub.user?.avatar || userAlternatives.avatar}
                                        />
                                    </div>
                                </Tooltip>
                                <p className="weekly_item_search_result_name">{sub.name}</p>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default WeeklyItemsSearchResult;