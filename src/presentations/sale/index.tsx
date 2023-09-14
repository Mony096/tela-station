import MainContainer from "@/components/MainContainer"
import ItemCard from "@/components/card/ItemCart"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineFileAdd, AiOutlineFileProtect } from "react-icons/ai"
import { request } from "http"
import SalesQuotationRepository from "@/services/actions/SalesQuotationRepository"
import SalesOrderRepository from "@/services/actions/SalesOrderRepository"

const SaleMasterPage = () => {
  const navigate = useNavigate()
  const [count, setCount]: any = useState()
  const goTo = (route: string) => navigate("/sale/" + route)

  const getCount = async () => {
    const order = await new SalesOrderRepository().getCount({})
    setCount({
      ...count,
      order,
    })
  }

  useEffect(() => {
    getCount()
  }, [])


  console.log(count)
  return (
    <>
      <MainContainer title="Sales">
        {/* <ItemCard
          title="Sales Quotation"
          icon={<AiOutlineFileProtect />}
          onClick={() => goTo("sales-quotation")}
          amount={count?.quotation || 0}
        /> */}
        <ItemCard
          title="Sales Order"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("sales-order")}
          amount={count?.order || 0}
        />
        {/* <ItemCard
          title="Return Request"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("return-request")}
          amount={count?.order || 0}
        />
        <ItemCard
          title="Return"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("return")}
          amount={count?.order || 0}
        />
         <ItemCard
          title="Delivery"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("delivery")}
          amount={count?.order || 0}
        />
         <ItemCard
          title="A/R Invoice"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("invoice")}
          amount={count?.order || 0}
        /> */}
          <ItemCard
          title="Delivery"
          icon={<AiOutlineFileAdd />}
          onClick={() => goTo("delivery")}
          amount={count?.delivery || 0}
        />
      </MainContainer>
    </>
  )
}

export default SaleMasterPage
