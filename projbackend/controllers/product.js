const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const productController = {
  getProductById: (req, res, next, id) => {
    Product.findById(id)
      .populate("category")
      .exec((err, product) => {
        if (err) {
          return res.status(400).json({
            error: "Product not found",
          });
        }
        req.product = product;
        next();
      });
  },
  createProduct: async (req, res) => {
    try {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;

      await form.parse(req, async (err, fields, file) => {
        if (err) {
          return res.status(400).json({
            error: "problem with image",
          });
        }
        //destructure the fields
        const { name, description, price, category, stock } = fields;
        if (!name || !description || !price || !category || !stock) {
          return res.status(400).json({
            error: "Please include all fields",
          });
        }
        let product = new Product(fields);
        //handle file here
        if (file.photo) {
          if (file.photo.size > 3000000) {
            return res.status(400).json({
              error: "File size too big!",
            });
          }
          product.photo.data = fs.readFileSync(file.photo.path);
          product.photo.contentType = file.photo.type;
        }
        await product.save();
        return res.status(200).json(product);
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId)
        .select("-photo")
        .populate("category");
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getPhoto: (req, res, next) => {
    if (req.product.photo.data) {
      res.set("Content-Type", req.product.photo.contentType);
      return res.send(req.product.photo.data);
    }
    next();
  },

  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      let product = await Product.findById(productId);
      await Product.deleteOne(product);
      return res.json({
        message: "Deletion was a success",
        product,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  updateProduct: (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "problem with image",
        });
      }

      //updation code
      let product = req.product;
      product = _.extend(product, fields);

      //handle file here
      if (file.photo) {
        if (file.photo.size > 3000000) {
          return res.status(400).json({
            error: "File size too big!",
          });
        }
        product.photo.data = fs.readFileSync(file.photo.path);
        product.photo.contentType = file.photo.type;
      }
      // console.log(product);

      //save to the DB
      product.save((err, product) => {
        if (err) {
          res.status(400).json({
            error: "Updation of product failed",
          });
        }
        return res.json(product);
      });
    });
  },
  getAllProducts: async (req, res) => {
    try {
      let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
      const products = await Product.find({})
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]]);
      if (!products) {
        return res.json({ error: "NO Products found!" });
      }
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  updateStock: (req, res, next) => {
    let myOperations = req.body.order.products.map((prod) => {
      return {
        updateOne: {
          filter: { _id: prod._id },
          update: { $inc: { stock: -prod.count, sold: +prod.count } },
        },
      };
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Bulk operation failed",
        });
      }
      next();
    });
  },
  getAllUniqueCategories: async (req, res) => {
    await Product.distinct("category", {}, (err, category) => {
      if (err) {
        return res.status(400).json({
          error: "NO category found",
        });
      }
      res.json(category);
    });
  },
};

module.exports = productController;
