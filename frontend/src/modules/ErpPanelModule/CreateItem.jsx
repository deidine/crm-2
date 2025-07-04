"use client"

import { useState, useEffect } from "react"
import { Button, Tag, Form, Divider } from "antd"
import { PageHeader } from "@ant-design/pro-layout"
import { useSelector, useDispatch } from "react-redux"
import useLanguage from "@/locale/useLanguage"
import { settingsAction } from "@/redux/settings/actions"
import { erp } from "@/redux/erp/actions"
import { selectCreatedItem } from "@/redux/erp/selectors"
import calculate from "@/utils/calculate"
import { generate as uniqueId } from "shortid"
import Loading from "@/components/Loading"
import { ArrowLeftOutlined, CloseCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

function SaveForm({ form }) {
  const translate = useLanguage()
  const handelClick = () => {
    form.submit()
  }

  return (
    <Button onClick={handelClick} type="primary" icon={<PlusOutlined />}>
      {translate("Save")}
    </Button>
  )
}

export default function CreateItem({ config, CreateForm }) {
  const translate = useLanguage()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(settingsAction.list({ entity: "setting" }))
  }, [])

  const { entity } = config
  const { isLoading, isSuccess, result } = useSelector(selectCreatedItem)
  const [form] = Form.useForm()
  const [subTotal, setSubTotal] = useState(0)
  const [offerSubTotal, setOfferSubTotal] = useState(0)

  const handelValuesChange = (changedValues, values) => {
    console.log("=== VALUES CHANGE DEBUG ===")
    console.log("Changed values:", changedValues)
    console.log("All values:", values)

    const items = values["items"]
    let subTotal = 0
    let subOfferTotal = 0

    if (items && Array.isArray(items)) {
      items.forEach((item, index) => {
        console.log(`Item ${index}:`, item)

        if (item) {
          // Handle offer price calculation
          if (item.offerPrice && item.quantity) {
            const offerTotal = calculate.multiply(Number.parseFloat(item.quantity), Number.parseFloat(item.offerPrice))
            subOfferTotal = calculate.add(subOfferTotal, offerTotal)
            console.log(`Item ${index} offer total:`, offerTotal)
          }

          // Handle regular price calculation
          if (item.quantity && item.price) {
            const itemQuantity = Number.parseFloat(item.quantity) || 0
            const itemPrice = Number.parseFloat(item.price) || 0
            const total = calculate.multiply(itemQuantity, itemPrice)
            subTotal = calculate.add(subTotal, total)
            console.log(`Item ${index} - Qty: ${itemQuantity}, Price: ${itemPrice}, Total: ${total}`)
          }
        }
      })
    }

    console.log("Final subtotal:", subTotal)
    console.log("Final offer subtotal:", subOfferTotal)
    console.log("=== END DEBUG ===")

    setSubTotal(subTotal)
    setOfferSubTotal(subOfferTotal)
  }

  // Alternative method to recalculate when form values change
  const recalculateSubtotal = () => {
    const values = form.getFieldsValue()
    handelValuesChange({}, values)
  }

  // Add a useEffect to periodically check for changes
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     recalculateSubtotal()
  //   }, 500)

  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    if (isSuccess) {
      form.resetFields()
      dispatch(erp.resetAction({ actionType: "create" }))
      setSubTotal(0)
      setOfferSubTotal(0)
      navigate(`/${entity.toLowerCase()}/read/${result._id}`)
    }
    return () => {}
  }, [isSuccess])

  const onSubmit = (fieldsValue) => {
    console.log("🚀 ~ onSubmit ~ fieldsValue:", fieldsValue)
    if (fieldsValue) {
      if (fieldsValue.items) {
        const newList = [...fieldsValue.items]
        newList.map((item) => {
          item.total = calculate.multiply(item.quantity, item.price)
        })
        fieldsValue = {
          ...fieldsValue,
          items: newList,
        }
      }
    }
    dispatch(erp.create({ entity, jsonData: fieldsValue }))
  }

  return (
    <>
      <PageHeader
        onBack={() => {
          navigate(`/${entity.toLowerCase()}`)
        }}
        backIcon={<ArrowLeftOutlined />}
        title={translate("New")}
        ghost={false}
        tags={<Tag>{translate("Draft")}</Tag>}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => navigate(`/${entity.toLowerCase()}`)}
            icon={<CloseCircleOutlined />}
          >
            {translate("Cancel")}
          </Button>,
          <SaveForm form={form} key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
        }}
      ></PageHeader>
      <Divider dashed />
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={handelValuesChange}>
          <CreateForm subTotal={subTotal} offerTotal={offerSubTotal} />
        </Form>
      </Loading>
    </>
  )
}
