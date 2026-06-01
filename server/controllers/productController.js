const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.keyword) {
        filter.name = {
            $regex: req.query.keyword,
            $options: "i",
        };
    }

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};

        if (req.query.minPrice) {
            filter.price.$gte = Number(req.query.minPrice);
        }

        if (req.query.maxPrice) {
            filter.price.$lte = Number(req.query.maxPrice);
        }
    }

    const sort = {};

    if (req.query.sort) {
      switch (req.query.sort) {
        case "price_asc":
          sort.price = 1;
          break;

        case "price_desc":
          sort.price = -1;
          break;

        case "name_asc":
          sort.name = 1;
          break;

        case "newest":
          sort.createdAt = -1;
          break;

        default:
          break;
      }
    }

    const pageSize = 5;
    const page = Number(req.query.page) || 1;

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
      

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      stock,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = req.body.name || product.name;
    product.description =
      req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.category =
      req.body.category || product.category;
    product.stock = req.body.stock || product.stock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProductReview = async (
  req,
  res
) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (review) =>
          review.user.toString() ===
          req.user._id.toString()
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "Product already reviewed",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews =
      product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllProducts = async (
  req,
  res
) => {
  try {
    const products =
      await Product.find({});

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSuggestions =
  async (req, res) => {
    try {
      const keyword =
        req.query.keyword;

      const products =
        await Product.find({
          name: {
            $regex: keyword,
            $options: "i",
          },
        })
          .select("name")
          .limit(5);

      res.json(products);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllProducts,
  getSuggestions,
};

