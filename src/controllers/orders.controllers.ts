import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import OrderStatus from '../enums/orderStatus.enum'

import { OrderStore } from '../models/order.model'
import Order from '../types/order.type'
import OrderProduct from '../types/orderProducts.type'

const orderStore = new OrderStore()

export const getOrderByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const orderData = await orderStore.getUserOrders(
      Number(req.params.user_id),
      req.body.order_status
    )
    if (!orderData) {
      return res.json({
        status: 'failed',
        message: 'no orders found for this user id',
      })
    }
    res.json({
      status: 'success',
      data: orderData,
    })
  } catch (err) {
    next(err)
  }
}

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const orderData = await orderStore.getByColumn(
      'id',
      req.params.id as unknown as number
    )
    if (!orderData) {
      return res
        .status(403)
        .json({ status: 'failed', message: 'Order not found' })
    }
    res.json({
      status: 'success',
      data: orderData || {},
    })
  } catch (err) {
    next(err)
  }
}

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const orderData = await orderStore.getOrderDetails(Number(req.params.id))

    res.json({
      status: 'success',
      data: orderData || {},
    })
  } catch (err) {
    next(err)
  }
}

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const orderData: Order = {
      user_id: req.body.user_id,
      status: OrderStatus.active,
    }

    const createdOrder = await orderStore.create(
      orderData,
      req.body.products as unknown as OrderProduct[]
    )
    res.json({
      status: 'success',
      data: createdOrder || [],
    })
  } catch (err) {
    next(err)
  }
}

export const completeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const orderData: Order = (await orderStore.getByColumn(
      'id',
      req.params.id
    )) as unknown as Order

    if (orderData.status == OrderStatus.completed) {
      return res.status(403).json({
        status: 'failed',
        message: 'order already completed',
      })
    }
    await orderStore.completeOrder(Number(orderData.id))
    res.json({
      status: 'success',
      message: 'order completed successfully',
    })
  } catch (err) {
    next(err)
  }
}
