import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SwitchTransition, CSSTransition } from "react-transition-group";

// Components
import SearchResults from './SearchResults';
import EmptyListMessage from '../../../EmptyListMessage/EmptyListMessage';

// Utils
import { search } from '@models/search';
import { getResults } from './SearchBar.config';

// Hooks
import useDebounce from '@hooks/useDebounce';
import useOnClickOutside from '@hooks/outsideClickDetect';

// Styles
import './style/search_bar.scss'

const { Search } = Input;

const SearchBar = () => {
    const location = useLocation();

    const ref = useRef(null);

    const [value, SetValue] = useState('');
    const [dataSource, SetDataSource] = useState(null);
    const [loading, SetLoading] = useState(false);

    const isDataSource = useMemo(() => {
        if (dataSource instanceof Array) {
            return dataSource.length;
        }
        return dataSource;
    }, [dataSource]);

    const debouncedValue = useDebounce(value, 500);

    useOnClickOutside(ref, (e) => {
        if (!value.trim()) return;

        if (e.target.closest('#modal-root')) return;

        SetValue('');
    });

    const handleSearchChange = (e) => {
        SetValue(e.target.value);
    };

    const handleClickSearch = (e) => {
        !value && e.target.value && SetValue(e.target.value);
    };

    const handleSearch = async (value) => {
        try {
            SetLoading(true);
            const { data } = await search.searchValue(value);
            SetDataSource(data);
        } catch (e) {
            console.log(e);
        } finally {
            SetLoading(false);
        }
    };

    useEffect(() => {
        if (debouncedValue.trim()) {
            handleSearch(debouncedValue);
        }
    }, [debouncedValue]);

    useEffect(() => {
        SetValue('');
    }, [location]);


    return (
        <Col span={20} className="search_bar">
            <div ref={ref}>
                <SearchOutlined style={{ fontSize: '1.1vw', marginRight: '1vw', color: '#2A1B7E' }} />
                {/*WE can use "loading" prop for search bar*/}
                <Search
                    onClick={handleClickSearch}
                    onChange={handleSearchChange}
                    style={{ width: 400 }}
                    placeholder="Quick search for a team, a member or a goal"
                    allowClear
                />
                <SwitchTransition>
                    <CSSTransition
                        key={value ? '1' : '2'}
                        timeout={500}
                        classNames="animation"
                    >
                        <div className="search_results_container" style={{ display: value ? 'block' : 'none' }}>
                            <SwitchTransition>
                                <CSSTransition
                                    timeout={500}
                                    classNames="animation"
                                    key={loading ? '1' : '2'}
                                >
                                    <div>
                                        {!loading ? (
                                            isDataSource ? (
                                                getResults(dataSource).map((data) => {
                                                    return (
                                                        <SearchResults key={data.title} {...data} />
                                                    );
                                                })
                                            ) : (
                                                <EmptyListMessage message="No results found" />
                                            )
                                        ) : (
                                            <div className="search_results_spinner_container">
                                                <Spin className="search_results_spinner" size="large" />
                                            </div>
                                        )}
                                    </div>
                                </CSSTransition>
                            </SwitchTransition>
                        </div>
                    </CSSTransition>
                </SwitchTransition>

            </div>
        </Col>
    );
};

export default SearchBar;