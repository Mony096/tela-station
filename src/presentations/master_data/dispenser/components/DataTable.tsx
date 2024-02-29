import React from "react"
import { Button } from "@mui/material"
import { HiRefresh } from "react-icons/hi"
import { BiFilterAlt } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { AiOutlineSetting } from "react-icons/ai"
import MaterialReactTable from "material-react-table"
import { BsPencilSquare, BsSortDown } from "react-icons/bs"
import MenuCompoment from "@/components/data_table/MenuComponent"
import { ThemeContext } from "@/contexts"
import DataTableColumnFilter from "@/components/data_table/DataTableColumnFilter"
import ColumnSearch from "@/components/data_table/ColumnSearch"
import DataTableColumnVisibility from "@/components/data_table/DataTableColumnVisibility"
import Papa from "papaparse"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useQuery } from "react-query"
import request, { url } from "@/utilies/request"

interface DataTableProps {
  columns: any[]
  data: any[]
  count: number
  handlerRefresh: () => void
  loading: boolean
  handlerSortby: (value: string) => void
  handlerSearch: (value: string) => void
  pagination: any
  paginationChange: (value: any) => void
  title?: string
  createRoute?: string,
  filter?:any
}

export default function DataTable(props: DataTableProps) {
  const route = useNavigate()
  const search = React.createRef<ColumnSearch>()
  const [colVisibility, setColVisibility] = React.useState<Record<string, boolean>>(
    {}
  )

  React.useEffect(() => {
    const cols: any = {}
    props.columns.forEach((e) => {
      cols[e.accessorKey] = e?.visible ?? true
    })
    setColVisibility(cols)
  }, [])

  const handlerSearch = (queries: any) => {
    if (queries === "") return
    props.handlerSearch("&$filter=" + queries)
  }

  const handleExportToCSV = async () => {
    const response: any = await request(
      "GET",
      `${url}/TL_Dispenser/?${props?.filter.replace('&', '')}`
    )
      .then(async (res: any) => res?.data)
      .catch((e: Error) => {
        throw new Error(e.message);
      });
    
    const csvContent = convertToCSV(response?.value);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a link element to download the CSV file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pump_list.csv";

    // Simulate a click on the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
  };

  const convertToCSV = (data: any[]) => {
    // Specify the desired field names
    const fields = [
      "Pump Code",
      "Pump Description",
      "Number of Nozzle",
      "Status",
    ];

    // Map the data to the desired field names
    const mappedData = data.map((row) => ({
      "Pump Code": row.Code,
      "Pump Description": row.Name,
      "Number of Nozzle": row.U_tl_pumpnum,
      "Status": row.U_tl_status,
    }));

    // Create CSV content with the specified fields
    const csvContent = Papa.unparse(
      {
        fields,
        data: mappedData,
      },
      {
        delimiter: ",", // Specify the delimiter
        header: true, // Include headers in the CSV
      }
    );

    return csvContent;
  };

  return (
    <div
      className={` rounded-lg shadow-sm  p-4 flex flex-col gap-3 bg-white border`}
    >
      <div className="flex justify-between">
        <div className="flex gap-4 items-center justify-center">
          <h3 className="text-base">{props.title}</h3>
          {/* <DataTableColumnFilter
            handlerClearFilter={props.handlerRefresh}
            title={
              <div className="flex gap-2">
                <span className="text-lg">
                  <BiFilterAlt />
                </span>{" "}
                <span className="text-[13px] capitalize">Filter</span>
              </div>
            }
            items={props.columns?.filter((e) => e?.accessorKey !== "DocEntry")}
            onClick={handlerSearch}
          /> */}
        </div>
        <div className="flex justify-end gap-2 items-center text-[13px]">
          {/* <Button size="small" variant="text" onClick={props.handlerRefresh}>
            <span className="text-lg mr-2">
              <HiRefresh />
            </span>
            <span className="capitalize text-sm">Refresh</span>
          </Button>*/}
          
          <Button
            size="small"
            variant="text"
            onClick={() => route(props?.createRoute)}
          >
            <span className="text-lg mr-2">
              <BsPencilSquare />
            </span>
            <span className="capitalize text-sm">Create</span>
          </Button>
          <Button size="small" variant="text" onClick={props.handlerRefresh}>
            <span className="text-lg mr-2">
              <HiRefresh />
            </span>
            <span className="capitalize text-sm">Refresh</span>
          </Button>
          <MenuCompoment
            title={
              <div className="flex gap-2">
                <span className="text-lg">
                  <BsSortDown />
                </span>{" "}
                <span className="text-[13px] capitalize">Sort By</span>
              </div>
            }
            items={props.columns}
            onClick={props.handlerSortby}
          /> 
          <Button
            size="small"
            variant="text"
            onClick={() => {
              if (props.data && props.data.length > 0) {
                handleExportToCSV();
              }
            }}
          >
            <span className="text-sm mr-2">
              <InsertDriveFileOutlinedIcon
                style={{ fontSize: "18px", marginBottom: "2px" }}
              />
            </span>
            <span className="capitalize text-[13px] ">Export to CSV</span>
          </Button>
          {/* <DataTableColumnVisibility
            title={
              <div className="flex gap-2">
                <span className="text-lg">
                  <AiOutlineSetting />
                </span>{" "}
                <span className="text-[13px] capitalize">Columns</span>
              </div>
            }
            items={props.columns}
            onClick={(value) => {
              setColVisibility(value)
            }}
          /> */}
        </div>
      </div>

      <div className="grow data-grid border-t bg-inherit ">
        <MaterialReactTable
          columns={props.columns}
          data={props.data ?? []}
          enableHiding={false}
          initialState={{
            density: "compact",
            columnVisibility: colVisibility,
          }}
          enableDensityToggle={true}
          // enableColumnResizing
        
          enableFullScreenToggle={false}
          enableStickyHeader={false}
          enableStickyFooter={false}
          enablePagination={true}
          enableColumnFilters={false}
          manualPagination={true}
          enableColumnActions={false}
          enableSorting={false}
          muiTablePaginationProps={{
            rowsPerPageOptions: [5, 10, 15],
          }}
          enableFilters={false}
          enableGlobalFilter={false}
          rowCount={props.count ?? 0}
          getRowId={(row: any) => row.DocEntry}
          onPaginationChange={props.paginationChange}
          state={{
            isLoading: props.loading,
            pagination: props.pagination,
            columnVisibility: colVisibility,
          }}
          enableColumnVirtualization={false}
          onColumnVisibilityChange={setColVisibility}
        />

        <ColumnSearch ref={search} onOk={handlerSearch} />
      </div>
    </div>
  )
}
