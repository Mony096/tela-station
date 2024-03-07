import request, { url } from "@/utilies/request";
import React from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../components/DataTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MUITextField from "@/components/input/MUITextField";
import BPAutoComplete from "@/components/input/BPAutoComplete";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { BiFilterAlt } from "react-icons/bi";
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter";
import moment from "moment";
import MUISelect from "@/components/selectbox/MUISelect";
import { Breadcrumb } from "../components/Breadcrumn";
import MUIDatePicker from "@/components/input/MUIDatePicker";
import BranchBPLRepository from "@/services/actions/branchBPLRepository";
import BPLBranchSelect from "@/components/selectbox/BranchBPL";
import { useCookies } from "react-cookie";
import BranchAutoComplete from "@/components/input/BranchAutoComplete";

export default function List() {
  const [open, setOpen] = React.useState<boolean>(false);
  const route = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "DocEntry",
        header: "No.", //uses the default width from defaultColumn prop
        size: 20,
      },
      {
        accessorKey: "DocNum",
        header: "Document No", //uses the default width from defaultColumn prop
        enableClickToCopy: true,
        enableFilterMatchHighlighting: true,
        visible: true,
        type: "number",
      },
      {
        accessorKey: "DocumentDate",
        header: "Posting Date",
      },
      {
        accessorKey: "Status",
        header: "Status ",
        Cell: (cell: any) => {
          return cell.row.original.Status == "O" ? "Open" : "Closed";
        },
      },
      {
        accessorKey: "DocEntry",
        minSize: 100,
        maxSize: 100,
        header: "Action",
        visible: true,
        Cell: (cell: any) => (
          <div className="flex space-x-2">
            <Button
              variant="outlined"
              size="small"
              className="bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded"
              onClick={() => {
                route(
                  `/stock-control/fuel-level/` + cell.row.original.DocEntry,
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <VisibilityIcon fontSize="small" className="text-gray-600 " />{" "}
              <span style={{ textTransform: "none" }}>View</span>
            </Button>
            <Button
              variant="outlined"
              size="small"
              disabled={
                cell.row.original.DocumentStatus === "bost_Close" ?? false
              }
              className={`${cell.row.original.DocumentStatus === "bost_Close"
                ? "bg-gray-400"
                : ""
                } bg-transparent text-gray-700 px-[4px] py-0 border border-gray-200 rounded`}
              onClick={() => {
                route(
                  `/stock-control/fuel-level/` +
                  cell.row.original.DocEntry +
                  "/edit",
                  {
                    state: cell.row.original,
                    replace: true,
                  }
                );
              }}
            >
              <DriveFileRenameOutlineIcon
                fontSize="small"
                className="text-gray-600 "
              />{" "}
              <span style={{ textTransform: "none" }}> Edit</span>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const [filter, setFilter] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Count: any = useQuery({
    queryKey: ["fuel-count" + filter !== "" ? "-f" : ""],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_FUEL_LEVEL/$count?$select=DocNum${filter}`
      )
        .then(async (res: any) => res?.data)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
  });


  const { data, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [
      "fuel-level",
      `${pagination.pageIndex * 10}_${filter !== "" ? "f" : ""}`,
    ],
    queryFn: async () => {
      const response: any = await request(
        "GET",
        `${url}/TL_FUEL_LEVEL?$top=${pagination.pageSize}&$skip=${pagination.pageIndex * pagination.pageSize
        }${filter}${sortBy !== "" ? "&$orderby=" + sortBy : ""}`
      )
        .then((res: any) => res?.data?.value)
        .catch((e: Error) => {
          throw new Error(e.message);
        });
      return response;
    },
    staleTime: Infinity,
    retry: 1,
  });

  const handlerRefresh = React.useCallback(() => {
    setFilter("");
    setSortBy("");
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  }, []);

  const handlerSortby = (value: any) => {
    setSortBy(value);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handlerSearch = (value: string) => {
    const qurey = value;
    setFilter(qurey);
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setTimeout(() => {
      Count.refetch();
      refetch();
    }, 500);
  };

  const handlerSearchFilter = (queries: any) => {
    if (queries === "") return handlerSearch("");
    handlerSearch("&$filter=" + queries);
  };


  const [cookies] = useCookies(["user"]);

  const [searchValues, setSearchValues] = React.useState({});

  const handleGoClick = () => {
  };

  const childBreadcrum = (
    <>
      <span className="" onClick={() => route(`/stock-control/fuel-level`)}>
        <span className=""></span> Fuel Level Test
      </span>
    </>
  );

  return (
    <>
      <div className="w-full h-full px-4 py-2 flex flex-col gap-1 relative bg-white ">
        <div className="flex pr-2  rounded-lg justify-between items-center z-10 top-0 w-full  py-2 bg-white">
          <Breadcrumb childBreadcrum={childBreadcrum} />
        </div>

        <div className="flex gap-3 mb-5 mt-2 mx-1 rounded-md  ">
          <div className="grow">
            <div className="grid grid-cols-10  space-x-4">
              <div className="col-span-2 2xl:col-span-3">
                <MUITextField
                  label="Document No."
                  placeholder="Document No."
                  className="bg-white"
                  autoComplete="off"
                  type="number"
                  value={searchValues.docnum}
                  onChange={(e) =>
                    setSearchValues({ ...searchValues, docnum: e.target.value })
                  }
                />
              </div>

              <div className="col-span-2 2xl:col-span-3">
                <MUIDatePicker
                  label="Posting Date"
                  value={searchValues.deliveryDate}
                  // onChange={(e: any) => handlerChange("PostingDate", e)}
                  onChange={(e) => { }}
                />
              </div>

              <div className="col-span-2 2xl:col-span-3">
                <div className="flex flex-col gap-1 text-sm">
                  <label htmlFor="Code" className="text-gray-500 text-[14px]">
                    Branch
                  </label>
                  <div className="">
                    <BranchAutoComplete
                      BPdata={cookies?.user?.UserBranchAssignment}
                      onChange={(selectedValue) =>
                        setSearchValues({
                          ...searchValues,
                          bplid: selectedValue,
                        })
                      }
                      value={searchValues.bplid}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="">
            <div className="flex justify-end items-center align-center space-x-2 mt-4">
              <div className="">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleGoClick}
                >
                  Go
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data}
          handlerRefresh={handlerRefresh}
          handlerSearch={handlerSearch}
          handlerSortby={handlerSortby}
          count={Count?.data || 0}
          loading={isLoading || isFetching}
          pagination={pagination}
          paginationChange={setPagination}
          title="Fuel Level Lists"
          createRoute={`/stock-control/fuel-level/create`}
        />
      </div>
    </>
  );
}
