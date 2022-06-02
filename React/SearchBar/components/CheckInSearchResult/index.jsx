import React from "react";
import moment from "moment";
import {Link} from "react-router-dom";
import {Tooltip} from "antd";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";
import CheckInSubSearchResult from "./CheckInSubSearchResult";

// Utils
import getViewAbleAssignees from "@utils/getViewAbleAssignees";
import handleCounter from "@utils/handleCounter";
import {userAlternatives} from "../../../../../../constants";

// Styles
import "./style/check_in_search_result.scss";

const CheckInSearchResult = ({item}) => {
    const sections = [
        {
            title: 'Talking points',
            data: item.items?.talking_points,
        },
        {
            title: 'Plans',
            data: item.items?.plans,
        },
        {
            title: 'Notes',
            data: item.items?.notes,
        },
    ];

    return (
        <Link to={`/apm/check-ins/${item.id}`} className="search_results_check_in">
            <div className="meeting_short_info">
                <Tooltip
                    overlayClassName="tooltip_custom"
                    title={`Created by ${item.owner?.name || userAlternatives.fullName}`}
                >
                    <div className="avatar_img_wrapper">
                        <AvatarImg
                            src={item.owner?.avatar || userAlternatives?.avatar}
                            imgClassName="avatar_img"
                        />
                    </div>
                </Tooltip>
                <p>
                    {item.name}
                </p>
                {!!item.checkin_users?.length && <div className="meeting_attached_users">
                    {item.checkin_users.length > 5 ? getViewAbleAssignees(item.checkin_users, 5).map((checkinUser) => (
                        <Tooltip
                            overlayClassName="tooltip_custom"
                            title={checkinUser.name}
                            key={checkinUser.id}
                        >
                            <div className="meeting_attached_user">
                                <AvatarImg
                                    src={checkinUser.avatar}
                                    imgClassName="avatar_img"
                                />
                            </div>
                        </Tooltip>
                    )) : item.checkin_users.map((checkinUser) => (
                        <Tooltip
                            overlayClassName="tooltip_custom"
                            title={checkinUser.name}
                            key={checkinUser.id}
                        >
                            <div className="meeting_attached_user">
                                <AvatarImg
                                    src={checkinUser.avatar}
                                    imgClassName="avatar_img"
                                />
                            </div>
                        </Tooltip>
                    ))}

                    {item.checkin_users.length > 5 &&
                        <span className="user_counter">
                            {handleCounter(item.checkin_users, 5)}
                        </span>
                    }
                </div>}
            </div>

            {/*{(isTablet || isMobile) && <Divider />}*/}

            <div className="meeting_actions">
                <div>
                    <span className="calendar"/>
                    <p>{moment(item.date_time).format("LL")}</p>
                </div>
            </div>

            {item.items && <ul className="check_in_search_results_items">
                {sections.map(({data, title}) => {
                    if (!data) {
                        return null;
                    }

                    return (
                        <li key={title} className="search_results_sub_section">
                            <h3 className="search_results_sub_label">{title}</h3>
                            <ul className="search_results_sub_list">
                                {data.map((item) => {
                                    return (
                                        <CheckInSubSearchResult key={item.id} item={item} />
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>}
        </Link>
    );
};

export default CheckInSearchResult;
