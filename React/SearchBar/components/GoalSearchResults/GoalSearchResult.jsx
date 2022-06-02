import React from "react";
import {Progress, Tooltip} from "antd";
import {Link} from "react-router-dom";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";
import KRSearchResult from "./KRSearchResult";

// Utils
import getTeamStyles from "@utils/getTeamStyles";
import {userAlternatives} from "../../../../../../constants";
import {getDeadlineDateInfo} from "../../../../../../pages/Goals/components/FullDetails/components/utils/getDeadlineDateInfo";

// Styles
import "./style/goal_search_result.scss";

const GoalSearchResult = ({item, handleOpenAssigneesModal}) => {
    const statusClassName = item.status.replace(/\s+/g, '');

    return (
        <Link to={`/apm/goals/${item.id}`} className={`search_results_goal ${!item.is_active ? 'inactive_goal' : ''}`}>
            <div>
                <div className='goal_name'>
                    <Tooltip
                        placement="top"
                        title={`Created by ${item.owner?.name || userAlternatives.fullName}`}
                        overlayClassName='tooltip_custom'
                    >
                        <div className="img_container">
                            <AvatarImg
                                imgClassName="creator_img"
                                src={item.owner?.avatar || userAlternatives.avatar}
                            />
                        </div>
                    </Tooltip>

                    {!item.is_active && <span className="inactive_badge">Inactive</span>}
                    <p className="goal_link">
                        {item.name}
                    </p>
                    {!!item.is_private && <span className="lock"/>}
                    {item.type_name === "Company" && <span className="company_badge">{item.type_name}</span>}
                </div>

                {item.team_items?.length && (<div className="assigned_teams_sect">
                    {item.team_items.map((team) => (
                        <span
                            key={team.id}
                            className="team_badge"
                            style={getTeamStyles(team.color)}
                        >
                            {team.name}
                        </span>
                    ))}

                    {item.teams_count > 3 &&
                        <button
                            onClick={(e) => handleOpenAssigneesModal(e, "teams", item.id)}
                            className="count_btn"
                        >
                            + {item.teams_count - 3}
                        </button>
                    }
                </div>)}

                {(!!item.assignee_items?.length) && <div className="assigned_users_sect">
                    {item.assignee_items.map((assignee) => {
                        return (
                            <Tooltip
                                placement="top"
                                title={assignee.name.split(",").join(" ")}
                                overlayClassName='tooltip_custom'
                                key={assignee.id}
                            >
                                <div>
                                    <AvatarImg src={assignee.avatar || ''}/>
                                </div>
                            </Tooltip>
                        );
                    })}

                    {item.assignees_count > 3 && <span
                        className="count_btn"
                        onClick={(e) => handleOpenAssigneesModal(e, "assignees", item.id)}
                    >
                        +{item.assignees_count - item.assignee_items?.length}
                    </span>}
                </div>}

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

                <div className="goal_status" data-completion-rate={item.completion_rate}>
                    <span className={statusClassName}>
                        {item.status}
                    </span>
                </div>
                <div className="deadline">
                    {getDeadlineDateInfo(item)}
                </div>

                {!!item.items?.key_result?.length && <div className="search_results_sub_section">
                    <span className="search_results_sub_label">Key Results</span>

                    <ul className="search_results_sub_list">
                        {item.items.key_result.map((keyResult) => {
                            return (
                                <li className="search_results_sub_item" key={keyResult.id}>
                                    <KRSearchResult item={keyResult}/>
                                </li>
                            );
                        })}
                    </ul>
                </div>}
            </div>
        </Link>
    );
};

export default GoalSearchResult;