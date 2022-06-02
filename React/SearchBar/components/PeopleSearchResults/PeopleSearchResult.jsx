import React from "react";
import {Tooltip, Col} from "antd";

// Components
import AvatarImg from "@shared/AvatarImg/AvatarImg";

// Styles
import "./style/people_search_result.scss";
import {Link} from "react-router-dom";

const getBadgeStyles = (color) => {
    return color && {
        color: color,
        borderColor: color,
        boxShadow: `inset 0 0 1.1vw -0.6vw ${color}`
    };
};

const PeopleSearchResult = ({item}) => {
    const getTeamsList = () => {
        const teams = Array.from(item.teams, el => el);
        const visibleTeam = teams.shift();

        for (let i = 0; i < teams.length; i++) {
            teams[i] = teams[i].name;
        }

        return (<>
            <span
                style={getBadgeStyles(visibleTeam.color)}
                className="team_badge"
            >
                {visibleTeam.name}
            </span>

            {!!teams.length && <Tooltip
                title={teams.join(', ')}
                overlayClassName="tooltip_custom"
            >
                <span className="count">
                    {`+${teams.length}`}
                </span>
            </Tooltip>}
        </>);
    };

    return (
        <Col xs={24} md={8} xl={4}>
            <Link to={`/apm/teams-people/user/${item.id}`} className="people_search_result">
                <div className="person_img_role_sect">
                    <AvatarImg
                        src={item.avatar}
                        imgClassName={"avatar_img"}
                    />
                    <span className="user_role_badge">{item.role}</span>
                </div>

                <div className="card_content">
                    <h3>{item.first_name}</h3>
                    <h3>{item.last_name}</h3>

                    <div className="teams_sect">
                        {!!item.teams?.length && getTeamsList()}
                    </div>
                </div>
            </Link>
        </Col>
    );
};

export default PeopleSearchResult;