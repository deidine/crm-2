"use client"

import { useState, useEffect } from "react"
import { Form, Input, InputNumber, Row, Col } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useMoney } from "@/settings"
import calculate from "@/utils/calculate"
import AutoCompleteAsyncObject from "@/components/AutoCompleteAsyncObject"

export default function ItemRow({ field, remove, current = null }) {
  const [totalState, setTotal] = useState(0)
  const money = useMoney()
  const form = Form.useFormInstance()

  // Handle product selection
  const handleProductSelect = (productId, option) => {
    console.log("Selected product ID:", productId)
    console.log("Option data:", option)

    if (option && option.costPrice) {
      const productPrice = Number.parseFloat(option.costPrice) || 0
      console.log("Setting price to:", productPrice)

      // Set the form field value directly
      form.setFieldsValue({
        items: {
          ...form.getFieldValue("items"),
          [field.name]: {
            ...form.getFieldValue(["items", field.name]),
            price: productPrice,
            itemName: productId,
            description: option.description || option.name || "",
          },
        },
      })

      // Force form to trigger onValuesChange
      setTimeout(() => {
        form.validateFields([["items", field.name, "price"]])
      }, 100)
    }
  }

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const quantity = Number.parseFloat(value) || 0
    const price = form.getFieldValue(["items", field.name, "price"]) || 0
    const total = calculate.multiply(quantity, price)

    // Update total in form
    form.setFieldValue(["items", field.name, "total"], total)
    setTotal(total)
  }

  // Handle price change
  const handlePriceChange = (value) => {
    const price = Number.parseFloat(value) || 0
    const quantity = form.getFieldValue(["items", field.name, "quantity"]) || 0
    const total = calculate.multiply(quantity, price)

    // Update total in form
    form.setFieldValue(["items", field.name, "total"], total)
    setTotal(total)
  }

  // Calculate total when price or quantity changes
  const calculateTotal = () => {
    const formValues = form.getFieldValue(["items", field.name]) || {}
    const price = Number.parseFloat(formValues.price) || 0
    const quantity = Number.parseFloat(formValues.quantity) || 0
    const total = calculate.multiply(price, quantity)

    setTotal(total)
    form.setFieldValue(["items", field.name, "total"], total)
  }

  // Watch for form value changes
  useEffect(() => {
    const subscription = form.getFieldsValue()
    calculateTotal()
  }, [form.getFieldsValue()])

  useEffect(() => {
    if (current) {
      const { items, invoice } = current
      if (invoice) {
        const item = invoice[field.fieldKey]
        if (item) {
          form.setFieldsValue({
            items: {
              [field.name]: {
                quantity: item.quantity,
                price: item.price,
                itemName: item.itemName,
                description: item.description,
              },
            },
          })
        }
      } else {
        const item = items?.[field.fieldKey]
        if (item) {
          form.setFieldsValue({
            items: {
              [field.name]: {
                quantity: item.quantity,
                price: item.price,
                itemName: item.itemName,
                description: item.description,
              },
            },
          })
        }
      }
    }
  }, [current])

  return (
    <Row gutter={[12, 12]} style={{ position: "relative" }}>
      <Col className="gutter-row" span={5}>
        <Form.Item
          name={[field.name, "itemName"]}
          rules={[
            {
              required: true,
              message: "Missing product selection",
            },
          ]}
        >
          <AutoCompleteAsyncObject
            entity={"product"}
            withRedirect
            displayLabels={["name"]}
            searchFields={"name"}
            redirectLabel={"Add New Product"}
            urlToRedirect={"/product"}
            onChange={handleProductSelect}
          />
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={7}>
        <Form.Item name={[field.name, "description"]}>
          <Input placeholder="Description (auto-filled from product)" />
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={3}>
        <Form.Item name={[field.name, "quantity"]} rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} onChange={handleQuantityChange} placeholder="0" />
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={4}>
        <Form.Item name={[field.name, "price"]} rules={[{ required: true }]}>
          <InputNumber
            className="moneyInput"
            onChange={handlePriceChange}
            min={0}
            controls={false}
            addonAfter={money.currency_position === "after" ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === "before" ? money.currency_symbol : undefined}
            placeholder="0.00"
          />
        </Form.Item>
      </Col>

      <Col className="gutter-row" span={5}>
        <Form.Item name={[field.name, "total"]}>
          <InputNumber
            readOnly
            className="moneyInput"
            value={totalState}
            min={0}
            controls={false}
            addonAfter={money.currency_position === "after" ? money.currency_symbol : undefined}
            addonBefore={money.currency_position === "before" ? money.currency_symbol : undefined}
            formatter={(value) => money.amountFormatter({ amount: value, currency_code: money.currency_code })}
          />
        </Form.Item>
      </Col>

      <div style={{ position: "absolute", right: "-20px", top: " 5px" }}>
        <DeleteOutlined onClick={() => remove(field.name)} />
      </div>
    </Row>
  )
}
