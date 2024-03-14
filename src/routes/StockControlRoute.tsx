import { Route, Routes } from "react-router-dom";
import { APIContextProvider } from "@/presentations/expense/context/APIContext";
import StockControlPage from "@/presentations/stock_control";
import InventoryTransferRequestList from "@/presentations/stock_control/inventory_transfer_request";
import { InventoryTransferRequestForm } from "@/presentations/stock_control/inventory_transfer_request/form/index";
import GoodIssueList from "@/presentations/stock_control/good_issue";
import GoodIssueForm from "@/presentations/stock_control/good_issue/form/GoodIssueForm";
import PumpTestList from "@/presentations/stock_control/pump_test";
import PumpTestForm from "@/presentations/stock_control/pump_test/form/index";
import PumpTestDetail from "@/presentations/stock_control/pump_test/detail/index";
import FuelLevelList from "@/presentations/stock_control/fuel_level";
import GoodReceiptList from "@/presentations/stock_control/good_receipt";
import GoodReceiptForm from "@/presentations/stock_control/good_receipt/form/GoodReceiptForm";
import GoodReceiptDetails from "@/presentations/stock_control/good_receipt/detail/index";
import { FuelLevelForm } from "@/presentations/stock_control/fuel_level/form/FuelLevelForm";

import {InventoryTransferRequestDetails} from "@/presentations/stock_control/inventory_transfer_request/detail/index"
import InventoryTransferList from "@/presentations/stock_control/inventory_transfer";
import {InventoryTransferForm} from "@/presentations/stock_control/inventory_transfer/form";
import {InventoryTransferDetails} from "@/presentations/stock_control/inventory_transfer/detail/index"
import { FuelLevelFormDetail } from "@/presentations/stock_control/fuel_level/form/FuelLevelFormDetail";
import GoodIssueDetail from "@/presentations/stock_control/good_issue/detail/GoodIssueDetail";

export default function StockControlRoute() {
  return (
    <APIContextProvider>
      <Routes>
        <Route index element={<StockControlPage />} />

        <Route path="/inventory-transfer-request">
          <Route index element={<InventoryTransferRequestList />} />
          <Route path="create" element={<InventoryTransferRequestForm />} />
          <Route path=":id/edit" element={<InventoryTransferRequestForm edit={true} />} />
          <Route path=":id" element={<InventoryTransferRequestDetails />} />
        </Route>
        <Route path="/stock-transfer">
          <Route index element={<InventoryTransferList />} />
          <Route path="create" element={<InventoryTransferForm />} />
          <Route path=":id/edit" element={<InventoryTransferForm edit={true} />} />
          <Route path=":id" element={<InventoryTransferDetails />} />
        </Route>
        <Route path="/good-issue">
          <Route index element={<GoodIssueList />} />
          <Route path="create" element={<GoodIssueForm />} />
          <Route path=":id/edit" element={<GoodIssueForm edit={true} />} />
          <Route path=":id" element={<GoodIssueDetail detail={true} />} />
        </Route>
        <Route path="/good-receipt">
          <Route index element={<GoodReceiptList />} />
          <Route path="create" element={<GoodReceiptForm />} />
          <Route path=":id/edit" element={<GoodReceiptForm edit={true} />} />
          <Route path=":id" element={<GoodReceiptDetails edit={true} />} />
        </Route>

        <Route path="/pump-test">
          <Route index element={<PumpTestList />} />
          <Route path="create" element={<PumpTestForm />} />
          <Route path=":id/edit" element={<PumpTestForm edit={true} />} />
          <Route path=":id" element={<PumpTestDetail edit={true} />} />
        </Route>
        <Route path="/fuel-level">
          <Route index element={<FuelLevelList />} />
          <Route path="create" element={<FuelLevelForm />} />
          <Route path=":id/edit" element={<FuelLevelForm edit={true} />} />
          <Route path=":id" element={<FuelLevelFormDetail />} />
        </Route>
      </Routes>
    </APIContextProvider>
  );
}
