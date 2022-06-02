import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

// styles
import styles from './Dashboard.module.scss';

// components
import CustomTable from "./components/CustomTable/CustomTable";
import MostRecentOrders from "./components/MostRecentOrders/MostRecentOrders";
import ProfileDetails from "./components/ProfileDetails/ProfileDetails";

// actions
import {getProfile, getProgress, getOffers, getRecentOrders} from "../../actions/dashboard";

// utils
import i18n from '../../i18n';

// constants
import profileColumns from "../../constants/profileColumns";
import progressColumns from "../../constants/progressColumns";
import offerColumns from "../../constants/offersColumns";


const Dashboard = () => {
  const dispatch = useDispatch();
  const {profile, progress, offers, recentOrders} = useSelector(state => state.adminPanelReducer);
  const language = useSelector(state => state.languageReducer);
  const dashboardWithLang = i18n[language].dashboard;

  const [tablesParams, setTablesParams] = useState({
    'profile-table': {
      page: 1,
      search: ''
    },
    'progress-table': {
      page: 1,
      search: ''
    },
    'offers-table': {
      page: 1,
      search: ''
    }
  });

  const profileColumnsWithLang = profileColumns(dashboardWithLang);
  const progressColumnsWithLang = progressColumns(dashboardWithLang);
  const offerColumnsWithLang = offerColumns(dashboardWithLang);

  useEffect(() => {
    dispatch(getProfile(tablesParams['profile-table']));
    dispatch(getProgress(tablesParams['progress-table']));
    dispatch(getOffers(tablesParams['offers-table']));
  }, [tablesParams]);

  useEffect(() => {
    dispatch(getRecentOrders());
  }, []);

  const handleSearch = (namespace, search) => {
    setTablesParams(prevState => ({
      ...prevState,
      [namespace]: {
        ...prevState[namespace],
        search
      }
    }));
  };

  const handlePageChange = (namespace, page) => {
    setTablesParams(prevState => ({
      ...prevState,
      [namespace]: {
        ...prevState[namespace],
        page: page.selected + 1
      }
    }));
  };

  return (
    <div className={styles['Dashboard']}>
      <MostRecentOrders data={recentOrders} />
      <CustomTable
        heading={dashboardWithLang.profile}
        data={profile}
        columns={profileColumnsWithLang}
        namespace="profile-table"
        handlePageChange={handlePageChange}
        handleSearch={handleSearch}
      />
      <CustomTable
        heading={dashboardWithLang.progress}
        data={progress}
        columns={progressColumnsWithLang}
        namespace="progress-table"
        handlePageChange={handlePageChange}
        handleSearch={handleSearch}
      />
      <CustomTable
        heading={dashboardWithLang.offers}
        data={offers}
        columns={offerColumnsWithLang}
        namespace="offers-table"
        handlePageChange={handlePageChange}
        handleSearch={handleSearch}
      />
      <ProfileDetails />
    </div>
  );
};

export default Dashboard;