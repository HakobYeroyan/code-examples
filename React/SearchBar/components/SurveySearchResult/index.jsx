import React from "react";
import moment from "moment";
import {Progress, Tooltip} from "antd";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";
import SurveyResult from "./SurveyResult";

// Hooks
import useGetDateFormat from "@hooks/useGetDateFormat";

// Utils
import getViewAbleAssignees from "@utils/getViewAbleAssignees";
import getSurveyStatusType from "@utils/getSurveyStatusType";
import getTeamStyles from "@utils/getTeamStyles";
import handleCounter from "@utils/handleCounter";
import {surveyStatusesConfig} from "../../../../../../pages/Surveys/surveys.config";

// Styles
import "./style/survey_search_result.scss";

const SurveySearchResult = ({item}) => {
    const dateFormat = useGetDateFormat();

    const isUpcomingSurvey = item.survey_status === surveyStatusesConfig[2];

    const getTeamContent = (team) => (
        <span
            className="team"
            key={team.id}
            style={getTeamStyles(team.color)}
        >
            {team.name}
        </span>
    );

    const teamsList = (!!item.survey_teams.length &&
        <div className="teams_sect">
            {item.survey_teams.length > 3 ?
                getViewAbleAssignees(item.survey_teams, 3).map(getTeamContent) :
                item.survey_teams.map(getTeamContent)
            }
            {item.survey_teams.length > 3 && <span
                className="teams_counter">
                {handleCounter(item.survey_teams, 3)}
            </span>}
        </div>
    );

    return (
        <SurveyResult
            isUpcomingSurvey={isUpcomingSurvey}
            id={item.id}
        >
            <div className="short_info">
                <h2 className="survey_title">
                    {item.name}
                </h2>
                <span className={`status_badge ${getSurveyStatusType(item.survey_status)}`}>
                    {item.survey_status}
                </span>
                <span className="questions_count">
                    {item.count_questions} {`question${item.count_questions > 1 ? 's' : ''}`}
                </span>
            </div>

            <div className="assignment_sect">
                {teamsList}

                {!!item.survey_users?.length && <div className="users_sect">
                    {item.survey_users.length > 3 ? getViewAbleAssignees(item.survey_users, 3).map((user) => (
                        <Tooltip
                            placement="top"
                            title={user.name}
                            overlayClassName='tooltip_custom'
                            key={user.id}
                        >
                            <div className="user_sect_inner">
                                <AvatarImg
                                    src={user.avatar}
                                />
                            </div>
                        </Tooltip>
                    )) : item.survey_users.map((user) => (
                        <Tooltip
                            placement="top"
                            title={user.name}
                            overlayClassName='tooltip_custom'
                            key={user.id}
                        >
                            <div className="user_sect_inner">
                                <AvatarImg
                                    src={user.avatar}
                                />
                            </div>
                        </Tooltip>
                    ))}
                    {item.survey_users.length > 3 &&
                        <span className="user_counter">
                            {handleCounter(item.survey_users, 3)}
                        </span>
                    }
                </div>}

            </div>

            <div className="more_info">
                <div className="progress_sect">
                    <Progress
                        type="circle"
                        percent={item.completion || 0}
                        width={30}
                        strokeColor={"#A358F9"}
                        strokeWidth={7}
                        trailColor={"#D2CAE0"}
                        showInfo={false}
                    />
                    <strong>{item.completion || 0}%</strong>
                    <span className="progress_title">Completion</span>
                </div>
                <div className="date_sect">
                    <span className="calendar"/>
                    <span className="date_title">Ends on</span>
                    <span className="date">{moment(item.survey_deadline).format("LL")}</span>
                </div>
            </div>

            {item.survey_status === surveyStatusesConfig[1] && <div className="actions_sect">
                <div className="completion_action">
                    <span>{moment(item.complete).format(`${dateFormat} HH:mm:ss`)}</span>
                </div>
            </div>}
        </SurveyResult>
    );
};

export default SurveySearchResult;