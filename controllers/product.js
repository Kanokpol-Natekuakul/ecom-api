const prisma = require("../config/prisma");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, images, categoryId } = req.body;
    // console.log(title, description, price, quantity, images);
    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,       // ต้องเป็น snake_case ตาม schema
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    // console.log(product);
    res.send(product);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}
exports.getProduct = async (req, res) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        images: true,
        category: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}
exports.read = async (req, res) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findFirst({
      where: { id: Number(req.params.id) },
      include: {
        images: true,
        category: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.update = async (req, res) => {
  try {
    const { title, description, price, quantity, images, categoryId } = req.body;

    await prisma.image.deleteMany({
      where: {
        productId: Number(req.params.id),
      },
    });
    // console.log(title, description, price, quantity, images);
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    // console.log(product);
    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where:{id:Number(id)},
      include:{images:true}
    })
    // console.log(product)
    if(!product){
      return res.status(400).json('Product not found')
    }
    const deleteImage = product.images.map((image)=>
    new Promise((resolve,reject)=>{
      cloudinary.uploader.destroy(image.public_id,(error,result)=>{
        if(error) reject(error)
          else resolve(result)
      })
    })
    )
    await Promise.all(deleteImage)
    await prisma.product.delete({
      where: { id: Number(id) }
    });
    res.send(`Product deleted successfully`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.getProductsByCount = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    console.log(sort, order, limit);
    const products = await prisma.product.findMany({
      take: (limit),
      orderBy: {
        [sort]: order,
      },
      include: {
        category: true,
        images:true,
      },
    });
    res.send(products);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,

        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const handleprice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}
const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },

      include: {
        category: true,
        images: true,
      },

    });
    res.send(products);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.searchProducts = async (req, res) => {
  try {
    const { query, category, price } = req.body;
    if (query) {
      console.log(query);
      await handleQuery(req, res, query);
    }
    if (category) {
      console.log(category);
      await handleCategory(req, res, category);
    }
    if (price) {
      console.log(price);
      await handleprice(req, res, price);
    }
    // res.send("hello");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
}



exports.images = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
      folder: 'Ecom'
    })
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "server error" })
  }
}
exports.removeImage = async (req, res) => {
  try {
    // console.log(req.body.public_id)
    const {public_id} = req.body
    // console.log(public_id)
    cloudinary.uploader.destroy(public_id,(result)=>{

      res.send('Remove image success')
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "server error" })
  }
}