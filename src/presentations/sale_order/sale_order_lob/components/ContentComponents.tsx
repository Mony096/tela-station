import React, { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Button, Checkbox, IconButton, TextField } from "@mui/material";
import FormCard from "@/components/card/FormCard";
import Modal from "@/components/modal/Modal";
import { BiSearch } from "react-icons/bi";
import MUITextField from "@/components/input/MUITextField";
import shortid from "shortid";
import { NumericFormat } from "react-number-format";
import SalePersonAutoComplete from "@/components/input/SalesPersonAutoComplete";
import { useDocumentTotalHook } from "@/hook";
import MUIRightTextField from "@/components/input/MUIRightTextField";

interface ContentComponentProps {
  items: any[];
  onChange?: (key: any, value: any) => void;
  columns: any[];
  type?: String;
  labelType?: String;
  typeLists?: any[];
  onRemoveChange?: (record: any[]) => void;
  readOnly?: boolean;
  viewOnly?: boolean;
  data: any;
  loading: boolean;
  isNotAccount: any;
  handlerAddSequence: any;
}

export default function ContentComponent(props: ContentComponentProps) {
  const [colVisibility, setColVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const [rowSelection, setRowSelection] = React.useState<any>({});

  const handlerRemove = () => {
    if (
      props.onRemoveChange === undefined ||
      Object.keys(rowSelection).length === 0
    )
      return;

    let temps: any[] = [
      ...props.items.filter(({ ItemCode }: any) => ItemCode != ""),
    ];
    Object.keys(rowSelection).forEach((index: any) => {
      const item = props.items[index];
      const indexWhere = temps.findIndex((e) => e?.ItemCode === item?.ItemCode);
      if (indexWhere >= 0) temps.splice(indexWhere, 1);
    });
    setRowSelection({});
    props.onRemoveChange(temps);
  };

  React.useEffect(() => {
    const cols: any = {};
    props.columns.forEach((e: any) => {
      cols[e?.accessorKey] = e?.visible;
    });
    setColVisibility({ ...cols, ...colVisibility });
  }, [props.columns]);

  const columns = useMemo(() => props.columns, [colVisibility]);

  const onCheckRow = (event: any, index: number) => {
    const rowSelects: any = { ...rowSelection };
    rowSelects[index] = true;

    if (!event.target.checked) {
      delete rowSelects[index];
    }

    setRowSelection(rowSelects);
  };

  const handlerAdd = () => {
    const Items = [
      ...props?.items,
      {
        ItemCode: "",
      },
    ];
    if (props?.onChange) props.onChange("Items", Items);
  };

  const itemInvoicePrices =
    props?.items?.reduce((prev: number, item: any) => {
      return prev + parseFloat(item?.Amount || 0);
    }, 0) || 0;

  const onChange = (key: string, value: any) => {
    if (props.onChange) props.onChange(key, value);
  };
  const [docTotal, docTaxTotal, grossTotal] = useDocumentTotalHook(
    props.data.Items ?? [],
    props?.data?.DiscountPercent === "" ? 0 : props.data?.DiscountPercent,
    props.data.ExchangeRate === 0 ? 1 : props.data.ExchangeRate
  );

  const discountAmount = useMemo(() => {
    const dataDiscount: number =
      props?.data?.DiscountPercent === "" ? 0 : props.data?.DiscountPercent;
    if (dataDiscount <= 0) return 0;
    if (dataDiscount > 100) return 100;
    return docTotal * (dataDiscount / 100);
  }, [props?.data?.DiscountPercent, props.data.Items]);

  return (
    <FormCard
      title="Content"
      action={
        <div className="flex ">
          <Button size="small" disabled={props?.data?.isStatusClose || false}>
            <span className="capitalize text-sm" onClick={handlerRemove}>
              Remove
            </span>
          </Button>
        </div>
      }
    >
      <>
        <div className="col-span-2 data-table">
          <MaterialReactTable
            columns={[
              {
                accessorKey: "id",
                size: 30,

                Cell: (cell) => (
                  <Checkbox
                    checked={cell.row.index in rowSelection}
                    size="small"
                    onChange={(event) => onCheckRow(event, cell.row.index)}
                  />
                ),
              },
              ...columns,
            ]}
            data={[...props?.data?.Items, { ItemCode: "" }]}
            enableRowNumbers={false}
            enableStickyHeader={true}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableTopToolbar={false}
            enableColumnResizing={true}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableFilters={false}
            enableFullScreenToggle={false}
            enableGlobalFilter={false}
            enableHiding={true}
            enablePinning={true}
            onColumnVisibilityChange={setColVisibility}
            enableStickyFooter={false}
            enableMultiRowSelection={true}
            initialState={{
              density: "compact",
              columnVisibility: colVisibility,
              rowSelection,
            }}
            state={{
              columnVisibility: colVisibility,
              rowSelection,
              isLoading: props.loading,
              showProgressBars: props.loading,
              showSkeletons: props.loading,
            }}
            muiTableBodyRowProps={() => ({
              sx: { cursor: "pointer" },
            })}
            enableTableFooter={false}
          />
          <div className="grid grid-cols-12 mt-2">
            <div className="col-span-5"></div>

            <div className="col-span-2"></div>
            <div className="col-span-5 ">
              <div className="grid grid-cols-2 py-2">
                <div className="col-span-1 text-lg font-medium">
                  Total Summary
                </div>
              </div>
              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">
                  Total Before Discount
                </div>
                <div className="col-span-6 text-gray-900">
                  <NumericFormat
                    className="bg-white w-full"
                    value={docTotal === 0 ? "" : docTotal}
                    thousandSeparator
                    startAdornment={props?.data?.Currency}
                    decimalScale={props.data.Currency === "USD" ? 3 : 0}
                    placeholder={props.data.Currency === "USD" ? "0.000" : "0"}
                    readonly
                    customInput={MUIRightTextField}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6 text-gray-700">Discount</div>
                    <div className="col-span-6  text-gray-900 mr-2">
                      <NumericFormat
                        className="bg-white w-full"
                        value={props?.data?.DiscountPercent}
                        thousandSeparator
                        startAdornment={"%"}
                        decimalScale={props.data.Currency === "USD" ? 3 : 0}
                        // fixedDecimalScale
                        placeholder={
                          props.data.Currency === "USD" ? "0.000" : "0"
                        }
                        onChange={(event: any) => {
                          if (
                            !(
                              event.target.value <= 100 &&
                              event.target.value >= 0
                            )
                          ) {
                            event.target.value = 0;
                          }
                          onChange("DiscountPercent", event.target.value);
                        }}
                        customInput={MUIRightTextField}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6 text-gray-900 ">
                  <div className="grid grid-cols-4">
                    <div className="col-span-4">
                      <NumericFormat
                        className="bg-white w-full"
                        value={discountAmount}
                        thousandSeparator
                        startAdornment={props?.data?.Currency}
                        decimalScale={props.data.Currency === "USD" ? 3 : 0}
                        placeholder={
                          props.data.Currency === "USD" ? "0.000" : "0"
                        }
                        readonly
                        customInput={MUIRightTextField}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">Tax</div>
                <div className="col-span-6 text-gray-900">
                  <NumericFormat
                    className="bg-white w-full"
                    value={docTaxTotal === 0 ? "" : docTaxTotal}
                    thousandSeparator
                    startAdornment={props?.data?.Currency}
                    decimalScale={props.data.Currency === "USD" ? 3 : 0}
                    placeholder={props.data.Currency === "USD" ? "0.000" : "0"}
                    readonly
                    customInput={MUIRightTextField}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 py-1">
                <div className="col-span-6 text-gray-700">Total</div>
                <div className="col-span-6 text-gray-900">
                  <NumericFormat
                    className="bg-white w-full"
                    value={grossTotal === 0 ? "" : grossTotal}
                    thousandSeparator
                    startAdornment={props?.data?.Currency}
                    decimalScale={props.data.Currency === "USD" ? 3 : 0}
                    placeholder={props.data.Currency === "USD" ? "0.000" : "0"}
                    readonly
                    customInput={MUIRightTextField}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </FormCard>
  );
}
