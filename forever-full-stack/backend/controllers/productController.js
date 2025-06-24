import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    if (!name || !description || !price || !category || !sizes) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    if (name.length < 5 || name.length > 18 || /[^a-zA-Z\s]/.test(name)) {
      return res.status(400).json({ success: false, message: "Invalid product name." });
    }

    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 120 || /<[^>]*>/.test(description)) {
      return res.status(400).json({ success: false, message: "Invalid product description." });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 15 || parsedPrice > 90) {
      return res.status(400).json({ success: false, message: "Invalid product price." });
    }

    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch {
      return res.status(400).json({ success: false, message: "Invalid sizes format" });
    }

    if (!Array.isArray(parsedSizes) || parsedSizes.length < 2) {
      return res.status(400).json({ success: false, message: "At least two sizes must be selected." });
    }

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);
    if (images.length < 2) {
      return res.status(400).json({ success: false, message: "At least two images are required." });
    }

    const imagesUrl = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: parsedPrice,
      category,
      subCategory,
      bestseller: bestseller === "true",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product Added" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params?.id || req.body?.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
