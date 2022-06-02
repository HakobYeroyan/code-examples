import React from "react";
import moment from "moment";
import {Tooltip} from "antd";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";

// Hooks
import {isUserTeamMember} from "@hooks/CheckUserRole";
import useGetDateFormat from "@hooks/useGetDateFormat";

// Styles
import "./style/team_search_result.scss";
import {Link} from "react-router-dom";

const TeamSearchResult = ({item}) => {
    const dateFormat = useGetDateFormat();

    const managerCount = item.manager_count + item.senior_manager_count;

    const handleGetStaff = (staff, managerRoleId, seniorManagerRoleId, adminRoleId) => {
        return staff && staff.filter(staffPerson => (managerRoleId || seniorManagerRoleId || adminRoleId) ?
            (
                staffPerson.id_acl_role === managerRoleId ||
                staffPerson.id_acl_role === seniorManagerRoleId ||
                staffPerson.id_acl_role === adminRoleId
            ) : isUserTeamMember(staffPerson.id_acl_role));
    };

    const handleTooltipForAvatars = (name, key, avatar) => {
        return (
            <Tooltip
                overlayClassName="tooltip_custom"
                title={`${name}`}
                key={key}
            >
                <div>
                    <AvatarImg
                        src={avatar}
                        alt="avatar"
                    />
                </div>
            </Tooltip>
        );
    };

    return (
        <Link to={`/apm/teams-people`} className="team_search_result">
            <div className="item_main_content">
                <div className="team_short_info">
                    <div className="name_sect">
                        <h3>{item.name}</h3>
                        <span
                            className="color_sect"
                            style={{
                                borderColor: item.color,
                                boxShadow: `inset 0 0 0.3vw ${item.color}`
                            }}
                        />
                    </div>

                    <div className="count_sect">
                        <span><strong>{item.admins_count}</strong> {`Admin${+(item.admins_count) > 1 ? 's' : ''}`}</span>
                        <span><strong>{managerCount}</strong> {`Manager${(managerCount) > 1 ? 's' : ''}`}</span>
                        <span><strong>{item.member_count}</strong> {`Member${+(item.member_count) > 1 ? 's' : ''}`}</span>
                    </div>

                    <div className="users_by_role">
                        <div className="administrators">
                            {item.admins_count ? <span>A</span> : ''}
                            {
                                handleGetStaff(
                                    item.all_users,
                                    undefined,
                                    undefined,
                                    1
                                )?.map(item => handleTooltipForAvatars(item.name, item.id, item.avatar))
                            }
                        </div>
                        <div className="managers">
                            {item.manager_count || item.senior_manager_count ? <span>M</span> : ''}
                            {
                                handleGetStaff(
                                    item.all_users,
                                    2,
                                    8
                                )?.map(item => handleTooltipForAvatars(item.name, item.id, item.avatar))
                            }
                        </div>
                        <div className="members">
                            {handleGetStaff(item.all_users)?.map((item) => {
                                return handleTooltipForAvatars(item.name, item.id, item.avatar);
                            })}
                        </div>
                    </div>
                </div>

                <div className="team_actions">
                    <div className="date">
                        <span className="calendar"/>
                        <p>
                            Created at {moment(item.created_at).format(`${dateFormat} HH:mm:ss`)}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TeamSearchResult;