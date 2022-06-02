import React from "react";
import {Progress, Tooltip} from "antd";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";

// Utils
import {userAlternatives} from "../../../../../../constants";
import {defineKrStatusBadge} from "../../../../../../pages/Goal/Goal.config";
import {getDeadlineDateInfo} from "../../../../../../pages/Goals/components/FullDetails/components/utils/getDeadlineDateInfo";

// Styles
import "./style/key_result_search_result.scss";

const KRSearchResult = ({item}) => {
    const statusBadge = defineKrStatusBadge(item.completion_rate, item.minutes_remaining);

    return (
        <div className="search_results_key_result">
            <div className="item_main_content">
                <div className="title_sect">
                    <Tooltip
                        placement="top"
                        title={`Created by ${item.owner?.name || userAlternatives.fullName}`}
                        overlayClassName='tooltip_custom'
                    >
                        <div className="img_container">
                            <AvatarImg src={item.owner?.avatar || userAlternatives.avatar}/>
                        </div>
                    </Tooltip>
                    {item.name}
                </div>

                <div className="progress_sect">
                    <Progress
                        strokeColor={{
                            '0%': '#586BFF',
                            '100%': '#43FFE9',
                        }}
                        strokeWidth={7}
                        percent={item.completion_rate}
                        showInfo={false}
                    />
                    <span className="percent_value">{Math.round(item.completion_rate)}%</span>
                </div>

                <div className="status_sect">
                    <span className={`status_badge ${statusBadge}`}>{item.status}</span>
                </div>

                <div className="deadline">
                    {getDeadlineDateInfo(item)}
                </div>
            </div>
        </div>
    );
};

export default KRSearchResult;