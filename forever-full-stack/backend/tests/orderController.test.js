import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  verifyStripe,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus
} from "../controllers/orderController.js";

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

jest.mock("../models/orderModel.js");
jest.mock("../models/userModel.js");
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => {
    return {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ url: "http://mock-stripe-session" })
        }
      }
    };
  });
});
jest.mock("razorpay", () => {
  return jest.fn().mockImplementation(() => {
    return {
      orders: {
        create: jest.fn(),
        fetch: jest.fn()
      }
    };
  });
});

describe("Order Controller Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, headers: {}, params: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  it("should place an order with COD", async () => {
    req.body = { userId: "123", items: [{ name: "Test" }], amount: 50, address: "Street" };
    orderModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue(true) }));

    await placeOrder(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Order Placed" });
  });

  it("should create stripe session", async () => {
    req.body = { userId: "123", items: [{ name: "Test", price: 10, quantity: 1 }], amount: 50, address: "Street" };
    req.headers.origin = "http://localhost";
    orderModel.mockImplementation(() => ({ _id: "order123", save: jest.fn().mockResolvedValue(true) }));

    await placeOrderStripe(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, session_url: "http://mock-stripe-session" });
  });

  it("should verify stripe success", async () => {
    req.body = { orderId: "123", success: "true", userId: "abc" };

    await verifyStripe(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("should delete order on stripe failure", async () => {
    req.body = { orderId: "123", success: "false", userId: "abc" };

    await verifyStripe(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false });
  });

  it("should place order and create razorpay order", async () => {
    const mockCreate = jest.fn((opts, cb) => cb(null, { id: "razor123" }));
    Razorpay.mockImplementation(() => ({ orders: { create: mockCreate } }));

    req.body = { userId: "123", items: [], amount: 100, address: "Street" };
    orderModel.mockImplementation(() => ({ _id: "abc", save: jest.fn().mockResolvedValue(true) }));

    await placeOrderRazorpay(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, order: { id: "razor123" } });
  });

  it("should verify razorpay paid order", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ status: "paid", receipt: "123" });
    Razorpay.mockImplementation(() => ({ orders: { fetch: fetchMock } }));
    req.body = { userId: "abc", razorpay_order_id: "r123" };

    await verifyRazorpay(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Payment Successful" });
  });

  // verifyRazorpay - failed status
  it("should handle razorpay failed payment", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ status: "failed" });
    Razorpay.mockImplementation(() => ({ orders: { fetch: fetchMock } }));
    req.body = { userId: "abc", razorpay_order_id: "r123" };

    await verifyRazorpay(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Payment Failed" });
  });

  it("should fetch all orders", async () => {
    orderModel.find.mockResolvedValue([{}, {}]);

    await allOrders(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, orders: [{}, {}] });
  });

  it("should fetch user orders", async () => {
    req.body = { userId: "u1" };
    orderModel.find.mockResolvedValue([{ id: 1 }]);

    await userOrders(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, orders: [{ id: 1 }] });
  });

  it("should update order status", async () => {
    req.body = { orderId: "o1", status: "shipped" };

    await updateStatus(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Status Updated" });
  });
});
