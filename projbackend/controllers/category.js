const Category = require("../models/category");

const categoryController = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const newCategory = new Category({ name });
      await newCategory.save();
      return res.json({ msg: "Category added" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const findCategory = await Category.findById(categoryId);
      if (!findCategory) {
        return res.json({ err: "Not found this Category" });
      }
      return res.json(findCategory);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  getcategories: async (req, res) => {
    try {
      const categories = await Category.find().select("name");
      if (!categories) {
        return res.json({ err: "No Category found!" });
      }
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      let findCategory = await Category.findById(categoryId);
      if (!findCategory) {
        return res.json({ err: "Not found this Category" });
      }
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { $set: req.body },
        { new: true, useFindAndModify: false }
      );
      return res.json(updatedCategory);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const findCategory = await Category.findById(categoryId);
      if (!findCategory) {
        return res.json({ err: "Not found this Category" });
      }
      await Category.deleteOne(findCategory);
      return res.json({ msg: "Category successfully deleted!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = categoryController;
