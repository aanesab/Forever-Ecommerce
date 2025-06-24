import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js";
import userModel from "../models/userModel.js";

jest.mock("../models/userModel.js");

describe("Cart Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  it("should add new item and size to cart", async () => {
    req.body = { userId: "user1", itemId: "item1", size: "M" };
    userModel.findById.mockResolvedValue({ cartData: {} });
    userModel.findByIdAndUpdate.mockResolvedValue(true);

    await addToCart(req, res);

    expect(userModel.findById).toHaveBeenCalledWith("user1");
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user1", {
      cartData: { item1: { M: 1 } },
    });
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Added To Cart" });
  });

  it("should increment quantity if item and size exist", async () => {
    req.body = { userId: "user1", itemId: "item1", size: "M" };
    userModel.findById.mockResolvedValue({ cartData: { item1: { M: 2 } } });
    userModel.findByIdAndUpdate.mockResolvedValue(true);

    await addToCart(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user1", {
      cartData: { item1: { M: 3 } },
    });
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Added To Cart" });
  });

  it("should add new size to existing item in cart", async () => {
    req.body = { userId: "user1", itemId: "item1", size: "L" };
    userModel.findById.mockResolvedValue({ cartData: { item1: { M: 1 } } });
    userModel.findByIdAndUpdate.mockResolvedValue(true);

    await addToCart(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user1", {
      cartData: { item1: { M: 1, L: 1 } },
    });
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Added To Cart" });
  });

  it("should handle error in addToCart", async () => {
    req.body = { userId: "user1", itemId: "item1", size: "M" };
    userModel.findById.mockRejectedValue(new Error("DB error"));

    await addToCart(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: false, message: "DB error" });
  });

  it("should update quantity of specific item and size", async () => {
    req.body = { userId: "user1", itemId: "item1", size: "M", quantity: 5 };
    userModel.findById.mockResolvedValue({ cartData: { item1: { M: 2 } } });
    userModel.findByIdAndUpdate.mockResolvedValue(true);

    await updateCart(req, res);

    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith("user1", {
      cartData: { item1: { M: 5 } },
    });
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Cart Updated" });
  });

  it("should handle error in updateCart", async () => {
    req.body = { userId: "user1", itemId: "item1", size: "M", quantity: 5 };
    userModel.findById.mockRejectedValue(new Error("DB error"));

    await updateCart(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: false, message: "DB error" });
  });

  it("should return cart data for user", async () => {
    req.body = { userId: "user1" };
    const mockCartData = { item1: { M: 2 }, item2: { L: 1 } };
    userModel.findById.mockResolvedValue({ cartData: mockCartData });

    await getUserCart(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, cartData: mockCartData });
  });

  it("should handle error in getUserCart", async () => {
    req.body = { userId: "user1" };
    userModel.findById.mockRejectedValue(new Error("DB error"));

    await getUserCart(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: false, message: "DB error" });
  });
});
