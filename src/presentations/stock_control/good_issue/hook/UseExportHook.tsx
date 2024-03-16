import { exportDefaulExcelTemplate } from "@/lib/excel/export_excel";
import { Sheet } from "@/lib/excel/type";
import { QueryOptionAPI } from "@/lib/filter_type";
import { delay, queryOptionParser } from "@/lib/utils";
import request from "@/utilies/request";
import React, { useCallback, useMemo } from "react";
import { useQuery } from "react-query";

const defaultQuery: QueryOptionAPI = {
  skip: 0,
  top: 10,
  orderby: "DocEntry desc",
} as const;

const initialState = { ...defaultQuery };

type ActionQueryParam = {
  type: keyof QueryOptionAPI | "all";
  value?: string | number | QueryOptionAPI;
};

function reducer(state: QueryOptionAPI, action: ActionQueryParam) {
  switch (action.type) {
    case "skip":
      return { ...state, skip: action.value } as QueryOptionAPI;
    case "orderby":
      return { ...state, orderby: action.value } as QueryOptionAPI;
    case "filter":
      return { ...state, filter: action.value } as QueryOptionAPI;
    case "top":
      return { ...state, top: action.value } as QueryOptionAPI;
    case "all":
      return { ...(action.value as QueryOptionAPI) } as QueryOptionAPI;
    default:
      return state;
  }
}

const keyData = "fuel-lists";
const keyCount = "fuel_count";

export const UseExportHook = (pagination: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const filters = useMemo(() => {
    return {
      ...state,
      skip: Number(pagination?.pageIndex) * Number(pagination?.pageSize),
      top: pagination?.pageSize ?? 10,
    } as QueryOptionAPI;
  }, [pagination, state]);

  const dataQuery = useQuery({
    queryKey: [keyData + filters.skip, filters],
    queryFn: () =>
      request("GET", `/InventoryGenExits?${queryOptionParser(filters)}`),
    refetchOnWindowFocus: false,
  });
  const countQuery = useQuery({
    queryKey: [keyCount + filters.skip, filters],
    queryFn: () =>
      request("GET", `/InventoryGenExits/$count?${queryOptionParser(filters)}`),
    refetchOnWindowFocus: false,
  });

  const data: any[] = React.useMemo(
    () => (dataQuery?.data as any)?.data?.value ?? [],
    [dataQuery]
  );
  const totalRecords: number = React.useMemo(
    () => (countQuery?.data as any)?.data ?? 0,
    [countQuery]
  );

  const refetchData = async () => {
    dispatch({ type: "all", value: defaultQuery });
    dataQuery.refetch();
    countQuery.refetch();
  };

  const setFilter = (value: string) => {
    console.log(value);
    dispatch({ type: "filter", value });
  };

  const setSort = (value: string) => {
    dispatch({ type: "orderby", value });
  };

  const loading: boolean = React.useMemo(() => {
    return dataQuery.isFetching || countQuery.isFetching;
  }, [dataQuery.isFetching, countQuery.isFetching]);

  const exportExcelTemplate = useCallback(async () => {
    const query = { ...state } as QueryOptionAPI;

    delete query.top;
    delete query.skip;
    //
    const reponse: any = await request(
      "GET",
      `/InventoryGenExits?${queryOptionParser(query)}`
    );

    const lists: string[][] = [];
    const reponseData: any[] = reponse?.data?.value ?? ([] as any[]);

    for (const [index, issue] of reponseData.entries()) {
      lists.push([
        "null",
        issue?.DocNum,
        issue?.BPLName,
        issue?.U_tl_whsdesc,
        issue?.DocDate,
        issue?.DocumentStatus,
        issue?.DocTotal,
        // fuelLevel.U_tl_doc_date?.split("T")[0],
        // fuelLevel.U_tl_bplid,
        // fuelLevel.Status === "O" ? "OPEN" : "CLOSED",
      ]);
    }
    //
    //   No: index + 1,
    // Name: row?.FirstName + " " + row?.LastName,
    // Gender: row?.Gender?.replace("gt_", ""),
    // Department: new DepartmentRepository().find(row?.Department)?.Name,
    // Branch: branchAss?.data?.find((e: any) => e?.BPLID === row?.BPLID)
    //   ?.BPLName,
    // Active: row?.Active === "tYES" ? "Active" : "Inactive",
    const headers = [
      "No",
      "Document No",
      "Branch",
      "Warehouse",
      "Posting Date",
      "Status",
      "Total Quantity",
    ];
    const sheet: Sheet = {
      filename: "good_issue",
      sheetName: "good issue",
      header: {
        value: headers.map((e) => ({ value: e })),
        startCol: 1,
        startRow: 7,
      },
      body: {
        value: lists,
      },
    };
    await exportDefaulExcelTemplate(sheet);
    // setLoadingDialog(false);
  }, [state]);

  return {
    data,
    totalRecords,
    loading,
    state,
    setFilter,
    setSort,
    exportExcelTemplate,
    refetchData,
  };
};