import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import Table from 'rc-table';
import ReactPaginate from 'react-paginate';

// styles
import styles from './CustomTable.module.scss';

// components
import SearchInput from "../../../../components/common/form/SearchInput";

// utils
import i18n from "../../../../i18n";

const CustomTable = ({data, columns, heading, handlePageChange, handleSearch, namespace}) => {
  const {
    data: tableData,
    total,
    per_page
  } = data;

  const modifiedTableData = useMemo(() => tableData?.map((tableDataItem, index) => ({...tableDataItem, key: `${tableDataItem}${index}`})),[tableData]);
  const totalPages = useMemo(() => Math.ceil(total / per_page), [total, per_page]);

  const language = useSelector(state => state.languageReducer);
  const dashboardWithLang = i18n[language].dashboard;

  return (
    <div className={`${styles['CustomTable']} ${styles[namespace]}`}>
      <div className={styles['CustomTable-top']}>
        <h6 className={styles['CustomTable-top__heading']}>
          {heading}
        </h6>
        <SearchInput handleChange={(e) => handleSearch(namespace, e.target.value)}/>
      </div>
      <Table columns={columns} data={modifiedTableData} emptyText={dashboardWithLang.noData} />
      {data?.data && Object.keys(data?.data)?.length ? <ReactPaginate
        pageCount={totalPages}
        onPageChange={(value) => handlePageChange(namespace, value)}
        containerClassName={styles['custom-table-list']}
        pageClassName={styles['custom-table-list__item']}
        pageLinkClassName={styles['custom-table-list__item_link']}
        activeClassName={styles['custom-table-list__item_active']}
        activeLinkClassName={styles['custom-table-list__item_link_active']}
        previousClassName={styles['custom-table-list__item_prev']}
        previousLinkClassName={styles['custom-table-list__item_prevLink']}
        nextClassName={styles['custom-table-list__item_next']}
        nextLinkClassName={styles['custom-table-list__item_nextLink']}
        breakClassName={styles['custom-table-list__item_break']}
        breakLinkClassName={styles['custom-table-list__item_breakLink']}
        nextLabel={dashboardWithLang.next}
        previousLabel	={dashboardWithLang.previous}
      /> : null}
    </div>
  );
};

export default CustomTable;