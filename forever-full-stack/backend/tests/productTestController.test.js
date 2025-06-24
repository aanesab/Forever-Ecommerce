import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct
} from "../controllers/productController.js";

import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

jest.mock("cloudinary", () => ({
  v2: {
    uploader: { upload: jest.fn() }
  }
}));

jest.mock("../models/productModel.js");

describe("Product Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, files: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  it("should add a product successfully", async () => {
    req.body = {
      name: "Test Product",
      description: "Valid description",
      price: "49.99",
      category: "Cat",
      subCategory: "Sub",
      sizes: JSON.stringify(["S", "M"]),
      bestseller: "true"
    };
    req.files = {
      image1: [{ path: "fake-path-1" }],
      image2: [{ path: "fake-path-2" }]
    };

    cloudinary.uploader.upload.mockResolvedValue({ secure_url: "http://image.com/img.jpg" });

    productModel.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true)
    }));

    await addProduct(req, res);

    expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Product Added" });
  });

  it("should fail to add product due to missing fields", async () => {
    req.body = { name: "Missing" };
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Missing required fields." });
  });

  it("should fail if sizes is not valid JSON", async () => {
    req.body = {
      name: "Invalid Sizes",
      description: "Desc",
      price: "10",
      category: "Cat",
      sizes: "not-a-json"
    };
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid sizes format" });
  });

  it("should reject name shorter than 5 characters", async () => {
    req.body = {
      name: "Abc",
      description: "Valid description",
      price: "20",
      category: "Cat",
      sizes: JSON.stringify(["S", "M"])
    };
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject name longer than 18 characters", async () => {
    req.body.name = "a".repeat(19);
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject name with symbols or numbers", async () => {
    req.body.name = "Product123#@!";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject empty name", async () => {
    req.body.name = "";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject empty description", async () => {
    req.body.description = "";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject description with > 120 words", async () => {
    req.body.description = "word ".repeat(121);
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject description with code", async () => {
    req.body.description = "<script>alert('hack')</script>";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject price below 15", async () => {
    req.body.price = "10";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject price above 90", async () => {
    req.body.price = "91";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject empty price", async () => {
    req.body.price = "";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject SQL-like price input", async () => {
    req.body.price = "25; DROP TABLE users;";
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject if less than 2 sizes selected", async () => {
    req.body.sizes = JSON.stringify(["L"]);
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should reject if no image uploaded", async () => {
    req.files = {};
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should list all products", async () => {
    const mockProducts = [{ name: "P1" }, { name: "P2" }];
    productModel.find.mockResolvedValue(mockProducts);

    await listProducts(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, products: mockProducts });
  });

  it("should return error in listProducts", async () => {
    productModel.find.mockRejectedValue(new Error("DB Error"));
    await listProducts(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "DB Error" });
  });

  it("should remove a product", async () => {
    req.params = { id: "123" };
    productModel.findByIdAndDelete.mockResolvedValue(true);
    await removeProduct(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Product Removed" });
  });

  it("should return error on removeProduct failure", async () => {
    req.params = { id: "123" };
    productModel.findByIdAndDelete.mockRejectedValue(new Error("Remove Error"));
    await removeProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Remove Error" });
  });

  it("should return a single product", async () => {
    req.body = { productId: "456" };
    const product = { name: "Product A" };
    productModel.findById.mockResolvedValue(product);
    await singleProduct(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, product });
  });

  it("should return error if singleProduct fails", async () => {
    req.body = { productId: "456" };
    productModel.findById.mockRejectedValue(new Error("Find Error"));
    await singleProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Find Error" });
  });
});
